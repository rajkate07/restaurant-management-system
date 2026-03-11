import { useRestaurant } from "@/contexts/RestaurantContext";
import { Button } from "@/components/ui/button";
import { formatCurrency, CGST_RATE, SGST_RATE } from "@/types/restaurant";
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import CustomerNavbar from "@/components/customer/CustomerNavbar";

const CustomerCheckout = () => {
    const { cartItems, updateCartQuantity, removeFromCart, placeCustomerOrder, currentUser } = useRestaurant();
    const navigate = useNavigate();
    const [tableNumber, setTableNumber] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
    const [isOrdering, setIsOrdering] = useState(false);

    if (!currentUser) {
        navigate("/auth");
        return null;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const cgst = subtotal * CGST_RATE;
    const sgst = subtotal * SGST_RATE;
    const total = subtotal + cgst + sgst;

    const handlePlaceOrder = async () => {
        if (!tableNumber) {
            toast.error("Please select a table number");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your selection is empty");
            return;
        }

        setIsOrdering(true);
        try {
            const order = await placeCustomerOrder(Number(tableNumber), paymentMethod);
            if (order) {
                toast.success("Order placed successfully!");
                navigate(`/order-success/${order.id}`);
            } else {
                toast.error("Failed to place order. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setIsOrdering(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <CustomerNavbar />
                <h2 className="text-2xl font-bold mb-4 mt-20">Your selection is empty</h2>
                <Button onClick={() => navigate("/menu")}>Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-12">
            <CustomerNavbar />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="border-none shadow-lg bg-muted/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                    {currentUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-black text-lg">{currentUser.name}</p>
                                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table Selection */}
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Where are you seated?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={tableNumber} onValueChange={setTableNumber}>
                                <SelectTrigger className="h-12 text-lg">
                                    <SelectValue placeholder="Select Table Number" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                                        <SelectItem key={n} value={String(n)}>Table {n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Items Summary */}
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Current Selection</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {cartItems.map(item => (
                                    <div key={item.menuItem.id} className="flex items-center gap-4 p-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm sm:text-base">{item.menuItem.name}</h4>
                                            <p className="text-muted-foreground text-sm">{formatCurrency(item.menuItem.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                    className="h-20 flex-col gap-2 rounded-xl"
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    <Banknote className="h-6 w-6" />
                                    Cash
                                </Button>
                                <Button
                                    variant={paymentMethod === 'online' ? 'default' : 'outline'}
                                    className="h-20 flex-col gap-2 rounded-xl"
                                    onClick={() => setPaymentMethod('online')}
                                >
                                    <CreditCard className="h-6 w-6" />
                                    Online
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card className="border-none shadow-lg bg-primary text-primary-foreground">
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex justify-between text-sm opacity-90">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-90">
                                <span>GST (5%)</span>
                                <span>{formatCurrency(cgst + sgst)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-2xl pt-2 border-t border-primary-foreground/20">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pb-6">
                            <Button
                                className="w-full h-14 bg-white text-primary hover:bg-white/90 text-xl font-bold rounded-xl"
                                onClick={handlePlaceOrder}
                                disabled={isOrdering}
                            >
                                {isOrdering ? "Placing Order..." : `Order & Pay ${formatCurrency(total)}`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default CustomerCheckout;
