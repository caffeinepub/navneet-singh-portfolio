import { Heart } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";

const SOCIALS = [
  { icon: SiGithub, label: "GitHub", href: "#" },
  { icon: SiLinkedin, label: "LinkedIn", href: "#" },
  { icon: SiX, label: "X / Twitter", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="font-display font-black text-primary text-xs gradient-text-cyber">
                NS
              </span>
            </div>
            <span className="font-display font-semibold text-foreground/70 text-sm">
              Navneet Singh
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:-translate-y-0.5"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/50 text-center sm:text-right">
            © {year}. Built with{" "}
            <Heart
              size={10}
              className="inline text-red-400 fill-red-400 mx-0.5"
            />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>

        {/* Bottom nav */}
        <div className="mt-8 pt-6 border-t border-border/20 flex flex-wrap justify-center gap-4">
          {["About", "Skills", "Projects", "Blog", "Contact"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() =>
                document
                  .querySelector(`#${label.toLowerCase()}`)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors font-mono uppercase tracking-wide"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
