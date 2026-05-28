import * as React from "react";
import { SimpleHeroBanner } from '../../../../components/components/ecommerce/home/SimpleHeroBanner';
import { FlashSale } from '../../../../components/components/ecommerce/home/FlashSale';
import { CategoryShowcase } from '../../../../components/components/ecommerce/home/CategoryShowcase';
import { TodaysProducts } from '../../../../components/components/ecommerce/home/TodaysProducts';
import { PromoStrip } from '../../../../components/components/ecommerce/home/PromoStrip';

export function HomePage() {
  return (
    <>
      {/* 1. Simple Hero - Clear value proposition */}
      <SimpleHeroBanner />
      
      {/* 2. Flash Sale - Urgency driver with countdown */}
      <FlashSale />
      
      {/* 3. Category Grid - Quick navigation */}
      <CategoryShowcase />
      
      {/* 4. Today's For You - Personalized engagement with tabs */}
      <TodaysProducts />
      
      {/* 5. Promo Strip - Secondary call to action */}
      <PromoStrip />
    </>
  );
}
