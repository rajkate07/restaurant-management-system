import { useNavigate, Link } from "react-router-dom";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Button } from "@/components/ui/button";
import {
    LogOut, User, History, Utensils, Home, ChefHat,
    Bell, BellOff, CheckCheck, Trash2, ChevronRight
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

const CustomerNavbar = () => {
    const { currentUser, logout } = useRestaurant();
    const navigate = useNavigate();
    const isCustomer = !!currentUser && currentUser.role === 'customer';
    const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications(isCustomer);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'preparing': return 'bg-amber-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="text-xl font-bold font-serif leading-none block">Tanisha Restaurant</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Restaurant</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6 lg:gap-8">
                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                            <Home className="h-4 w-4" /> Home
                        </Link>
                        <Link to="/menu" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                            <Utensils className="h-4 w-4" /> Menu
                        </Link>
                        {currentUser && (
                            <Link to="/history" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <History className="h-4 w-4" /> My Orders
                            </Link>
                        )}
                    </nav>

                    {/* Right Side: Notifications + User Menu */}
                    <div className="flex items-center gap-2">

                        {/* Notification Bell — only for logged-in customers */}
                        {isCustomer && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative h-10 w-10 rounded-full hover:bg-muted transition-all"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 min-w-5 rounded-full bg-red-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-pulse shadow-lg shadow-red-500/40">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-96 mt-2 rounded-2xl p-0 shadow-2xl border border-muted-foreground/10 overflow-hidden"
                                    align="end"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-4 w-4 text-primary" />
                                            <span className="font-bold text-sm">Notifications</span>
                                            {unreadCount > 0 && (
                                                <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-red-500 hover:bg-red-500">
                                                    {unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {unreadCount > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs gap-1 text-primary hover:text-primary"
                                                    onClick={markAllRead}
                                                >
                                                    <CheckCheck className="h-3 w-3" /> Mark all read
                                                </Button>
                                            )}
                                            {notifications.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                    onClick={clearAll}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notifications List */}
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                                            <BellOff className="h-10 w-10 opacity-30" />
                                            <p className="text-sm font-medium">No notifications yet</p>
                                            <p className="text-xs text-center px-4">
                                                We'll notify you here when your order status changes.
                                            </p>
                                        </div>
                                    ) : (
                                        <ScrollArea className="max-h-96">
                                            <div className="divide-y divide-muted-foreground/5">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => markRead(notif.id)}
                                                        className={`flex gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/30 ${!notif.read ? 'bg-primary/[0.03]' : ''}`}
                                                    >
                                                        {/* Status dot */}
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className={`h-2.5 w-2.5 rounded-full mt-1 ${getStatusColor(notif.status)} ${!notif.read ? 'shadow-[0_0_8px_rgba(34,197,94,0.6)]' : ''}`} />
                                                        </div>
                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm leading-snug ${!notif.read ? 'font-semibold' : 'text-muted-foreground'}`}>
                                                                {notif.message}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                        {/* Unread indicator */}
                                                        {!notif.read && (
                                                            <div className="flex-shrink-0 self-center">
                                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    )}

                                    {/* Footer */}
                                    {notifications.length > 0 && (
                                        <div
                                            className="border-t px-4 py-3 flex items-center justify-center gap-1 text-xs text-primary font-semibold cursor-pointer hover:bg-muted/20 transition-colors"
                                            onClick={() => navigate('/history')}
                                        >
                                            View all orders <ChevronRight className="h-3 w-3" />
                                        </div>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* User Menu */}
                        {currentUser ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-full md:w-auto px-4 gap-3 bg-muted/50 rounded-full hover:bg-muted transition-all">
                                        <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-inner">
                                            {currentUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden sm:inline font-semibold">
                                            Hi, {currentUser.name.split(' ')[0]}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-muted-foreground/10" align="end">
                                    <DropdownMenuLabel className="p-3">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold leading-none">{currentUser.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate("/history")} className="rounded-xl gap-2 p-3 cursor-pointer">
                                        <History className="h-4 w-4" /> Order History
                                    </DropdownMenuItem>
                                    {currentUser.role !== 'customer' && (
                                        <DropdownMenuItem onClick={() => navigate("/staff")} className="rounded-xl gap-2 p-3 cursor-pointer">
                                            <ChefHat className="h-4 w-4" /> Dashboard
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl gap-2 p-3 text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10">
                                        <LogOut className="h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="default"
                                className="rounded-full px-6 font-bold shadow-lg shadow-primary/20"
                                onClick={() => navigate("/auth")}
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CustomerNavbar;
