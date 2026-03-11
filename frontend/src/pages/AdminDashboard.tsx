import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatCurrency } from '@/types/restaurant';
import AdminLayout from '@/components/restaurant/AdminLayout';
import StatsCard from '@/components/restaurant/StatsCard';
import { Users, ShoppingBag, TrendingUp, UtensilsCrossed } from 'lucide-react';
import { isToday } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { orders, users, menuItems } = useRestaurant();

  // Normalize data: ensure dates are Date objects and numbers are Numbers
  const normalizedOrders = (orders || []).map(o => ({
    ...o,
    createdAt: new Date(o.createdAt),
    total: Number(o.total || 0),
    subtotal: Number(o.subtotal || 0)
  }));

  const todayOrders = normalizedOrders.filter(o => isToday(o.createdAt));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSales = normalizedOrders.reduce((sum, o) => sum + o.total, 0);
  const staffOnly = (users || []).filter(u => u.role === 'admin' || u.role === 'staff');
  const activeStaff = staffOnly.filter(s => s.active).length;
  const totalCustomers = (users || []).filter(u => u.role === 'customer').length;
  const recentOrders = normalizedOrders.slice(0, 10);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your restaurant</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Active Staff" value={activeStaff} icon={Users} description={`${staffOnly.length} staff total`} />
          <StatsCard title="Total Customers" value={totalCustomers} icon={Users} description="Registered guests" />
          <StatsCard title="Today's Orders" value={todayOrders.length} icon={ShoppingBag} />
          <StatsCard title="Today's Revenue" value={formatCurrency(todayRevenue)} icon={TrendingUp} description="Daily profit" />
          <StatsCard title="Total Sales" value={formatCurrency(totalSales)} icon={UtensilsCrossed} description={`${menuItems.length} menu items`} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
              No orders yet. Orders will appear here when staff process them.
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
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>{order.tableNumber}</TableCell>
                      <TableCell>
                        {(order.items ?? []).reduce((sum, i) => sum + i.quantity, 0)} items
                      </TableCell>                      <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant={order.paymentMethod === 'cash' ? 'secondary' : 'default'}>
                          {order.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.staffName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(order.createdAt, 'HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
