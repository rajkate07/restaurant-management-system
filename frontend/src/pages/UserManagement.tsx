import { useState, useEffect } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import AdminLayout from '@/components/restaurant/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Search, RefreshCw, UserPlus, Filter, Shield, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const UserManagement = () => {
    const { users, fetchUsers } = useRestaurant();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUsers();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const filteredUsers = (users || []).filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = activeTab === 'all' || user.role === activeTab;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200/50 flex items-center gap-1.5 w-fit px-3 py-1 font-semibold">
                        <Shield className="h-3 w-3" /> Admin
                    </Badge>
                );
            case 'staff':
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200/50 flex items-center gap-1.5 w-fit px-3 py-1 font-semibold">
                        <UserPlus className="h-3 w-3" /> Staff
                    </Badge>
                );
            case 'customer':
                return (
                    <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-indigo-200/50 flex items-center gap-1.5 w-fit px-3 py-1 font-semibold">
                        <UserIcon className="h-3 w-3" /> Customer
                    </Badge>
                );
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            User Directory
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage your restaurant's ecosystem of administrators, staff, and loyal customers.
                        </p>
                    </div>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all gap-2 px-6"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Syncing...' : 'Sync Database'}
                    </Button>
                </div>

                <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl">
                    <CardContent className="p-0">
                        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                            <div className="p-6 border-b bg-muted/20 backdrop-blur-sm rounded-t-xl overflow-x-auto">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    <TabsList className="bg-background/50 border p-1 shadow-inner h-12 rounded-full">
                                        <TabsTrigger value="all" className="rounded-full px-8 h-10 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                            Everyone
                                        </TabsTrigger>
                                        <TabsTrigger value="staff" className="rounded-full px-8 h-10 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                            Team
                                        </TabsTrigger>
                                        <TabsTrigger value="customer" className="rounded-full px-8 h-10 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                            Customers
                                        </TabsTrigger>
                                        <TabsTrigger value="admin" className="rounded-full px-8 h-10 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                            Admins
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="relative w-full lg:w-96 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Find people by name, email..."
                                            className="pl-12 h-12 bg-background/50 border-muted-foreground/20 rounded-full focus-visible:ring-primary shadow-sm hover:border-primary/50 transition-all text-lg"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <TabsContent value={activeTab} className="m-0 focus-visible:ring-0">
                                <div className="overflow-hidden border-b">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="w-[100px] pl-8 py-5 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Profile</TableHead>
                                                <TableHead className="py-5 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">User Identity</TableHead>
                                                <TableHead className="py-5 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Security Role</TableHead>
                                                <TableHead className="py-5 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Account Status</TableHead>
                                                <TableHead className="py-5 pr-8 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Member Since</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.length === 0 ? (
                                                <TableRow className="hover:bg-transparent">
                                                    <TableCell colSpan={5} className="h-64 text-center">
                                                        <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                                                            <Filter className="h-12 w-12" />
                                                            <p className="text-xl font-medium tracking-tight">No results matched your search.</p>
                                                            <Button variant="link" onClick={() => { setSearchTerm(''); setActiveTab('all'); }} className="text-primary font-bold uppercase tracking-wider text-xs">Clear all filters</Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredUsers.map((user, idx) => (
                                                    <TableRow
                                                        key={user.id}
                                                        className="group hover:bg-primary/[0.02] transition-colors border-muted-foreground/5 cursor-default"
                                                        style={{ animationDelay: `${idx * 30}ms` }}
                                                    >
                                                        <TableCell className="pl-8 py-6">
                                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center font-bold text-xl text-primary border border-primary/10 shadow-sm group-hover:scale-110 transition-transform">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-6">
                                                            <div className="flex flex-col space-y-0.5">
                                                                <span className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{user.name}</span>
                                                                <span className="text-sm text-muted-foreground font-medium tracking-tight">{user.email}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-6">{getRoleBadge(user.role)}</TableCell>
                                                        <TableCell className="py-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${user.active !== false ? 'bg-green-500' : 'bg-muted-foreground'} shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                                                                <span className={`text-sm font-bold uppercase tracking-wide ${user.active !== false ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                                    {user.active !== false ? 'Active' : 'Offline'}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-6 pr-8 text-muted-foreground font-mono text-sm">
                                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="p-6 bg-muted/30 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground border-t">
                                    <span>Showing {filteredUsers.length} of {users.length} members</span>
                                    {isRefreshing && <span>Synchronizing vault...</span>}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;

