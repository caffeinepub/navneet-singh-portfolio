import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useSkills } from "@/hooks/useQueries";

const PLACEHOLDER_SKILLS: {
  name: string;
  proficiency: number;
  category: string;
}[] = [
  // AI/ML
  { name: "Python", proficiency: 95, category: "AI/ML" },
  { name: "TensorFlow", proficiency: 90, category: "AI/ML" },
  { name: "PyTorch", proficiency: 88, category: "AI/ML" },
  { name: "scikit-learn", proficiency: 85, category: "AI/ML" },
  // Web Dev
  { name: "React", proficiency: 92, category: "Web Dev" },
  { name: "TypeScript", proficiency: 88, category: "Web Dev" },
  { name: "Node.js", proficiency: 85, category: "Web Dev" },
  { name: "FastAPI", proficiency: 87, category: "Web Dev" },
  // Blockchain
  { name: "ICP", proficiency: 82, category: "Blockchain" },
  { name: "Motoko", proficiency: 78, category: "Blockchain" },
  { name: "Web3", proficiency: 80, category: "Blockchain" },
  // Tools
  { name: "Docker", proficiency: 83, category: "Tools" },
  { name: "Git", proficiency: 95, category: "Tools" },
  { name: "AWS", proficiency: 76, category: "Tools" },
  { name: "Linux", proficiency: 88, category: "Tools" },
];

const CATEGORY_COLORS: Record<
  string,
  { bar: string; badge: string; glow: string }
> = {
  "AI/ML": {
    bar: "bg-cyan-400",
    badge: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
    glow: "shadow-[0_0_8px_oklch(0.72_0.2_210/0.4)]",
  },
  "Web Dev": {
    bar: "bg-purple-400",
    badge: "bg-purple-400/10 text-purple-400 border-purple-400/30",
    glow: "shadow-[0_0_8px_oklch(0.55_0.22_285/0.4)]",
  },
  Blockchain: {
    bar: "bg-blue-400",
    badge: "bg-blue-400/10 text-blue-400 border-blue-400/30",
    glow: "shadow-[0_0_8px_oklch(0.65_0.25_255/0.4)]",
  },
  Tools: {
    bar: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
    glow: "shadow-[0_0_8px_oklch(0.7_0.18_165/0.4)]",
  },
};

function getColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Tools;
}

export function SkillsSection() {
  const { data: skills, isLoading } = useSkills();

  const displaySkills =
    skills && skills.length > 0
      ? skills.map((s) => ({
          ...s,
          proficiency: Number(s.proficiency),
        }))
      : PLACEHOLDER_SKILLS;

  // Group by category
  const grouped = displaySkills.reduce<Record<string, typeof displaySkills>>(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {},
  );

  return (
    <section
      id="skills"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:60px_60px] opacity-10 pointer-events-none" />
      <div className="absolute right-0 top-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="section-hidden mb-16 text-center">
          <span className="font-mono text-sm text-primary tracking-widest uppercase">
            02 / Skills
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mt-3 gradient-text-cyber">
            Technical Arsenal
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            A curated toolkit built through years of shipping production
            systems.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 section-hidden">
            {Object.entries(grouped).map(([category, categorySkills]) => {
              const colors = getColor(category);
              return (
                <div
                  key={category}
                  className="glass rounded-2xl p-6 border-gradient hover:border-primary/20 transition-all group"
                >
                  {/* Category header */}
                  <div className="mb-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold border ${colors.badge}`}
                    >
                      {category}
                    </span>
                  </div>

                  {/* Skills list */}
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium text-foreground/90">
                            {skill.name}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors.bar} ${colors.glow} transition-all duration-700`}
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-16 section-hidden grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "15+", label: "Technologies" },
            { value: "10+", label: "Projects Built" },
            { value: "5+", label: "Years Coding" },
            { value: "3+", label: "Research Papers" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 text-center border-gradient hover:border-primary/30 transition-all"
            >
              <div className="font-display font-black text-3xl gradient-text-cyber">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
