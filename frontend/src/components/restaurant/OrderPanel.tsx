import { OrderItem, formatCurrency, CGST_RATE, SGST_RATE } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OrderPanelProps {
  items: OrderItem[];
  tableNumber: number;
  onTableChange: (table: number) => void;
  onQuantityChange: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onGenerateBill: () => void;
  onNewOrder: () => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
}

const OrderPanel = ({
  items,
  tableNumber,
  onTableChange,
  onQuantityChange,
  onRemoveItem,
  onGenerateBill,
  onNewOrder,
  customerName,
  onCustomerNameChange
}: OrderPanelProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cgst = subtotal * CGST_RATE;
  const sgst = subtotal * SGST_RATE;
  const total = subtotal + cgst + sgst;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Current Order</h3>
        <Button variant="outline" size="sm" onClick={onNewOrder}>
          New Order
        </Button>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Customer Name</label>
          <Input
            placeholder="Enter customer name..."
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Table Number</label>
          <Select value={String(tableNumber)} onValueChange={(v) => onTableChange(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                <SelectItem key={n} value={String(n)}>Table {n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-2 min-h-0">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Select items from the menu
          </div>
        ) : (
          items.map(item => (
            <div key={item.menuItem.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.menuItem.name}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(item.menuItem.price)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onQuantityChange(item.menuItem.id, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onQuantityChange(item.menuItem.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => onRemoveItem(item.menuItem.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">CGST (2.5%)</span>
          <span>{formatCurrency(cgst)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">SGST (2.5%)</span>
          <span>{formatCurrency(sgst)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      <Button
        className="mt-4 h-12 text-base"
        onClick={onGenerateBill}
      // disabled={items.length === 0}
      >
        Generate Bill
      </Button>
    </div>
  );
};

export default OrderPanel;
