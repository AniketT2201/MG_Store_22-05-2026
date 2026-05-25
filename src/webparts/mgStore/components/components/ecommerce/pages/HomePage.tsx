import * as React from "react";
import { HeroBanner } from '../../../../components/components/ecommerce/home/HeroBanner';
import { FeaturedProducts } from '../../../../components/components/ecommerce/home/FeaturedProducts';
import { CategoryShowcase } from '../../../../components/components/ecommerce/home/CategoryShowcase';
import { PromoStrip } from '../../../../components/components/ecommerce/home/PromoStrip';


export function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <CategoryShowcase />
      <PromoStrip />
    </>
  );
}
