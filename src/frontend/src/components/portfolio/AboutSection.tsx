import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAboutSection } from "@/hooks/useQueries";
import { Calendar, Globe, MapPin, Zap } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Zap, label: "AI/ML Expert", color: "text-yellow-400" },
  { icon: Globe, label: "Web3 Pioneer", color: "text-cyan-400" },
  { icon: Calendar, label: "5+ Years Exp", color: "text-purple-400" },
  { icon: MapPin, label: "Global Remote", color: "text-emerald-400" },
];

export function AboutSection() {
  const { data: about, isLoading } = useAboutSection();

  const name = about?.name || "Navneet Singh";
  const title = about?.title || "AI Engineer & Full-Stack Developer";
  const description =
    about?.description ||
    "Passionate AI engineer and full-stack developer specializing in intelligent systems, decentralized applications, and cutting-edge machine learning solutions. Building the future one algorithm at a time.";

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/3 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="section-hidden mb-16 text-center">
          <span className="font-mono text-sm text-primary tracking-widest uppercase">
            01 / About
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mt-3 gradient-text-cyber">
            Who I Am
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center section-hidden">
          {/* Avatar / Visual side */}
          <div className="flex flex-col items-center lg:items-start gap-8">
            {/* Profile avatar block */}
            <div className="relative">
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-2xl border border-primary/20 absolute inset-0 -m-3 animate-spin-slow opacity-30" />
              <div className="w-48 h-48 rounded-2xl overflow-hidden glass border-gradient relative z-10 glow-cyan">
                {about?.profileImageUrl ? (
                  <img
                    src={about.profileImageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <span className="font-display font-black text-6xl gradient-text-cyber">
                      NS
                    </span>
                  </div>
                )}
              </div>
              {/* Floating badges */}
              <div className="absolute -right-4 -top-4 glass rounded-lg px-3 py-1.5 text-xs font-mono text-primary border-gradient z-20 glow-cyan">
                &lt; AI Engineer /&gt;
              </div>
              <div className="absolute -left-4 -bottom-4 glass rounded-lg px-3 py-1.5 text-xs font-mono text-secondary border-gradient z-20 glow-purple">
                Web3 Builder
              </div>
            </div>

            {/* Highlight grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {HIGHLIGHTS.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="glass rounded-xl p-3 flex items-center gap-2.5 hover:border-primary/30 transition-all group"
                >
                  <Icon
                    size={16}
                    className={`${color} group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-xs font-medium text-foreground/80">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content side */}
          <div className="space-y-6">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-9 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </>
              ) : (
                <>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-foreground leading-tight">
                    {name}
                  </h3>
                  <p className="text-primary font-mono text-sm mt-1">{title}</p>
                </>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed text-base">
                {description}
              </p>
            )}

            <div className="space-y-3">
              <h4 className="font-display font-semibold text-foreground/80 text-sm uppercase tracking-wide">
                Areas of Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Machine Learning",
                  "Neural Networks",
                  "Full-Stack Dev",
                  "ICP / Web3",
                  "NLP",
                  "Computer Vision",
                  "API Design",
                  "Cloud Architecture",
                ].map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-muted/60 text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-primary transition-all cursor-default font-mono text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Code snippet decoration */}
            <div className="glass rounded-xl p-4 font-mono text-xs border-border/40">
              <div className="flex gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="text-muted-foreground/70 space-y-0.5">
                <div>
                  <span className="text-primary/80">const</span>{" "}
                  <span className="text-cyan-400">engineer</span>{" "}
                  <span className="text-muted-foreground">=</span> {"{"}
                </div>
                <div className="pl-4">
                  <span className="text-amber-400">passion</span>:{" "}
                  <span className="text-emerald-400">
                    "building AI systems"
                  </span>
                  ,
                </div>
                <div className="pl-4">
                  <span className="text-amber-400">mission</span>:{" "}
                  <span className="text-emerald-400">"shaping the future"</span>
                  ,
                </div>
                <div className="pl-4">
                  <span className="text-amber-400">status</span>:{" "}
                  <span className="text-emerald-400">"always learning"</span>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
