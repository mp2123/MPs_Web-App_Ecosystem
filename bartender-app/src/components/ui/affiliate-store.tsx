'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const products = [
  {
    title: "Koriko Boston Shaker Tins",
    description: "Weighted professional tins for perfect balance and temperature control.",
    price: "$34.95",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
    url: "https://cocktailkingdom.com/products/koriko-weighted-shaking-tins",
    category: "Tools"
  },
  {
    title: "Japanese Precision Jigger",
    description: "Precision measurements for balanced mixology. Stainless steel.",
    price: "$18.00",
    imageUrl: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&q=80&w=400",
    url: "https://amazon.com/dp/B0036X4YRY",
    category: "Tools"
  },
  {
    title: "Hendrick's Gin",
    description: "Premium gin infused with rose and cucumber. Master's choice.",
    price: "$39.99",
    imageUrl: "https://images.unsplash.com/photo-1632935187088-ec0bc9ba2bf5?auto=format&fit=crop&q=80&w=400",
    url: "#",
    category: "Spirits"
  },
  {
    title: "Vault City: Iron Brew Sour",
    description: "Modern fruited sour from Edinburgh. Sharp, tart, and intense.",
    price: "£6.50",
    imageUrl: "https://images.unsplash.com/photo-1618889482923-38250401a84e?auto=format&fit=crop&q=80&w=400",
    url: "https://vaultcity.co.uk/collections/all",
    category: "Beer"
  }
];

export function AffiliateStore() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20" id="tools">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 text-primary">Pro Gear Shop</h2>
        <div className="h-1 w-20 bg-primary mb-6" />
        <p className="text-muted-foreground text-center max-w-xl">
          Curated barware and spirits I use daily. High-performance tools for professional results.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border/40 bg-muted/10 backdrop-blur-xl overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-primary flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> BEST SELLER
                </div>
              </div>
              <CardHeader className="p-5 flex-1">
                <div className="text-[10px] font-mono text-primary mb-2 tracking-widest uppercase">{product.category}</div>
                <CardTitle className="text-xl leading-tight mb-2">{product.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed line-clamp-3">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 mt-auto">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl font-black tabular-nums">{product.price}</span>
                  <a href={product.url} target="_blank" className="flex-1">
                    <Button className="w-full rounded-full gap-2 group/btn shadow-lg shadow-primary/20">
                      View Item <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
