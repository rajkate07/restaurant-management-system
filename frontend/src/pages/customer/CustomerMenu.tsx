import { useRestaurant } from "@/contexts/RestaurantContext";
import { Button } from "@/components/ui/button";
import { MenuItem, formatCurrency } from "@/types/restaurant";
import { Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import CustomerNavbar from "@/components/customer/CustomerNavbar";

const CustomerMenu = () => {
    const { menuItems, addToCart, cartItems } = useRestaurant();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", ...new Set(menuItems.map(item => item.category))];
    const filteredItems = selectedCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-background pb-24">
            <CustomerNavbar />

            <main className="container mx-auto px-4 py-8">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            onClick={() => setSelectedCategory(cat)}
                            className="rounded-full"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="group relative flex flex-col p-4 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300"
                        >
                            {item.image && (
                                <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-muted/30">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                </div>
                                <p className="text-primary font-bold text-xl">{formatCurrency(item.price)}</p>
                            </div>

                            <Button
                                className="mt-4 w-full gap-2 rounded-xl h-11"
                                onClick={() => addToCart(item)}
                            >
                                <Plus className="h-4 w-4" /> Add to Order
                            </Button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <div className="fixed bottom-6 inset-x-0 flex justify-center px-4 animate-in slide-in-from-bottom-10">
                    <Button
                        size="lg"
                        className="w-full max-w-md h-14 rounded-full shadow-2xl gap-3 text-lg"
                        onClick={() => navigate("/checkout")}
                    >
                        <ShoppingCart className="h-6 w-6" />
                        View My Selection
                        <Badge variant="secondary" className="ml-auto text-sm h-7 w-7 rounded-full flex items-center justify-center p-0">
                            {cartCount}
                        </Badge>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CustomerMenu;
