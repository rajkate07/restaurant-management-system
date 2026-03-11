// import { Order, formatCurrency } from '@/types/restaurant';
// import { Button } from '@/components/ui/button';
// import { Printer, Plus } from 'lucide-react';
// import { format } from 'date-fns';

// interface BillReceiptProps {
//   order: Order;
//   onNewOrder: () => void;
// }

// const BillReceipt = ({ order, onNewOrder }: BillReceiptProps) => {
//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
//       <div className="no-print flex gap-3 mb-6">
//         <Button onClick={handlePrint} className="gap-2">
//           <Printer className="h-4 w-4" />
//           Print Receipt
//         </Button>
//         <Button variant="outline" onClick={onNewOrder} className="gap-2">
//           <Plus className="h-4 w-4" />
//           New Order
//         </Button>
//       </div>

//       <div className="receipt-print w-full max-w-sm bg-card border rounded-xl p-6 shadow-lg font-mono text-sm">
//         <div className="text-center mb-4">
//           <h2 className="text-xl font-bold font-serif text-card-foreground">RestroManager</h2>
//           <p className="text-xs text-muted-foreground mt-1">Tanisha Restaurant</p>
//           <p className="text-xs text-muted-foreground">YCWM college road, Warananagar</p>
//           <p className="text-xs text-muted-foreground">GSTIN: 2***********1Z5</p>
//         </div>

//         <div className="border-t border-dashed border-border my-3" />

//         <div className="flex justify-between text-xs text-muted-foreground mb-1">
//           <span>Date: {format(order.createdAt, 'dd/MM/yyyy')}</span>
//           <span>Time: {format(order.createdAt, 'HH:mm')}</span>
//         </div>
//         <div className="flex justify-between text-xs text-muted-foreground mb-1">
//           <span>Order: {order.id}</span>
//           <span>Table: {order.tableNumber}</span>
//         </div>
//         <div className="text-xs text-muted-foreground mb-2">
//           Staff: {order.staffName}
//         </div>

//         <div className="border-t border-dashed border-border my-3" />

//         <div className="space-y-1.5">
//           <div className="flex justify-between text-xs font-bold text-card-foreground">
//             <span className="flex-1">Item</span>
//             <span className="w-8 text-center">Qty</span>
//             <span className="w-16 text-right">Rate</span>
//             <span className="w-20 text-right">Amount</span>
//           </div>
//           <div className="border-t border-border" />
//           {order.items.map(item => (
//             <div key={item.menuItem.id} className="flex justify-between text-xs text-card-foreground">
//               <span className="flex-1 truncate pr-2">{item.menuItem.name}</span>
//               <span className="w-8 text-center">{item.quantity}</span>
//               <span className="w-16 text-right">{formatCurrency(item.menuItem.price)}</span>
//               <span className="w-20 text-right">{formatCurrency(item.menuItem.price * item.quantity)}</span>
//             </div>
//           ))}
//         </div>

//         <div className="border-t border-dashed border-border my-3" />

//         <div className="space-y-1 text-xs">
//           <div className="flex justify-between text-card-foreground">
//             <span>Subtotal</span>
//             <span>{formatCurrency(order.subtotal)}</span>
//           </div>
//           <div className="flex justify-between text-muted-foreground">
//             <span>CGST (2.5%)</span>
//             <span>{formatCurrency(order.cgst)}</span>
//           </div>
//           <div className="flex justify-between text-muted-foreground">
//             <span>SGST (2.5%)</span>
//             <span>{formatCurrency(order.sgst)}</span>
//           </div>
//           <div className="border-t border-border my-2" />
//           <div className="flex justify-between text-base font-bold text-card-foreground">
//             <span>TOTAL</span>
//             <span>{formatCurrency(order.total)}</span>
//           </div>
//         </div>

//         <div className="border-t border-dashed border-border my-3" />

//         <div className="text-center">
//           <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
//             order.paymentMethod === 'cash'
//               ? 'bg-success/10 text-success'
//               : 'bg-primary/10 text-primary'
//           }`}>
//             Paid via {order.paymentMethod === 'cash' ? 'CASH' : 'ONLINE'}
//           </div>
//         </div>

