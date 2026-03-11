import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import {
    Utensils, Clock, MapPin, Phone, ShieldCheck,
    ChefHat, Leaf, Truck, Facebook, Instagram, Twitter
} from "lucide-react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import { useRestaurantInfo } from "@/hooks/useRestaurantInfo";
import { useEffect, useState } from "react";

const CustomerHome = () => {
    const navigate = useNavigate();
    const { currentUser } = useRestaurant();
    const { info } = useRestaurantInfo();
    const [isOpen, setIsOpen] = useState(false);

    // Dynamic Open/Closed Status
    useEffect(() => {
        const checkStatus = () => {
            const hour = new Date().getHours();
            // Assuming open from 10:00 (10) to 23:00 (23)
            setIsOpen(hour >= 10 && hour < 23);
        };
        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    // Helper to safely split and format restaurant name
    const restaurantNameParts = info?.name ? info.name.split(' ') : ['Tanisha', 'Restaurant'];
    const firstName = restaurantNameParts[0];
    const lastName = restaurantNameParts.slice(1).join(' ') || 'Restaurant';

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <CustomerNavbar />

            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-black">
                    <img
                        src="/hero.png"
                        alt="Restaurant Interior"
                        className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate] opacity-60"
                        style={{ objectPosition: 'center 40%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
                </div>

                <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-16">
                    <span className="text-primary font-serif italic text-xl md:text-2xl mb-4 block tracking-wide">
                        Welcome to
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-6 text-white leading-[1.1]">
                        {firstName}{" "}
                        <span className="text-primary font-serif italic font-normal">
                            {lastName}
                        </span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Where every dish tells a story of tradition, taste, and timeless culinary artistry.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        {!currentUser ? (
                            <>
                                <Button
                                    size="lg"
                                    className="h-14 px-10 text-lg font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50"
                                    onClick={() => navigate("/auth")}
                                >
                                    Customer Login
                                </Button>
                                <Button
                                    size="lg"
                                    className="h-14 px-10 text-lg font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50"
                                    onClick={() => navigate("/staff/login")}
                                >
                                    Staff Portal
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="lg"
                                className="h-16 px-12 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50 group"
                                onClick={() => {
                                    if (currentUser.role === 'admin') navigate("/admin");
                                    else if (currentUser.role === 'staff') navigate("/staff");
                                    else navigate("/menu");
                                }}
                            >
                                <span className="group-hover:-translate-y-0.5 transition-transform">
                                    {currentUser.role === 'customer' ? "View Full Menu" : "Enter Dashboard"}
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 px-6 md:px-12 bg-card text-card-foreground">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Our Specialties</h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6" />
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Experience culinary excellence with our unwavering commitment to quality, service, and security.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Card 1 */}
                        <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-background border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
                            <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <Leaf className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Fresh Ingredients</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Locally sourced, organic produce delivered fresh from farms every single morning.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-background border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
                            <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <ChefHat className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Expert Chefs</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Our professional culinary team has decades of experience from top-tier kitchens.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-background border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
                            <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <Truck className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Fast Delivery</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Integrated with a smart real-time countdown system for piping hot arrivals.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-background border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
                            <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Secure Payments</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                100% verified and encrypted transactions for your complete peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Functional Footer */}
            <footer className="bg-[#111] text-zinc-300 pt-20 pb-6 mt-auto border-t-[8px] border-primary">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">

                        {/* Column 1: About */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                                    <Utensils className="h-6 w-6" />
                                </div>
                                <span className="text-2xl font-bold font-serif text-white">{info?.name || 'Restaurant'}</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                Elevating daily dining into extraordinary culinary experiences. We blend passion, premium ingredients, and a welcoming atmosphere to bring you the best flavors in town.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300 cursor-pointer">
                                    <Facebook className="h-5 w-5" />
                                </div>
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300 cursor-pointer">
                                    <Instagram className="h-5 w-5" />
                                </div>
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300 cursor-pointer">
                                    <Twitter className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h4 className="text-white text-lg font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li>
                                    <Link to="/" className="hover:text-primary transition-colors hover:underline underline-offset-4">Home</Link>
                                </li>
                                <li>
                                    <Link to="/menu" className="hover:text-primary transition-colors hover:underline underline-offset-4">Our Menu</Link>
                                </li>
                                <li>
                                    <Link to={currentUser ? "/history" : "/auth"} className="hover:text-primary transition-colors hover:underline underline-offset-4">Track Order</Link>
                                </li>
                                <li>
                                    <span className="hover:text-primary transition-colors cursor-pointer hover:underline underline-offset-4">Privacy Policy</span>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Contact Info */}
                        <div>
                            <h4 className="text-white text-lg font-bold mb-6">Contact Us</h4>

                            <div className="mb-6">
                                {isOpen ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-bold">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]" />
                                        We are OPEN right now
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-bold">
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                        We are CLOSED right now
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-4 text-sm text-zinc-400">
                                <li className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>
                                        {info?.address || 'YCWM college road, Warananagar'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-primary shrink-0" />
                                    <span>{info?.phone || '+91 9876543210'}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-primary shrink-0" />
                                    <span>Mon - Sun: 10:00 AM - 11:00 PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
                        <p>&copy; {new Date().getFullYear()} {info?.name || 'Tanisha Restaurant'}. All rights reserved.</p>
                        <p className="flex items-center gap-1">
                            Powered by <span className="font-bold text-zinc-400">RestroManager</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CustomerHome;
