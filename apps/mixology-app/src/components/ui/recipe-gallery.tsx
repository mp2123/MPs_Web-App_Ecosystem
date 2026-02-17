// apps/mixology-app/src/components/ui/recipe-gallery.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassWater, FileDown, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useTransition, useRef } from 'react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PrintableRecipeCard } from './printable-recipe-card';
import { toggleFavoriteAction } from '@/app/actions';

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  difficulty: string;
  glass: string;
  imageUrl: string;
}

interface RecipeGalleryProps {
    user: any;
    onSignInClick: () => void;
    initialFavorites: number[];
}

const recipes: Recipe[] = [
  { id: 1, name: "Paper Plane", ingredients: ["Bourbon", "Amaro Nonino", "Aperol", "Lemon"], difficulty: "Medium", glass: "Coupe", imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Negroni", ingredients: ["Gin", "Campari", "Sweet Vermouth"], difficulty: "Easy", glass: "Rocks", imageUrl: "https://images.unsplash.com/photo-1536935338213-d2c1238f91c6?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Last Word", ingredients: ["Gin", "Green Chartreuse", "Maraschino", "Lime"], difficulty: "Hard", glass: "Coupe", imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800" }
];

export function RecipeGallery({ user, onSignInClick, initialFavorites }: RecipeGalleryProps) {
  const [favorites, setFavorites] = useState<number[]>(initialFavorites);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const printRef = useRef<HTMLDivElement>(null);
  const [activePrintRecipe, setActivePrintRecipe] = useState<any>(null);

  const handleToggleFavorite = (recipeId: number) => {
    if (!user) {
      onSignInClick();
      return;
    }
    
    startTransition(async () => {
      setFavorites(prev => 
        prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
      );
      await toggleFavoriteAction(recipeId);
    });
  };

  const downloadRecipe = async (recipe: Recipe, index: number) => {
    setDownloading(index);
    setActivePrintRecipe(recipe);
    
    setTimeout(async () => {
      if (!printRef.current) return;
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
      pdf.save(`Recipe-${recipe.name.replace(/\s+/g, '-')}.pdf`);
      setDownloading(null);
      setActivePrintRecipe(null);
    }, 100);
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20" id="recipes">
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">The Recipe Library</h2>
        <p className="text-muted-foreground">Classic structure. Modern execution.</p>
      </div>

      <div className="fixed left-[-9999px] top-[-9999px]">
        {activePrintRecipe && (<PrintableRecipeCard ref={printRef} recipe={activePrintRecipe} />)}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recipes.map((recipe, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <Card className="relative bg-black border-none overflow-hidden h-full flex flex-col">
                <div className="h-48 w-full overflow-hidden relative">
                  <img src={recipe.imageUrl} alt={recipe.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(recipe.id)} className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all group/heart" disabled={isPending}>
                    <Heart className={cn("h-5 w-5 transition-all duration-300", favorites.includes(recipe.id) ? "fill-red-500 text-red-500 scale-110" : "text-white group-hover/heart:scale-110")} />
                  </Button>
                </div>
                <CardHeader className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono text-primary border border-primary/20 px-2 py-0.5 rounded-full">{recipe.difficulty}</span>
                    <div className="flex gap-2 items-center">
                        <GlassWater className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground uppercase">{recipe.glass}</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{recipe.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-auto mb-6">
                    {recipe.ingredients.map((ing, j) => (<span key={j} className="text-[10px] bg-muted/50 px-2 py-1 rounded text-muted-foreground">{ing}</span>))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 text-xs font-bold uppercase tracking-widest group/btn hover:bg-primary hover:text-primary-foreground transition-all" onClick={() => downloadRecipe(recipe, i)} disabled={downloading === i}>
                    {downloading === i ? (<>Processing <Loader2 className="h-3.5 w-3.5 animate-spin" /></>) : (<>Download Card <FileDown className="h-3.5 w-3.s group-hover/btn:translate-y-0.5 transition-transform" /></>)}
                  </Button>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
