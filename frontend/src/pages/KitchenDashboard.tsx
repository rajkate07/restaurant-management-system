import { useEffect, useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatCurrency, Order } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, CheckCircle2, XCircle, PlayCircle, Loader2, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Search, Lock, KeyRound } from 'lucide-react';
import BillReceipt from '@/components/restaurant/BillReceipt';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const KitchenDashboard = () => {
    const { orders, fetchOrders, updateOrderStatus, currentUser } = useRestaurant();
    const [prepTimes, setPrepTimes] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrderForBill, setSelectedOrderForBill] = useState<Order | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState(false);
    const navigate = useNavigate();

    const KITCHEN_PIN = "1906";

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === KITCHEN_PIN) {
            setIsAuthorized(true);
            setPinError(false);
            toast.success("Access Granted to Kitchen");
        } else {
            setPinError(true);
            setPin('');
            toast.error("Invalid Kitchen PIN");
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const activeOrders = orders.filter(o => (o.status === 'pending' || o.status === 'preparing') &&
        (o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.tableNumber.toString().includes(searchQuery)));

    const completedOrders = orders.filter(o => (o.status === 'completed' || o.status === 'cancelled') &&
        (o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.tableNumber.toString().includes(searchQuery)))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleAccept = async (orderId: string) => {
        const time = prepTimes[orderId] || "30";
        await updateOrderStatus(orderId, 'preparing', parseInt(time));
        toast.success(`Order ${orderId} is now being prepared!`);
    };

    const handleComplete = async (orderId: string) => {
        await updateOrderStatus(orderId, 'completed');
        toast.success(`Order ${orderId} marked as completed!`);
    };

    const handleCancel = async (orderId: string) => {
        if (confirm("Are you sure you want to cancel this order?")) {
            await updateOrderStatus(orderId, 'cancelled');
            toast.error(`Order ${orderId} cancelled.`);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-none shadow-2xl bg-[#1e293b] text-white overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tight">Kitchen Access</CardTitle>
                        <p className="text-slate-400 text-sm">Enter the security PIN to proceed</p>
                    </CardHeader>
                    <CardContent className="p-8 pt-6">
                        <form onSubmit={handlePinSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <Input
                                        type="password"
                                        placeholder="••••"
                                        maxLength={4}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        className={`pl-10 h-14 bg-[#334155] border-none text-center text-2xl tracking-[1em] font-mono text-white focus-visible:ring-primary ${pinError ? 'ring-2 ring-destructive' : ''}`}
                                        autoFocus
                                    />
                                </div>
                                {pinError && (
                                    <p className="text-destructive text-center text-xs font-bold uppercase animate-bounce">Incorrect PIN. Try Again.</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full h-14 text-lg font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                Verify Access
                            </Button>
                            <Button variant="ghost" type="button" onClick={() => navigate('/staff')} className="w-full text-slate-400 font-bold">
                                Back to Dashboard
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                            <ChefHat className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Kitchen Dashboard</h1>
                            <p className="text-muted-foreground">Manage live orders and preparation times</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search order or table..."
                                className="pl-9 h-11 rounded-xl bg-card border-none shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-card p-2 rounded-xl border shadow-sm px-4 h-11">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">Live System Active</span>
                        </div>
                    </div>
                </header>

                <Tabs defaultValue="live" className="w-full space-y-6">
                    <TabsList className="bg-card p-1 rounded-2xl border shadow-sm h-14 w-full sm:w-auto grid grid-cols-2">
                        <TabsTrigger value="live" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                            <PlayCircle className="h-4 w-4 mr-2" /> Live Orders ({activeOrders.length})
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                            <History className="h-4 w-4 mr-2" /> Order History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="live" className="mt-0">
                        {activeOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed text-muted-foreground shadow-sm">
                                <Loader2 className="h-12 w-12 mb-4 opacity-20 animate-spin" />
                                <p className="text-xl font-medium">No incoming orders at the moment</p>
                                <p className="text-sm">New customer orders will appear here automatically.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeOrders.map(order => (
                                    <Card key={order.id} className={`border-none shadow-xl overflow-hidden transition-all hover:scale-[1.02] ${order.status === 'preparing' ? 'ring-2 ring-orange-500' : 'ring-1 ring-border'}`}>
                                        <CardHeader className={`pb-3 ${order.status === 'preparing' ? 'bg-orange-50' : 'bg-muted/50'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <Badge variant={order.status === 'preparing' ? 'secondary' : 'default'} className="uppercase px-3 py-1 text-[10px] font-bold tracking-widest text-orange-600 border-orange-200 bg-orange-50">
                                                        {order.status}
                                                    </Badge>
                                                    <CardTitle className="text-xl font-mono">#{order.id}</CardTitle>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-primary">Table {order.tableNumber}</p>
                                                    <div className="flex items-center justify-end gap-1 text-muted-foreground mt-1">
                                                        <User className="h-3 w-3" />
                                                        <span className="text-[10px] font-bold uppercase">{order.staffName}</span>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order Items</p>
                                                <div className="space-y-2">
                                                    {(order.items ?? []).map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-muted-foreground/10">
                                                            <span className="font-bold text-sm">{item.menuItem.name}</span>
                                                            <Badge variant="secondary" className="h-7 w-7 rounded-full flex items-center justify-center p-0 text-xs font-bold">
                                                                x{item.quantity}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {order.status === 'preparing' && order.startTime && (
                                                <div className="bg-orange-100 p-4 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded-full text-orange-600 shadow-sm">
                                                            <Clock className="h-5 w-5 animate-pulse" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-orange-800 uppercase">Est. Prep Time</p>
                                                            <p className="text-sm font-black text-orange-950">{order.estimatedTime} mins</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-orange-800 uppercase">Started</p>
                                                        <p className="text-sm font-black text-orange-950">{format(new Date(order.startTime), 'HH:mm')}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="bg-muted/10 p-4 pt-0 gap-3 border-t border-muted/20">
                                            {order.status === 'pending' ? (
                                                <div className="w-full space-y-4 pt-4">
                                                    <div className="flex items-center gap-3">
                                                        <Input
                                                            type="number"
                                                            placeholder="Mins"
                                                            className="w-24 h-12 font-bold text-center rounded-xl"
                                                            value={prepTimes[order.id] || ""}
                                                            onChange={(e) => setPrepTimes(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                        />
                                                        <Button
                                                            className="flex-1 h-12 gap-2 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                                                            onClick={() => handleAccept(order.id)}
                                                        >
                                                            <PlayCircle className="h-5 w-5" /> Accept Order
                                                        </Button>
                                                    </div>
                                                    <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 h-10 font-bold" onClick={() => handleCancel(order.id)}>
                                                        <XCircle className="h-4 w-4" /> Decline
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-white gap-2 rounded-xl text-lg font-black shadow-lg shadow-green-200 mt-4"
                                                    onClick={() => handleComplete(order.id)}
                                                >
                                                    <CheckCircle2 className="h-6 w-6" /> Mark as Ready
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-0">
                        <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-bold py-5 px-6">Order ID</TableHead>
                                        <TableHead className="font-bold">Table</TableHead>
                                        <TableHead className="font-bold">Items</TableHead>
                                        <TableHead className="font-bold">Total</TableHead>
                                        <TableHead className="font-bold">Payment</TableHead>
                                        <TableHead className="font-bold">Time</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="text-right font-bold pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {completedOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                                No completed orders found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        completedOrders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-mono font-medium px-6 py-4">#{order.id}</TableCell>
                                                <TableCell className="font-bold text-primary">Table {order.tableNumber}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {order.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}
                                                </TableCell>
                                                <TableCell className="font-bold">{formatCurrency(order.total)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {order.paymentMethod}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {format(new Date(order.createdAt), 'dd MMM, hh:mm a')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={order.status === 'completed' ? 'default' : 'destructive'} className="uppercase text-[9px] px-2 py-0 h-5">
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-2 rounded-lg font-bold border-primary/20 text-primary hover:bg-primary/5"
                                                        onClick={() => setSelectedOrderForBill(order)}
                                                    >
                                                        <Receipt className="h-3.5 w-3.5" /> View Bill
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>

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
        </div>
    );
};

export default KitchenDashboard;
