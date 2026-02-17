'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassWater, Beaker, Flame, Droplets } from 'lucide-react';

const recipes = [
  {
    name: "Paper Plane",
    ingredients: ["Bourbon", "Amaro Nonino", "Aperol", "Lemon"],
    difficulty: "Medium",
    glass: "Coupe",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Negroni",
    ingredients: ["Gin", "Campari", "Sweet Vermouth"],
    difficulty: "Easy",
    glass: "Rocks",
    imageUrl: "https://images.unsplash.com/photo-1536935338213-d2c1238f91c6?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Last Word",
    ingredients: ["Gin", "Green Chartreuse", "Maraschino", "Lime"],
    difficulty: "Hard",
    glass: "Coupe",
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800"
  }
];

export function RecipeGallery() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20" id="recipes">
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">The Recipe Library</h2>
        <p className="text-muted-foreground">Classic structure. Modern execution.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recipes.map((recipe, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <Card className="relative bg-black border-none overflow-hidden h-[450px]">
                <div className="h-1/2 w-full overflow-hidden">
                  <img src={recipe.imageUrl} alt={recipe.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono text-primary border border-primary/20 px-2 py-0.5 rounded-full">{recipe.difficulty}</span>
                    <div className="flex gap-2">
                        <GlassWater className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground uppercase">{recipe.glass}</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{recipe.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {recipe.ingredients.map((ing, j) => (
                      <span key={j} className="text-[10px] bg-muted/50 px-2 py-1 rounded text-muted-foreground">{ing}</span>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
