import * as React from "react";
import { HeroCarousel } from '../home/HeroCarousel';
import { ProfessionalCategories } from '../home/ProfessionalCategories';
import { FlashSale } from '../home/FlashSale';
import { TodaysProducts } from '../home/TodaysProducts';
import { PromoStrip } from '../home/PromoStrip';

export const HomePage = () => {
  return (
    <>
      {/* 1. Hero Carousel - Smooth, creative scrolling with multiple images */}
      <HeroCarousel />
      
      {/* 2. Professional Categories - Beautiful category showcase */}
      <ProfessionalCategories />
      
      {/* 3. Flash Sale - Urgency driver with countdown */}
      <FlashSale />
      
      {/* 4. Today's For You - Personalized engagement with tabs */}
      <TodaysProducts />
      
      {/* 5. Promo Strip - Secondary call to action */}
      <PromoStrip />
    </>
  );
}
