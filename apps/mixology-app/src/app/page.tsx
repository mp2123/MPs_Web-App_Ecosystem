// apps/mixology-app/src/app/page.tsx
'use client';
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Header } from "@/components/ui/header-1";
import { RecipeGallery } from "@/components/ui/recipe-gallery";
import { AuthDialog } from "@/components/ui/auth-dialog";
// Import other components as before...
import { Chatbot } from "@/components/ui/chatbot";
import { HeroSection, LogosSection } from "@/components/ui/hero-1";
import { CardScanner } from "@/components/ui/card-scanner";
import { VideoGallery } from "@/components/ui/video-gallery";
import { AffiliateStore } from "@/components/ui/affiliate-store";
import { AboutTheBartender } from "@/components/ui/about-bartender";
import { RecipeRequestForm } from "@/components/ui/recipe-request-form";
import { BarBookDashboard } from "@/components/ui/bar-book-dashboard";
import { AffiliateDisclosure } from "@/components/ui/affiliate-disclosure";
import { SideTimelineNav } from "@/components/ui/side-timeline-nav";


export default function DemoOne() {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [initialFavorites, setInitialFavorites] = useState<number[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Here you would fetch the user's favorites from your DB
        // For demonstration, we're leaving it empty.
        // const { data: favorites } = await supabase.from('Favorite').select('recipeId');
        // if (favorites) setInitialFavorites(favorites.map(f => f.recipeId));
      }
    };
    getUser();
  }, []);

  return (
    <>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
      <div className="flex w-full flex-col relative bg-background overflow-x-hidden">
        <SideTimelineNav />
        <Header onSignInClick={() => setAuthDialogOpen(true)} />
        <main className="grow relative z-10">
          <section id="home"><HeroSection /></section>
          <section id="discovery" className="w-full mt-20"><CardScanner /></section>
          <section id="book"><BarBookDashboard /></section>
          <RecipeGallery 
            user={user} 
            onSignInClick={() => setAuthDialogOpen(true)} 
            initialFavorites={initialFavorites}
          />
          <section id="tutorials"><VideoGallery /></section>
          <section id="tools"><AffiliateStore /></section>
          <section id="about"><AboutTheBartender /></section>
          <section id="request"><RecipeRequestForm /></section>
          <LogosSection />
        </main>
        <AffiliateDisclosure />
        <Chatbot />
      </div>
    </>
  );
}
