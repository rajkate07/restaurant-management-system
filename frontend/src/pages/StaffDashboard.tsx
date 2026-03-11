import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { OrderItem, Order } from '@/types/restaurant';
import MenuGrid from '@/components/restaurant/MenuGrid';
import OrderPanel from '@/components/restaurant/OrderPanel';
import BillReceipt from '@/components/restaurant/BillReceipt';
import PaymentDialog from '@/components/restaurant/PaymentDialog';
import { Button } from '@/components/ui/button';
import { LogOut, ChefHat, Receipt } from 'lucide-react';
import { CGST_RATE, SGST_RATE } from '@/types/restaurant';

const StaffDashboard = () => {
  const { currentUser, logout, addOrder } = useRestaurant();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleAddItem = (menuItem: OrderItem['menuItem']) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setOrderItems(prev =>
      prev
        .map(i =>
          i.menuItem.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const handlePaymentSelect = async (method: 'cash' | 'online', transactionId?: string) => {
    try {
      // 1. Trigger the async call to our Node.js backend
      // Passing customerName as staffName for now if backend uses staffName field 
      // or we can just send it as an extra field if the backend is flexible.
      const order = await addOrder(tableNumber, orderItems, method, transactionId, customerName);

      if (order) {
        // 2. Only if the backend confirms the save, we show the receipt
        setCompletedOrder(order);
        setShowPayment(false);
      } else {
        // 3. Handle the case where the backend fails
        alert("Failed to save order to the database. Please try again.");
      }
    } catch (error) {
      console.error("Order processing error:", error);
    }
  };
  const handleNewOrder = () => {
    setOrderItems([]);
    setCompletedOrder(null);
    setTableNumber(1);
    setCustomerName('');
  };

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const total = subtotal + subtotal * CGST_RATE + subtotal * SGST_RATE;

  if (completedOrder) {
    return <BillReceipt order={completedOrder} onNewOrder={handleNewOrder} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ChefHat className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif leading-none">RestroManager</h1>
            <p className="text-[10px] font-semibold text-primary/80 mt-0.5">Tanisha Restaurant</p>
            <p className="text-xs text-muted-foreground mt-1">Welcome, {currentUser?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/staff/kitchen')} className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <ChefHat className="h-4 w-4" />
            <span className="hidden sm:inline">Kitchen</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/staff/orders')} className="gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">My Orders</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <MenuGrid onAddItem={handleAddItem} />
        </div>
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-card p-4 overflow-auto">
          <OrderPanel
            items={orderItems}
            tableNumber={tableNumber}
            onTableChange={setTableNumber}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
            onGenerateBill={() => setShowPayment(true)}
            onNewOrder={handleNewOrder}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
          />
        </div>
      </div>

      <PaymentDialog
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onSelect={handlePaymentSelect}
        total={total}
      />
    </div>
  );
};

export default StaffDashboard;
