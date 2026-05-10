"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import Background from "@/components/layout/background";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
          variant: "default",
          duration: 3000,
        });

        // Small delay to show the toast before redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="container mx-auto grid min-h-screen items-center px-4 py-10 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="hidden lg:block">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              Welcome back
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Sign in to continue
            </h1>
            <p className="mt-4 text-muted-foreground">
              Track tasks, measure progress, and keep your day organized — all from a clean dashboard.
            </p>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md border bg-background/70 shadow-xl backdrop-blur">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link
              href="/"
                className="text-2xl font-semibold flex items-center"
            >
              <CheckCircle className="mr-2 h-6 w-6" />
              Task Manager
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 mt-2 w-full">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
        </Card>
      </div>
    </div>
  );
}
