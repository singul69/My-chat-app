import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CircleUser, Heart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select your gender',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Register: React.FC = () => {
  const { register, user, loading, error } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      password: '',
      gender: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const onSubmit = async (values: FormValues) => {
    await register(values);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-love text-white text-center py-6">
          <h2 className="text-2xl font-bold">Welcome to LoveChat</h2>
          <p className="opacity-90">Start your journey to meaningful connection</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="male"
                              className="sr-only"
                              id="male"
                            />
                          </FormControl>
                          <label
                            htmlFor="male"
                            className={`flex items-center justify-center gap-2 rounded-lg border border-primary p-4 ${
                              field.value === 'male'
                                ? 'bg-primary bg-opacity-10 text-primary'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <CircleUser className="h-4 w-4" />
                            <span>Male</span>
                          </label>
                        </FormItem>
                        
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="female"
                              className="sr-only"
                              id="female"
                            />
                          </FormControl>
                          <label
                            htmlFor="female"
                            className={`flex items-center justify-center gap-2 rounded-lg border p-4 ${
                              field.value === 'female'
                                ? 'border-primary bg-primary bg-opacity-10 text-primary'
                                : 'border-neutral-200 hover:bg-muted'
                            }`}
                          >
                            <Heart className="h-4 w-4" />
                            <span>Female</span>
                          </label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-gradient-love">
                Create Account
              </Button>
              
              <p className="text-center text-sm text-neutral-600 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-medium">
                  Login
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
