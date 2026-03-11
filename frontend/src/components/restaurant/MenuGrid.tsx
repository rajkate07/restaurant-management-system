import { MenuItem } from '@/types/restaurant';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatCurrency } from '@/types/restaurant';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuGridProps {
  onAddItem: (item: MenuItem) => void;
}

const MenuGrid = ({ onAddItem }: MenuGridProps) => {
  const { menuItems } = useRestaurant();
  const availableItems = menuItems.filter(item => item.available);
  const categories = [...new Set(availableItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3 text-foreground">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableItems
              .filter(item => item.category === category)
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => onAddItem(item)}
                  className="group flex flex-col items-start p-3 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all text-left"
                >
                  {item.image && (
                    <div className="w-full aspect-video mb-3 rounded-md overflow-hidden bg-muted/30">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <span className="font-medium text-sm text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-primary font-bold mt-1">{formatCurrency(item.price)}</span>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    <Plus className="h-3 w-3" />
                    Add
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
