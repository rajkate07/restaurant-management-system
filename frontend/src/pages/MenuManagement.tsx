import { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatCurrency } from '@/types/restaurant';
import AdminLayout from '@/components/restaurant/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categories = ['Starters', 'Main Course', 'Beverages', 'Desserts'];

const MenuManagement = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useRestaurant();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState('');
  const [imageSourceType, setImageSourceType] = useState('url');

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory(categories[0]);
    setAvailable(true);
    setImage('');
    setImageSourceType('url');
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    setEditingId(id);
    setName(item.name);
    setPrice(String(item.price));
    setCategory(item.category);
    setAvailable(item.available);
    setImage(item.image || '');
    if (item.image?.startsWith('data:image')) {
      setImageSourceType('upload');
    } else {
      setImageSourceType('url');
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name || !price || isNaN(Number(price))) {
      toast({ title: 'Error', description: 'Please fill all fields correctly.', variant: 'destructive' });
      return;
    }
    if (editingId) {
      updateMenuItem(editingId, { name, price: Number(price), category, available, image });
      toast({ title: 'Updated', description: `${name} has been updated.` });
    } else {
      addMenuItem({ name, price: Number(price), category, available, image });
      toast({ title: 'Added', description: `${name} has been added to the menu.` });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Error', description: 'File size exceeds 10MB limit.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleDelete = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    deleteMenuItem(id);
    toast({ title: 'Deleted', description: `${item?.name} has been removed.` });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground mt-1">{menuItems.length} items in menu</p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(item.price)}</TableCell>
                  <TableCell>
                    <Badge variant={item.available ? 'default' : 'secondary'}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Butter Chicken" />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 350" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Available</Label>
                  <Switch checked={available} onCheckedChange={setAvailable} />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Image Source</Label>
                <Tabs value={imageSourceType} onValueChange={setImageSourceType} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="mt-4">
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <div className="flex relative">
                        <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={imageSourceType === 'url' ? image : ''}
                          onChange={(e) => setImage(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="upload" className="mt-4">
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                      <UploadCloud className="h-8 w-8 text-muted-foreground mb-3" />
                      <p className="font-medium text-sm">Click or drag image here</p>
                      <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <Label className="mb-2 block">Image Preview</Label>
                  <div className="border rounded-md aspect-video w-full flex items-center justify-center overflow-hidden bg-muted/30">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <p className="text-sm text-muted-foreground">No image available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <Button onClick={handleSave} className="w-full md:w-auto px-8">
                {editingId ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MenuManagement;
