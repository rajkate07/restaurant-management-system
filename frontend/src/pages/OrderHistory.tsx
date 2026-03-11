import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatCurrency } from '@/types/restaurant';
import AdminLayout from '@/components/restaurant/AdminLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer, Download } from 'lucide-react';
import { format, isToday } from 'date-fns';

const OrderHistory = () => {
  const { orders } = useRestaurant();

  const safeOrders = Array.isArray(orders) ? orders : [];

  const todayOrders = safeOrders.filter(o =>
    o?.createdAt ? isToday(new Date(o.createdAt)) : false
  );

  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + Number(o?.total ?? 0),
    0
  );
  const handlePrintReport = () => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const today = format(new Date(), 'dd/MM/yyyy');
    const rows = todayOrders
      .map(o => `<tr>
        <td style="padding:6px;border:1px solid #ddd">${o.id}</td>
        <td style="padding:6px;border:1px solid #ddd">${o.tableNumber}</td>
        <td style="padding:6px;border:1px solid #ddd">${(o.items ?? [])
          .map(i => `${i.menuItem?.name ?? ''} x${i.quantity ?? 0}`)
          .join(', ')}</td>
        <td style="padding:6px;border:1px solid #ddd">${formatCurrency(o.total)}</td>
        <td style="padding:6px;border:1px solid #ddd">
          ${o.paymentMethod.toUpperCase()}
          ${o.transactionId ? `<br/><small style="color:#666">${o.transactionId}</small>` : ''}
        </td>
        <td style="padding:6px;border:1px solid #ddd">${o.staffName}</td>
        <td style="padding:6px;border:1px solid #ddd">${format(new Date(o.createdAt), 'HH:mm')}</td>
      </tr>`)
      .join('');

    reportWindow.document.write(`
      <html><head><title>Daily Report - ${today}</title></head>
      <body style="font-family:Arial,sans-serif;padding:20px">
        <h1 style="text-align:center">RestroManager - Daily Report</h1>
        <p style="text-align:center">Tanisha Restaurant</p>
        <p style="text-align:center">Date: ${today}</p>
        <p><strong>Total Orders:</strong> ${todayOrders.length}</p>
        <p><strong>Total Revenue:</strong> ${formatCurrency(todayRevenue)}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:12px">
          <thead><tr style="background:#f5f5f5">
            <th style="padding:8px;border:1px solid #ddd">Order ID</th>
            <th style="padding:8px;border:1px solid #ddd">Table</th>
            <th style="padding:8px;border:1px solid #ddd">Items</th>
            <th style="padding:8px;border:1px solid #ddd">Total</th>
            <th style="padding:8px;border:1px solid #ddd">Payment</th>
            <th style="padding:8px;border:1px solid #ddd">Staff</th>
            <th style="padding:8px;border:1px solid #ddd">Time</th>
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="7" style="padding:20px;text-align:center">No orders today</td></tr>'}</tbody>
        </table>
        <p style="text-align:center;margin-top:24px;color:#888">Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
      </body></html>
    `);
    reportWindow.document.close();
    reportWindow.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-muted-foreground mt-1">
              {todayOrders.length} orders today · {formatCurrency(todayRevenue)} revenue
            </p>
          </div>
          <Button onClick={handlePrintReport} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Daily Report
          </Button>
        </div>

        {safeOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
            No orders yet.
          </div>
        ) : (
          <div className="bg-card rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Date/Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell>{order.tableNumber}</TableCell>
                    <TableCell className="max-w-48 truncate">
                      {(order.items ?? [])
                        .map(i => `${i.menuItem?.name ?? ''} x${i.quantity ?? 0}`)
                        .join(', ')}
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={order.paymentMethod === 'cash' ? 'secondary' : 'default'} className="w-fit">
                          {order.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                        </Badge>
                        {order.transactionId && (
                          <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]" title={order.transactionId}>
                            ID: {order.transactionId}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.staffName}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {format(new Date(order.createdAt), 'dd/MM HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrderHistory;
