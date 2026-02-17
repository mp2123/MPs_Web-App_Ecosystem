const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  console.log("Connecting to Bartender Supabase DB...");
  
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log("✅ Connected!");

    // 1. Clear existing data for a fresh professional start
    console.log("Cleaning old data...");
    await client.query('TRUNCATE TABLE "Recipe", "AffiliateLink" RESTART IDENTITY CASCADE');

    // 2. Comprehensive Recipes (Classic + Modern + User Favs)
    const recipes = [
      {
        name: "Old Fashioned",
        ingredients: ["2 oz Bourbon or Rye", "1 Sugar Cube", "2 dashes Angostura Bitters", "Orange Peel"],
        instructions: "Place sugar cube in glass, saturate with bitters. Muddle until dissolved. Add whiskey and large ice cube. Stir well. Express orange peel over glass.",
        glassware: "Rocks Glass",
        category: "The Unforgettables",
        imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Negroni",
        ingredients: ["1 oz Gin", "1 oz Campari", "1 oz Sweet Vermouth"],
        instructions: "Stir all ingredients with ice in a mixing glass. Strain into a rocks glass over a large ice cube. Garnish with an orange twist.",
        glassware: "Rocks Glass",
        category: "The Unforgettables",
        imageUrl: "https://images.unsplash.com/photo-1536935338213-d2c1238f91c6?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Paper Plane",
        ingredients: ["0.75 oz Bourbon", "0.75 oz Amaro Nonino", "0.75 oz Aperol", "0.75 oz Fresh Lemon Juice"],
        instructions: "Shake all ingredients with ice. Double strain into a chilled coupe glass.",
        glassware: "Coupe Glass",
        category: "Modern Classic",
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Last Word",
        ingredients: ["0.75 oz Gin", "0.75 oz Green Chartreuse", "0.75 oz Maraschino Liqueur", "0.75 oz Lime Juice"],
        instructions: "Shake hard with ice. Fine strain into a chilled coupe. Garnish with a brandied cherry.",
        glassware: "Coupe Glass",
        category: "Classic",
        imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Gin Basil Smash",
        ingredients: ["2 oz Gin", "0.75 oz Lemon Juice", "0.5 oz Simple Syrup", "12 Fresh Basil Leaves"],
        instructions: "Muddle basil hard with lemon and syrup. Add gin. Shake with ice. Double strain into a rocks glass.",
        glassware: "Rocks Glass",
        category: "Modern Classic",
        imageUrl: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800"
      }
    ];

    for (const r of recipes) {
      await client.query(
        'INSERT INTO "Recipe" (name, ingredients, instructions, glassware, category, "imageUrl") VALUES ($1, $2, $3, $4, $5, $6)',
        [r.name, r.ingredients, r.instructions, r.glassware, r.category, r.imageUrl]
      );
    }

    // 3. Affiliate Store (Real Products & Links)
    const store = [
      // Tools
      {
        title: "Koriko Boston Shaker Tins",
        description: "The industry standard used by professionals worldwide. Weighted for balance.",
        url: "https://cocktailkingdom.com/products/koriko-weighted-shaking-tins",
        imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        category: "Tools"
      },
      {
        title: "Japanese Precision Jigger",
        description: "High-quality stainless steel with precise measurement markings.",
        url: "https://amazon.com/dp/B0036X4YRY",
        imageUrl: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&q=80&w=400",
        category: "Tools"
      },
      // Spirits (Gin & Bourbon Focus)
      {
        title: "Buffalo Trace Bourbon",
        description: "The flagship bourbon from the world's most award-winning distillery.",
        url: "https://www.totalwine.com/p/1431750",
        imageUrl: "https://images.unsplash.com/photo-1527281400828-ac737aff2ad0?auto=format&fit=crop&q=80&w=400",
        category: "Spirits"
      },
      {
        title: "Hendrick's Gin",
        description: "A uniquely refreshing gin infused with cucumber and rose petals.",
        url: "https://www.totalwine.com/p/92617750",
        imageUrl: "https://images.unsplash.com/photo-1632935187088-ec0bc9ba2bf5?auto=format&fit=crop&q=80&w=400",
        category: "Spirits"
      },
      // Sour Beers
      {
        title: "Vault City: Iron Brew Sour",
        description: "Modern sour beer wizards from Edinburgh. Intense fruit and sharp tartness.",
        url: "https://vaultcity.co.uk/collections/all",
        imageUrl: "https://images.unsplash.com/photo-1618889482923-38250401a84e?auto=format&fit=crop&q=80&w=400",
        category: "Beer"
      },
      {
        title: "Cascade Brewing: Sang Royal",
        description: "The pioneers of the North West Sour Beer style. Barrel-aged perfection.",
        url: "https://cascadebrewing.shop/",
        imageUrl: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&q=80&w=400",
        category: "Beer"
      }
    ];

    for (const item of store) {
      await client.query(
        'INSERT INTO "AffiliateLink" (title, description, url, "imageUrl", category) VALUES ($1, $2, $3, $4, $5)',
        [item.title, item.description, item.url, item.imageUrl, item.category]
      );
    }

    console.log(`\n🚀 BARTENDER RELAUNCH SUCCESS!`);
    console.log(`- ${recipes.length} Recipes Online`);
    console.log(`- ${store.length} Professional Tools & Spirits Seeded`);
  } catch (err) {
    console.error("❌ Seeding failed!");
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
