import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { storeSessionParameter } from "@/utils/urlParams";
import {
  ChevronDown,
  ChevronUp,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function AdminLogin() {
  const { login, isLoggingIn } = useInternetIdentity();
  const [showTokenField, setShowTokenField] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  function handleTokenChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setAdminToken(value);
    if (value.trim()) {
      storeSessionParameter("caffeineAdminToken", value.trim());
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-8 sm:p-10 max-w-sm w-full border-gradient text-center space-y-6"
      >
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-cyan">
          <ShieldCheck size={28} className="text-primary" />
        </div>

        <div>
          <h1 className="font-display font-black text-2xl gradient-text-cyber mb-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in with Internet Identity to access the admin dashboard.
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-border/30 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Lock size={12} className="text-primary/70" />
            <span>Secure authentication via ICP</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Lock size={12} className="text-primary/70" />
            <span>Admin-only access verified on-chain</span>
          </div>
        </div>

        {/* Admin token collapsible */}
        <div className="text-left space-y-2">
          <button
            type="button"
            onClick={() => setShowTokenField((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors font-mono w-full"
            data-ocid="admin.toggle"
          >
            <KeyRound size={11} className="text-primary/50" />
            <span>Have an admin token?</span>
            {showTokenField ? (
              <ChevronUp size={11} className="ml-auto" />
            ) : (
              <ChevronDown size={11} className="ml-auto" />
            )}
          </button>

          <AnimatePresence>
            {showTokenField && (
              <motion.div
                key="token-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Input
                  type="password"
                  placeholder="Enter admin token"
                  value={adminToken}
                  onChange={handleTokenChange}
                  autoComplete="off"
                  className="bg-background/50 border-border/40 text-foreground placeholder:text-muted-foreground/40 font-mono text-sm focus:border-primary/50 focus:ring-primary/20 mt-1"
                  data-ocid="admin.input"
                />
                {adminToken.trim() && (
                  <p className="text-xs text-primary/70 font-mono mt-1.5 flex items-center gap-1">
                    <ShieldCheck size={10} />
                    Token saved — click Sign In to continue
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5 shadow-glow-cyan transition-all"
          data-ocid="admin.primary_button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              <ShieldCheck size={16} className="mr-2" />
              Sign In
            </>
          )}
        </Button>

        <a
          href="/"
          className="block text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors font-mono"
          data-ocid="admin.link"
        >
          ← Back to portfolio
        </a>
      </motion.div>
    </div>
  );
}
