import re
import os
from difflib import SequenceMatcher

def clean_text(text):
    # Remove common OCR noise and nav junk
    text = re.sub(r'[©®™]', '', text)
    text = re.sub(r' \. \. \. .*?\.com', '', text)
    text = re.sub(r'\d+ of \d+ Questions Remaining', '', text)
    text = re.sub(r'Proceed —?_?>', '', text)
    text = re.sub(r'Submit Exam.*', '', text)
    text = re.sub(r'I< >I.*', '', text)
    text = re.sub(r'% 4a.*', '', text)
    text = re.sub(r'< \+ .*', '', text)
    # Be more careful with Explanation markers
    # Only replace if it looks like a section header
    text = re.sub(r'^(?:és|ds|is|ds)\s+', 'EXPLANATION: ', text, flags=re.IGNORECASE | re.MULTILINE)
    text = re.sub(r'\n(?:és|ds|is|ds)\s+', '\nEXPLANATION: ', text, flags=re.IGNORECASE)
    
    text = re.sub(r'^\d+:\d+ (?:am|pm|al|ef|wo|oll).*', '', text, flags=re.MULTILINE)
    text = re.sub(r'(\n\s*)+', '\n', text).strip()
    return text

def similar(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def parse_consolidated(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    file_sections = content.split('--- File: ')
    questions = []
    
    for section in file_sections:
        if not section.strip(): continue
        body = clean_text(section)
        
        # Identify Question - Look for "Question X" and capture until "Options" or markers
        # We'll search for the question header
        q_header_match = re.search(r'Question (\d+)', body, re.IGNORECASE)
        if not q_header_match: continue
        
        q_num = q_header_match.group(1)
        
        # Start looking after "appropriate response" or "Question X"
        start_idx = q_header_match.end()
        instr_match = re.search(r'Select the appropriate response', body[start_idx:start_idx+100], re.IGNORECASE)
        if instr_match:
            start_idx += instr_match.end()
            
        # The body of the question ends when options start
        # Options usually start with x), g, iv), bullet, or radio button
        options_start_match = re.search(r'\n([xgiv©*O]\s?|[a-d]\)\s|\()', body[start_idx:])
        if options_start_match:
            q_text = body[start_idx:start_idx + options_start_match.start()].strip()
            options_block = body[start_idx + options_start_match.start():]
        else:
            # Fallback
            q_text = body[start_idx:].split('\n\n')[0].strip()
            options_block = body[start_idx + len(q_text):]

        # Identify Explanation
        explanation_match = re.search(r'EXPLANATION:\s+(.*)', body, re.DOTALL | re.IGNORECASE)
        explanation = explanation_match.group(1).strip() if explanation_match else ""
        if explanation_match:
            # Trim options block if it contains the explanation
            expl_start_in_block = options_block.find('EXPLANATION:')
            if expl_start_in_block != -1:
                options_block = options_block[:expl_start_in_block]
        
        # Split options
        option_lines = re.split(r'\n(?=[xgiv©*O]\s?|[a-d]\)\s|\()', options_block)
        cleaned_options = []
        for opt in option_lines:
            opt = opt.strip()
            if not opt or len(opt) < 2: continue
            
            is_selected = False
            # Markers indicating selection/correctness in OCR
            if re.match(r'^(g|iv\)|\*|©|v\))\s', opt, re.I):
                is_selected = True
            
            # Clean marker
            cleaned_opt = re.sub(r'^(?:[xgiv©*Oa-d]\s?|[a-d]\)\s|\)\s|\(\s?\)\s?|\[\s?\]\s?|v\)\s?)', '', opt).strip()
            if cleaned_opt and len(cleaned_opt) > 1:
                cleaned_options.append({'text': cleaned_opt, 'correct': is_selected})

        # Correct answer logic
        if explanation:
            found_correct = False
            for opt in cleaned_options:
                if opt['text'].lower() in explanation.lower() or similar(opt['text'], explanation) > 0.5:
                    opt['correct'] = True
                    found_correct = True
                else:
                    opt['correct'] = False
            if not found_correct and cleaned_options:
                best = max(cleaned_options, key=lambda o: similar(o['text'], explanation))
                if similar(best['text'], explanation) > 0.2:
                    best['correct'] = True

        q_id = re.sub(r'\W+', '', q_text.lower())
        if q_id and len(q_id) > 5:
            questions.append({
                'id': q_id,
                'num': q_num,
                'text': q_text,
                'options': cleaned_options,
                'explanation': explanation
            })

    unique_questions = []
    seen_ids = set()
    for q in questions:
        if q['id'] not in seen_ids:
            unique_questions.append(q)
            seen_ids.add(q['id'])

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Life Insurance AZ 2026 Consolidated Study Guide\n\n")
        for i, q in enumerate(unique_questions):
            f.write(f"### Question {i+1}: {q['text']}\n\n")
            f.write("**Options:**\n")
            if not q['options']:
                f.write("(No options found in OCR)\n")
            for opt in q['options']:
                marker = "[x]" if opt['correct'] else "[ ]"
                f.write(f"- {marker} {opt['text']} {'(Correct)' if opt['correct'] else ''}\n")
            
            if q['explanation']:
                f.write(f"\n**Explanation:**\n{q['explanation']}\n")
            f.write("\n---\n\n")

if __name__ == "__main__":
    input_file = "/Users/michael_s_panico/Desktop/Life insurance photos/ALL OCR OCR extracted images for Life Insurance AZ 2026/consolidated_raw.txt"
    output_file = "/Users/michael_s_panico/Desktop/Life insurance photos/ALL OCR OCR extracted images for Life Insurance AZ 2026/Life_Insurance_AZ_2026_Study_Guide.md"
    parse_consolidated(input_file, output_file)
