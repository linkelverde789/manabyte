import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { useAuth } from '#/contexts/AuthContext';
import { Label } from '@radix-ui/react-label';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})


function RouteComponent() {
  const { user, logout, login, register } = useAuth();
  const navigate = useNavigate();
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ username: "", email: "", password: "" });

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Hi, {user.username}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/decks">My decks</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              logout();
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const handle = async (fn: () => Promise<void>, message: string) => {
    try {
      console.log("About to execute function");
      await fn();
      console.log("Function executed successfully");
      void navigate({ to: "/decks" });
    } catch (error) {
      console.error("Error occurred:", error instanceof Error ? error.message : "Something went wrong");
      console.error("Error object:", error);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Work in progress: accounts are stored only in this browser, so they don't sync between
        devices yet.
      </p>

      <Tabs defaultValue="signin" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handle(() => login(signInForm), "Welcome back");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={signInForm.email}
                onChange={(e) => setSignInForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={signInForm.password}
                onChange={(e) => setSignInForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Sign in
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submitted with data:", signUpForm);
              handle(() => register(signUpForm), "Account created");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="signup-name">Name</Label>
              <Input
                id="signup-name"
                value={signUpForm.username}
                onChange={(e) => setSignUpForm((f) => ({ ...f, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={signUpForm.email}
                onChange={(e) => setSignUpForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={signUpForm.password}
                onChange={(e) => setSignUpForm((f) => ({ ...f, password: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">At least 6 characters.</p>
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> Create account
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}