import { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import AdminLayout from '@/components/restaurant/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StaffManagement = () => {
  const { users, addStaffMember, updateStaffMember, deleteStaffMember } = useRestaurant();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const [active, setActive] = useState(true);

  const staffOnly = users.filter(u => u.role === 'admin' || u.role === 'staff');

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('staff');
    setActive(true);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const staff = staffOnly.find(s => s.id === id);
    if (!staff) return;
    setEditingId(id);
    setName(staff.name);
    setEmail(staff.email);
    setRole(staff.role as 'admin' | 'staff');
    setActive(staff.active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name || !email) {
      toast({ title: 'Error', description: 'Please fill all fields.', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await updateStaffMember(editingId, { name, email, role, active });
        toast({ title: 'Updated', description: `${name} has been updated.` });
      } else {
        await addStaffMember({ name, email, role, active });
        toast({ title: 'Added', description: `${name} has been added.` });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Action failed.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const staff = staffOnly.find(s => s.id === id);
    if (confirm(`Are you sure you want to remove ${staff?.name}?`)) {
      await deleteStaffMember(id);
      toast({ title: 'Deleted', description: `${staff?.name} has been removed.` });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground mt-1">{staffOnly.length} team members</p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffOnly.map(staff => (
                <TableRow key={staff.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell className="text-muted-foreground">{staff.email}</TableCell>
                  <TableCell>
                    <Badge variant={staff.role === 'admin' ? 'default' : 'secondary'}>
                      {staff.role === 'admin' ? 'Admin' : 'Staff'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={staff.active ? 'default' : 'secondary'} className={staff.active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                      {staff.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(staff.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(staff.id)}>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., john@restaurant.com" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v: 'admin' | 'staff') => setRole(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch checked={active} onCheckedChange={setActive} />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingId ? 'Update Staff' : 'Add Staff'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default StaffManagement;
