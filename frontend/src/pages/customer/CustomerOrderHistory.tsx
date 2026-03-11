import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatCurrency } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, ShoppingBag, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import CustomerNavbar from '@/components/customer/CustomerNavbar';

const CustomerOrderHistory = () => {
    const { currentUser, myOrders, fetchMyOrders } = useRestaurant();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate("/auth");
            return;
        }
        fetchMyOrders();
    }, [currentUser]);

    const safeOrders = Array.isArray(myOrders) ? myOrders : [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none"><Clock className="h-3 w-3" /> Pending</Badge>;
            case 'preparing': return <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-700 hover:bg-orange-200 border-none"><Clock className="h-3 w-3" /> Preparing</Badge>;
            case 'completed': return <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 hover:bg-green-200 border-none"><CheckCircle2 className="h-3 w-3" /> Ready</Badge>;
            case 'cancelled': return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <CustomerNavbar />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <History className="h-8 w-8 text-primary" />
                                My Order History
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                Review your previous orders and their current status
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-full gap-2 border-primary text-primary hover:bg-primary/5"
                            onClick={() => navigate("/menu")}
                        >
                            Place New Order <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {safeOrders.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-3xl border border-dashed shadow-sm">
                            <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold">No orders found</h3>
                            <p className="text-muted-foreground mt-2">Hungry? Start exploring our delicious menu!</p>
                            <Button variant="default" className="mt-6 rounded-full px-8 h-12" onClick={() => navigate('/menu')}>
                                Go to Menu
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-card rounded-3xl border shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="py-5">Order ID</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {safeOrders.map(order => (
                                            <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="font-mono text-sm font-bold">#{order.id}</TableCell>
                                                <TableCell className="max-w-64">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(order.items ?? []).map((i, idx) => (
                                                            <span key={idx} className="bg-muted px-2 py-0.5 rounded text-xs">
                                                                {i.menuItem?.name} x{i.quantity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold text-primary">{formatCurrency(order.total)}</TableCell>
                                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {format(new Date(order.createdAt), 'dd MMM, hh:mm a')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary font-bold hover:bg-primary/5 rounded-lg"
                                                        onClick={() => navigate(`/order-success/${order.id}`)}
                                                    >
                                                        Track
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomerOrderHistory;
