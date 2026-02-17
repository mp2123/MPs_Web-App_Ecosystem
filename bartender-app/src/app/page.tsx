"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header-1";
import { Chatbot } from "@/components/ui/chatbot";
import { StudyDashboard } from "@/components/ui/dashboard";
import { Flashcards } from "@/components/ui/flashcards";
import { HeroSection, LogosSection } from "@/components/ui/hero-1";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { DotScreenShader } from "@/components/ui/dot-shader-background";
import { SplineScene } from "@/components/ui/splite";
import { HalideLanding } from "@/components/ui/halide-topo-hero";
import { renderCanvas } from "@/components/ui/canvas";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Box, Settings, Lock, Sparkles, Search, Video, Wine, Utensils, Award } from "lucide-react";
import { cn } from "@/lib/utils";

import { CardScanner } from "@/components/ui/card-scanner";
import { VideoGallery } from "@/components/ui/video-gallery";
import { RecipeGallery } from "@/components/ui/recipe-gallery";
import { AffiliateStore } from "@/components/ui/affiliate-store";

export default function DemoOne() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    renderCanvas();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="flex w-full flex-col relative bg-background overflow-x-hidden">
      {/* Interactive Canvas Background for Hero */}
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto z-0 opacity-30"
        id="canvas"
      ></canvas>

      <Header />

      <main className="grow relative z-10">
        {/* Hero with Canvas */}
        <HeroSection />

        {/* Digital Recipe Discovery Section */}
        <section className="w-full mt-20">
          <CardScanner />
        </section>

        {/* The Recipe Library */}
        <RecipeGallery />

        {/* Video Tutorial Vault */}
        <VideoGallery />

        {/* 3D Topographical Hero Section */}
        <section className="w-full mt-20">
          <HalideLanding />
        </section>

        {/* 3D Scroll Animation Section */}
        <section className="flex flex-col overflow-hidden bg-background">
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-semibold text-foreground text-center">
                  Master the Art of <br />
                  <span className="text-5xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                    Mixology
                  </span>
                </h1>
              </div>
            }
          >
            <div className="relative h-full w-full bg-muted flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200"
                    alt="Mixology Lab Dashboard"
                    fill
                    className="object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                    <p className="text-white text-3xl font-bold">Interactive Mixology Platform</p>
                </div>
            </div>
          </ContainerScroll>
        </section>

        {/* Professional Bar Gear Shop */}
        <AffiliateStore />

        {/* Interactive Spline 3D Section */}
        <section className="mx-auto w-full max-w-5xl px-4 py-20">
            <Card className="w-full h-[600px] bg-black/[0.96] relative overflow-hidden border-border/40 shadow-2xl">
                <div className="flex h-full flex-col md:flex-row">
                    {/* Left content */}
                    <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                            Immersive 3D <br /> Cocktail Lab
                        </h1>
                        <p className="mt-6 text-neutral-300 max-w-lg text-lg">
                            Visualizing flavor. Explore 3D scenes that break down spirit profiles, ingredient origins, and advanced garnishing techniques.
                        </p>
                        <div className="mt-8">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                                Open Mixology Lab
                            </button>
                        </div>
                    </div>

                    {/* Right content - Spline Scene */}
                    <div className="flex-1 relative h-full min-h-[300px]">
                        <SplineScene 
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </Card>
        </section>

        {/* Glowing Dashboard Section */}
        <section className="mx-auto w-full max-w-5xl px-4 py-20">
            <h2 className="text-4xl font-bold text-center mb-16 uppercase tracking-tighter">Mixology Excellence</h2>
            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                    icon={<Wine className="h-4 w-4" />}
                    title="Spirit Mastery"
                    description="Deep dive into Bourbon, Gin, Tequila, and Amaro structures."
                />
                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                    icon={<Video className="h-4 w-4" />}
                    title="Video Tutorials"
                    description="Watch high-definition guides on techniques and riffs."
                />
                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                    icon={<Award className="h-4 w-4" />}
                    title="Advanced Flair"
                    description="Master the visual performance of professional service."
                />
                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Cocktail AI"
                    description="Creative riffs generated by our custom mixology engine."
                />
                <GridItem
                    area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                    icon={<Utensils className="h-4 w-4" />}
                    title="Pro Gear"
                    description="Curated tools and essentials for the modern home bar."
                />
            </ul>
        </section>

        {/* Existing Components */}
        <Flashcards />
        <StudyDashboard />

        {/* Dot Shader Background Section */}
        <section className="relative w-full h-[500px] mt-20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <DotScreenShader />
            </div>
            <div className="relative z-10 text-center pointer-events-none px-4">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mix-blend-exclusion text-white uppercase">
                    Mixology Reimagined
                </h1>
                <p className="text-xl md:text-2xl font-light text-white mix-blend-exclusion max-w-2xl mx-auto mt-4">
                    The fusion of cutting-edge tech and world-class bartending techniques.
                </p>
            </div>
        </section>

        <LogosSection />
      </main>

      <Chatbot />
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3 overflow-hidden">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
