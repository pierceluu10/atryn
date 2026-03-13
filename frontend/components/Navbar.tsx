"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, FlaskConical, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout, isStudent, isProfessor } = useAuth();
  const pathname = usePathname();

  // Hide navbar on landing page
  if (pathname === "/") return null;

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-primary tracking-tight">
          Atryn
        </Link>

        <div className="flex items-center gap-1">
          {isStudent && (
            <>
              <Link href="/chat">
                <Button
                  variant={pathname === "/chat" ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Chat</span>
                </Button>
              </Link>
              <Link href="/labs">
                <Button
                  variant={pathname.startsWith("/labs") ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span className="hidden sm:inline">Labs</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            </>
          )}

          {isProfessor && (
            <Link href="/professor/dashboard">
              <Button
                variant={pathname.startsWith("/professor") ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          )}

          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-muted-foreground ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
