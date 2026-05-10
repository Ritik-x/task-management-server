"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useUser } from "@/contexts/user-context";

export default function Header() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    if (pathname !== "/") {
      router.push("/auth/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <CheckCircle className="mr-2 h-6 w-6" />
          <span className="text-lg sm:text-xl">
            <span className="bg-gradient-to-r from-black-600  bg-clip-text text-black">
              Task-Manager
            </span>
          </span>
        </a>

        {!user && pathname === "/" && (
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#cta"
              className="hover:text-foreground transition-colors"
            >
              Get started
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex rounded-full px-3 py-1 text-xs"
              >
                {user.role === "admin" ? "Admin" : "User"}
              </Badge>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="rounded-full"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
