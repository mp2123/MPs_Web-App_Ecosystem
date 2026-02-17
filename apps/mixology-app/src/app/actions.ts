// apps/mixology-app/src/app/actions.ts
'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleFavoriteAction(recipeId: number) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to favorite recipes.' };
  }

  try {
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        recipeId: recipeId,
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          recipeId: recipeId,
        },
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Database error.' };
  }
}
