import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Printer, Clock, Loader2, ChefHat, CheckSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Order } from "@/types/restaurant";
import { toast } from "sonner";

const CustomerOrderSuccess = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { orders } = useRestaurant();
    const [order, setOrder] = useState<Order | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Poll for status updates
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/public/${orderId}`);
                const data = await res.json();
                if (data.success) {
                    setOrder(data.data);
                }
            } catch (err) {
                console.error("Order poll error", err);
            }
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [orderId]);

    // Countdown logic
    useEffect(() => {
        if (order?.status === 'preparing' && order.startTime && order.estimatedTime) {
            const calculateTime = () => {
                const start = new Date(order.startTime!).getTime();
                const now = new Date().getTime();
                const durationMs = order.estimatedTime! * 60 * 1000;
                const elapsed = now - start;
                const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / (60 * 1000)));
                setTimeLeft(remaining);
            };

            calculateTime();
            const timer = setInterval(calculateTime, 10000); // Update countdown every 10 seconds
            return () => clearInterval(timer);
        } else {
            setTimeLeft(null);
        }
    }, [order]);

    const getStatusIcon = () => {
        switch (order?.status) {
            case 'pending': return <Loader2 className="h-12 w-12 text-primary animate-spin" />;
            case 'preparing': return <ChefHat className="h-12 w-12 text-orange-500 animate-bounce" />;
            case 'completed': return <CheckSquare className="h-12 w-12 text-green-500" />;
            default: return <CheckCircle className="h-12 w-12 text-primary" />;
        }
    };

    const getStatusText = () => {
        switch (order?.status) {
            case 'pending': return "Order Received. Waiting for acceptance...";
            case 'preparing': return `Chef is preparing your meal!`;
            case 'completed': return "Order Complete! Enjoy your meal.";
            case 'cancelled': return "Order has been cancelled.";
            default: return "Order Confirmed!";
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-none shadow-2xl animate-in zoom-in duration-500 overflow-hidden">
                <div className="bg-primary p-8 flex flex-col items-center justify-center text-primary-foreground">
                    <CheckCircle className="h-16 w-16 mb-4 animate-in slide-in-from-bottom-5 duration-700" />
                    <h2 className="text-3xl font-extrabold mb-2 text-center">Order Confirmed!</h2>
                    <p className="opacity-90 font-mono tracking-wider">#{orderId}</p>
                </div>

                <CardContent className="p-8 space-y-8">
                    {/* Real-time Status */}
                    <div className="bg-muted/50 rounded-2xl p-6 text-center space-y-4 shadow-inner">
                        <div className="flex justify-center">{getStatusIcon()}</div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold">{getStatusText()}</h3>
                            {timeLeft !== null && timeLeft > 0 && (
                                <div className="flex items-center justify-center gap-2 text-primary font-bold animate-pulse text-2xl mt-2">
                                    <Clock className="h-6 w-6" />
                                    <span>~{timeLeft} mins remaining</span>
                                </div>
                            )}
                            {order?.status === 'completed' && (
                                <p className="text-green-600 font-semibold">Ready for pickup/service!</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            className="w-full h-14 text-lg font-bold gap-2 rounded-xl"
                            onClick={() => navigate(`/receipt/${orderId}`)}
                        >
                            <CheckSquare className="h-5 w-5" /> View Order Summary
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full h-14 text-lg font-bold gap-2 rounded-xl"
                            onClick={() => navigate("/")}
                        >
                            Go to Homepage <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerOrderSuccess;
