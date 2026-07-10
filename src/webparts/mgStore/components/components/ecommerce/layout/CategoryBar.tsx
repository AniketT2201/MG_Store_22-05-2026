import * as React from "react";
import { useCategories } from "../../../hooks/useCategories";
import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { Skeleton } from "../ui/Skeleton";

const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

interface CategoryBarProps {
  goToProducts: (categoryId?: number) => void;
}

export function CategoryBar({ goToProducts }: CategoryBarProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-3 overflow-x-auto">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .CanvasComponent.LCS .grid {
            display: grid !important;
          }

          .CanvasComponent.LCS .grid::before,
          .CanvasComponent.LCS .grid::after {
            content: none !important;
            display: none !important;
          }
        `}  
      </style>
      <div className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          {/* <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {categories?.map((category) => (
              <button
                key={category.ID}
                onClick={() => goToProducts(category.ID)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
              >
                {iconMap[category.IconName] || (
                  <MoreHorizontal className="w-4 h-4" />
                )}
                <span>{category.Title}</span>
              </button>
            ))}
          </nav> */}
        </div>
      </div>
    </>
  );
}
