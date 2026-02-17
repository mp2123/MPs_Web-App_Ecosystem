# Implementation Plan: New Bartending Portfolio & Web App

This roadmap details the process of duplicating and transforming the existing high-end architecture into a personal Bartending platform for videos, recipes, and affiliate marketing.

## 1. Environment & Setup
- **Duplication:** Clone the `frontend` directory into a new `bartending-app` folder.
- **New Database:** Create a separate **Supabase** project specifically for the bartending app to keep the data isolated.
- **Hosting:** Set up a new **Vercel** project linked to a new GitHub repository.

## 2. Data Migration & Content
- **Database Schema:** 
  - Replace the `Question` table with a `Recipe` table (Ingredients, Steps, Glassware).
  - Add a `Media` table for YouTube/Instagram video links.
  - Add a `Product` table for Affiliate Links (shakers, jiggers, syrups).
- **Video Strategy:** Use `iframe` embeds or optimized `<video>` tags for personal bartending clips.

## 3. Visual & Aesthetic Overhaul
- **Branding:** Shift the color palette from "Insurance Corporate" (Blue/Gold) to "Bartender Professional" (Amber, Dark Charcoal, Glassmorphism).
- **Hero Update:** Tweak the `canvas.tsx` liquid mercury effect to resemble various cocktails (e.g., Old Fashioned amber, Margarita green).
- **3D Hero:** Replace the topographical Arizona map with a 3D cocktail glass or a "Mixology Map."
- **Evervault Scanner:** Transform this into an "Ingredients Scanner" or "Bottle Glitch" gallery.

## 4. AI Mixologist
- Update the chatbot system prompt to be a **Master Mixologist**.
- Features: "What can I make with these ingredients?", "Cocktail history", and "Pairing suggestions."

## 5. Affiliate Integration
- Create custom `GlowCard` components for "Recommended Tools."
- Links will be managed in Supabase for easy updates without redeploying code.

---
*Date: February 17, 2026*