//         <div className="border-t border-dashed border-border my-3" />

//         <div className="text-center text-xs text-muted-foreground">
//           <p>Thank You! Visit Again!</p>
//           <p className="mt-1">*** Have a great day ***</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillReceipt;



import { Order, formatCurrency } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Printer, Plus } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';

interface BillReceiptProps {
  order: any; // Using any temporarily to handle the transition from Mock to DB types
  onNewOrder: () => void;
}

const BillReceipt = ({ order, onNewOrder }: BillReceiptProps) => {
  const handlePrint = () => { window.print(); };
  const { info } = useRestaurantInfo();

  // --- DATA NORMALIZATION ---
  // 1. Handle Date: Convert string from DB to Date object
  const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();

  // 2. Handle Items: Sequelize uses 'MenuItems', Mock used 'items'
  // We normalize them into a single array the UI can understand
  const itemsToDisplay = (order?.MenuItems || order?.items || []).map((item: any) => ({
    id: item.id || item.menuItem?.id,
    name: item.name || item.menuItem?.name,
    quantity: item.OrderItem?.quantity || item.quantity,
    price: Number(item.price || item.menuItem?.price || 0)
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="no-print flex gap-3 mb-6">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
        <Button variant="outline" onClick={onNewOrder} className="gap-2">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="receipt-print w-full max-w-sm bg-card border rounded-xl p-6 shadow-lg font-mono text-sm">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold font-serif text-card-foreground">{info.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">{info.address}</p>
          {info.phone && <p className="text-xs text-muted-foreground">Tel: {info.phone}</p>}
          {info.gstin && <p className="text-xs text-muted-foreground">GSTIN: {info.gstin}</p>}
        </div>

        <div className="border-t border-dashed border-border my-3" />

        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Date: {isValid(orderDate) ? format(orderDate, 'dd/MM/yyyy') : 'N/A'}</span>
          <span>Time: {isValid(orderDate) ? format(orderDate, 'HH:mm') : 'N/A'}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Order: {order?.id}</span>
          <span>Table: {order?.tableNumber}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          Staff: {order?.staffName || 'N/A'}
        </div>

        <div className="border-t border-dashed border-border my-3" />

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-card-foreground">
            <span className="flex-1">Item</span>
            <span className="w-8 text-center">Qty</span>
            <span className="w-16 text-right">Rate</span>
            <span className="w-20 text-right">Amount</span>
          </div>
          <div className="border-t border-border" />

          {/* SAFE MAPPING: This avoids the "undefined" crash */}
          {itemsToDisplay.map((item: any, index: number) => (
            <div key={item.id || index} className="flex justify-between text-xs text-card-foreground">
              <span className="flex-1 truncate pr-2">{item.name}</span>
              <span className="w-8 text-center">{item.quantity}</span>
              <span className="w-16 text-right">{formatCurrency(item.price)}</span>
              <span className="w-20 text-right">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-border my-3" />

        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-card-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(Number(order?.subtotal || 0))}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>CGST (2.5%)</span>
            <span>{formatCurrency(Number(order?.cgst || 0))}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>SGST (2.5%)</span>
            <span>{formatCurrency(Number(order?.sgst || 0))}</span>
          </div>
          <div className="border-t border-border my-2" />
          <div className="flex justify-between text-base font-bold text-card-foreground">
            <span>TOTAL</span>
            <span>{formatCurrency(Number(order?.total || 0))}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-border my-3" />

        <div className="text-center space-y-2">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order?.paymentMethod === 'cash'
            ? 'bg-success/10 text-success'
            : 'bg-primary/10 text-primary'
            }`}>
            Paid via {order?.paymentMethod === 'cash' ? 'CASH' : 'ONLINE'}
          </div>
          {order?.transactionId && (
            <div className="text-[10px] text-muted-foreground font-mono truncate px-2">
              Txn ID: {order.transactionId}
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-border my-3" />

        <div className="text-center text-xs text-muted-foreground">
          <p>Thank You! Visit Again!</p>
          <p className="mt-1">*** Have a great day ***</p>
        </div>
      </div>
    </div>
  );
};

export default BillReceipt;