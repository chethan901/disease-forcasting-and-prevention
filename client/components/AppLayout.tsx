import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, Activity, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function AppLayout() {
  const location = useLocation();
  const [openSignIn, setOpenSignIn] = useState(false);

  const navLink = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
        )
      }
      aria-label={label}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 grid place-items-center rounded-md bg-gradient-to-br from-primary to-teal-500 text-primary-foreground shadow-sm">
              <Activity className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold tracking-tight text-lg">
                PredictaCare
              </p>
              <p className="text-[11px] text-muted-foreground -mt-1">
                AI-powered Disease Detection
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLink("/", "Home")}
            {navLink("/console", "Console")}
            <a
              href="/#architecture"
              className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Architecture
            </a>
            <a
              href="/#security"
              className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Security
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Dialog open={openSignIn} onOpenChange={setOpenSignIn}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign in
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign in</DialogTitle>
                  <DialogDescription>Demo-only authentication</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="text-sm">
                    <Label>Email</Label>
                    <Input type="email" placeholder="you@hospital.org" />
                  </div>
                  <div className="text-sm">
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={()=>{ setOpenSignIn(false); toast({ title: "Signed in", description: "Welcome back" }); }}>Continue</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button asChild className="group">
              <Link to="/console">
                Open Console
                <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="bg-[radial-gradient(60rem_40rem_at_50%_-10%,hsl(var(--primary)/0.08),transparent),radial-gradient(30rem_20rem_at_20%_10%,hsl(174_62%_45%/0.08),transparent)]">
        <Outlet />
      </main>

      <footer className="border-t bg-background">
        <div className="container py-10 grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="size-8 grid place-items-center rounded-md bg-gradient-to-br from-primary to-teal-500 text-primary-foreground">
                <ShieldCheck className="size-5" />
              </div>
              <span className="font-semibold">
                Explainability • Security • Auditability
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              PredictaCare focuses on interpretable AI with security and privacy
              by design, enabling clinicians and researchers to trust every
              prediction.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold mb-2">Product</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <a href="/#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="/#architecture" className="hover:text-foreground">
                  Architecture
                </a>
              </li>
              <li>
                <a href="/#monitoring" className="hover:text-foreground">
                  Monitoring
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold mb-2">Compliance</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>HIPAA/GDPR readiness</li>
              <li>Data retention policies</li>
              <li>Audit logging</li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="container py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} PredictaCare • v1.0.0</span>
            <span>Built with React + Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
