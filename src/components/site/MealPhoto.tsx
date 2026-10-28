"use client";

import Image from "next/image";
import { useState } from "react";

import type { MealPhoto as MealPhotoData } from "@/content/meal-photos";

interface MealPhotoProps {
  photo: MealPhotoData;
  alt: string;
  sizes: string;
}

/**
 * Renders a meal photo from `/public/images/meals`. If that file is missing
 * (for example in a download that dropped binary files), the same photograph
 * is loaded from the Pexels CDN instead, so the page never shows a broken image.
 */
export function MealPhoto({ photo, alt, sizes }: MealPhotoProps) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <Image
        src={photo.fallback}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        className="object-cover"
      />
    );
  }

  return (
    <Image
      src={photo.src}
      alt={alt}
      fill
      sizes={sizes}
      quality={75}
      placeholder="blur"
      blurDataURL={photo.blurDataURL}
      className="object-cover"
      onError={() => setUseFallback(true)}
    />
  );
}
