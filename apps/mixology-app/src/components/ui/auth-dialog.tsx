// apps/mixology-app/src/components/ui/auth-dialog.tsx
'use client';

import { createClient } from '@/utils/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const supabase = createClient();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/40 bg-background/95 backdrop-blur-xl p-0">
        <div className="p-8">
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                    default: {
                        colors: {
                            brand: 'hsl(var(--primary))',
                            brandAccent: 'hsl(var(--primary-hover))',
                            inputBackground: 'hsl(var(--muted))',
                            inputBorder: 'hsl(var(--border))',
                            inputBorderHover: 'hsl(var(--primary))',
                            inputText: 'hsl(var(--foreground))',
                            messageText: 'hsl(var(--muted-foreground))',
                        }
                        // NOTE: Removed 'radii' property that was causing a Vercel build error.
                    }
                }
              }}
              providers={['google']}
              magicLink={true}
              theme="dark"
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
