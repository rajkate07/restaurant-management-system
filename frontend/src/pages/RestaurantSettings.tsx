import { useState } from 'react';
import AdminLayout from '@/components/restaurant/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import { Settings, Store, MapPin, Receipt, Phone, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const RestaurantSettings = () => {
    const { info, updateInfo } = useRestaurantInfo();
    const [name, setName] = useState(info.name);
    const [address, setAddress] = useState(info.address);
    const [gstin, setGstin] = useState(info.gstin);
    const [phone, setPhone] = useState(info.phone);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateInfo({ name, address, gstin, phone });
        setSaved(true);
        toast.success('Restaurant info updated! Bills will reflect the new details.');
        setTimeout(() => setSaved(false), 3000);
    };

    const hasChanges =
        name !== info.name ||
        address !== info.address ||
        gstin !== info.gstin ||
        phone !== info.phone;

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        Restaurant Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Edit your restaurant details. Changes will appear on all bills and receipts.
                    </p>
                </div>

                <Card className="border shadow-lg">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Store className="h-4 w-4 text-primary" />
                            Restaurant Identity
                        </CardTitle>
                        <CardDescription>This name appears at the top of every bill and receipt.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="rest-name" className="flex items-center gap-2 font-semibold">
                                <Store className="h-3.5 w-3.5 text-muted-foreground" />
                                Restaurant Name
                            </Label>
                            <Input
                                id="rest-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Tanisha Restaurant"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rest-address" className="flex items-center gap-2 font-semibold">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                Address
                            </Label>
                            <Input
                                id="rest-address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="e.g. YCWM college road, Warananagar"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rest-phone" className="flex items-center gap-2 font-semibold">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="rest-phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. +91 98765 43210"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rest-gstin" className="flex items-center gap-2 font-semibold">
                                <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                                GSTIN <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="rest-gstin"
                                value={gstin}
                                onChange={(e) => setGstin(e.target.value)}
                                placeholder="e.g. 27AAPFU0939F1ZV"
                                className="h-11 font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Live Preview */}
                <Card className="border shadow-lg bg-white">
                    <CardHeader className="border-b bg-muted/10">
                        <CardTitle className="text-base text-muted-foreground">Bill Header Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 text-center font-mono space-y-1">
                        <p className="text-xl font-black uppercase tracking-tighter">{name || 'Restaurant Name'}</p>
                        <p className="text-sm text-muted-foreground">{address || 'Address'}</p>
                        {phone && <p className="text-xs text-muted-foreground">Tel: {phone}</p>}
                        {gstin && <p className="text-xs text-muted-foreground">GSTIN: {gstin}</p>}
                        <div className="border-t border-dashed my-3" />
                        <p className="text-xs text-muted-foreground">Order ID: ORD-XXXXXX</p>
                    </CardContent>
                </Card>

                <Button
                    onClick={handleSave}
                    className="w-full h-12 text-base gap-2 shadow-lg shadow-primary/20"
                    disabled={!hasChanges && !saved}
                >
                    {saved ? (
                        <>
                            <CheckCircle className="h-5 w-5" />
                            Saved Successfully!
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </AdminLayout>
    );
};

export default RestaurantSettings;
