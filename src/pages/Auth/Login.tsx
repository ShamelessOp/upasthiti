
import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, loading, refreshSession } = useAuth();
  const navigate = useNavigate();

  // Check if user is already authenticated on mount or when auth state changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Double-check session with Supabase directly
        const { data } = await supabase.auth.getSession();
        console.log("Login page session check:", {
          hasSession: !!data.session,
          contextAuth: isAuthenticated,
          sessionUser: data.session?.user?.email
        });
        
        if (data.session || isAuthenticated) {
          console.log("User already authenticated, redirecting to sites");
          navigate("/sites");
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    };
    
    if (!loading) {
      checkSession();
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      
      // Verify login was successful with a direct session check
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("Login successful, session verified");
        toast.success("Login successful");
        
        // Force a session refresh to ensure context is updated
        await refreshSession();
        navigate("/sites");
      } else {
        console.error("Login appeared to succeed but no session was created");
        setError("Login failed: No session was created. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Failed to login. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is already authenticated and not in loading state, redirect to dashboard
  if (!loading && isAuthenticated) {
    console.log("Login component: Already authenticated, redirecting to sites");
    return <Navigate to="/sites" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md animate-in">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Upastithi</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
