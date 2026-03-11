import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useRestaurant();
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const role = await login(email, password);

    if (role) {
      toast({ title: 'Welcome back!', description: 'Redirecting to your dashboard...' });
      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'staff') {
        navigate('/staff');
      } else {
        // Customer accidentally on staff login — send to customer home
        navigate('/');
      }
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setTimeout(() => {
  //     const success = login(email, password);
  //     if (success) {
  //       navigate('/');
  //     } else {
  //       toast({
  //         title: 'Login Failed',
  //         description: 'Invalid email or password. Please try again.',
  //         variant: 'destructive',
  //       });
  //     }
  //     setLoading(false);
  //   }, 500);
  // };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="w-fit mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-3xl">Staff Portal</CardTitle>
            <p className="text-sm font-semibold text-primary mt-1">Management Console</p>
            <CardDescription className="mt-2 text-base">
              Authorized access for restaurant personnel only
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / User name</Label>
              <Input
                id="email"
                type="email"
                placeholder="Username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Admin: admin@restaurant.com / admin123</p>
            <p>Staff: sakshi@restaurant.com / staff123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
