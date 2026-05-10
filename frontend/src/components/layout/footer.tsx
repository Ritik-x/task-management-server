import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <CheckCircle className="h-5 w-5 text-black-600" />
          <span>Task-Manager</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span className="text-muted-foreground/60">
            © {new Date().getFullYear()} Task-Manager
          </span>
        </nav>
      </div>
    </footer>
  );
}
