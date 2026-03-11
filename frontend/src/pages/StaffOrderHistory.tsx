import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatCurrency, Order } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChefHat, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import BillReceipt from '@/components/restaurant/BillReceipt';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const StaffOrderHistory = () => {
    const { currentUser, myOrders, fetchMyOrders } = useRestaurant();
    const navigate = useNavigate();
    const [selectedOrderForBill, setSelectedOrderForBill] = useState<Order | null>(null);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const safeOrders = Array.isArray(myOrders) ? myOrders : [];

    const totalRevenue = safeOrders.reduce(
        (sum, o) => sum + Number(o?.total ?? 0),
        0
    );

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
                        <p className="text-xs text-muted-foreground mt-1">My Orders · {currentUser?.name}</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/staff')} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
            </header>

            <div className="flex-1 overflow-auto p-4 lg:p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Receipt className="h-6 w-6 text-primary" />
                                My Order History
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                {safeOrders.length} orders · {formatCurrency(totalRevenue)} total revenue
                            </p>
                        </div>
                    </div>

                    {safeOrders.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border">
                            <Receipt className="h-12 w-12 mx-auto mb-3 opacity-40" />
                            <p className="text-lg font-medium">No orders yet</p>
                            <p className="text-sm mt-1">Orders you create will appear here.</p>
                            <Button variant="outline" className="mt-4" onClick={() => navigate('/staff')}>
                                Go to Dashboard
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-card rounded-xl border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Table</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                        <TableHead>Tax</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Date/Time</TableHead>
                                        <TableHead className="text-right">Bill</TableHead>
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
                                            <TableCell>{formatCurrency(order.subtotal)}</TableCell>
                                            <TableCell className="text-muted-foreground">{formatCurrency(Number(order.cgst) + Number(order.sgst))}</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant={order.paymentMethod === 'cash' ? 'secondary' : 'default'} className="w-fit">
                                                        {order.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                                                    </Badge>
                                                    {order.transactionId && (
                                                        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]" title={order.transactionId}>
                                                            ID: {order.transactionId}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground whitespace-nowrap">
                                                {format(new Date(order.createdAt), 'dd/MM HH:mm')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-2 rounded-lg font-bold border-primary/20 text-primary hover:bg-primary/5"
                                                    onClick={() => setSelectedOrderForBill(order as any)}
                                                >
                                                    <Receipt className="h-3.5 w-3.5" /> View Bill
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            {/* Bill Modal */}
            <Dialog open={!!selectedOrderForBill} onOpenChange={() => setSelectedOrderForBill(null)}>
                <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none">
                    {selectedOrderForBill && (
                        <BillReceipt
                            order={selectedOrderForBill}
                            onNewOrder={() => setSelectedOrderForBill(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StaffOrderHistory;
