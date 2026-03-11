import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Order, formatCurrency } from "@/types/restaurant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer, RefreshCw } from "lucide-react";
import { useRestaurantInfo } from "@/hooks/useRestaurantInfo";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CustomerReceipt = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { info } = useRestaurantInfo();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_URL}/orders/public/${orderId}`);
                const data = await res.json();
                if (data.success) {
                    setOrder(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Receipt Not Found</h2>
                <Button onClick={() => navigate("/")}>Back Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-8 px-4">
            <div className="container mx-auto max-w-lg">
                <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back Home
                </Button>

                <Card className="border-none shadow-2xl bg-white overflow-hidden">
                    <CardHeader className="text-center border-b pb-8 bg-muted/10">
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">{info.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{info.address}</p>
                        {info.phone && <p className="text-sm text-muted-foreground">Tel: {info.phone}</p>}
                        <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                    </CardHeader>

                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-b">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Customer</p>
                                <p className="font-bold">{order.staffName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Table</p>
                                <p className="font-bold">{order.tableNumber}</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest mb-6">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>

                        <div className="space-y-4 mb-8">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.menuItem.name} x {item.quantity}</span>
                                    <span className="font-mono">{formatCurrency(item.menuItem.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 pt-4 border-t border-dashed">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>CGST (2.5%)</span>
                                <span>{formatCurrency(order.cgst)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>SGST (2.5%)</span>
                                <span>{formatCurrency(order.sgst)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black pt-4 border-t">
                                <span>Total Amount</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center space-y-1">
                            <p className="text-sm font-semibold">Paid via {order.paymentMethod.toUpperCase()}</p>
                            {order.transactionId && (
                                <p className="text-xs font-mono text-muted-foreground break-all">
                                    Txn ID: {order.transactionId}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">Thank you for visiting us! See you soon.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 flex gap-4 no-print">
                    <Button variant="outline" className="flex-1 h-12 gap-2" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerReceipt;
