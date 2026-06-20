import Link from 'next/link';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const slug = category.name.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link href={`/category/${slug}`} className="group">
      <Card className="flex flex-col items-center justify-center p-4 transition-all duration-300 hover:bg-primary/5 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-0 flex flex-col items-center gap-2 relative z-10">
          {/* Icon with animated background */}
          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
            <category.icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          
          <p className="text-sm font-semibold font-headline text-center group-hover:text-primary transition-colors">
            {category.name}
          </p>
          
          <Badge 
            variant={category.mapCount > 0 ? "secondary" : "outline"} 
            className="text-xs transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            {category.mapCount} {category.mapCount === 1 ? 'map' : 'maps'}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
