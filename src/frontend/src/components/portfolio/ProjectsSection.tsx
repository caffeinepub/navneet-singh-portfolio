import type { Project } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateProject, useProjects } from "@/hooks/useQueries";
import { ExternalLink, Github, Star, Zap } from "lucide-react";
import { useEffect } from "react";

const SEED_PROJECTS: Project[] = [
  {
    id: "talentsync-ai",
    title: "TalentSync AI",
    description:
      "AI-powered talent matching platform leveraging NLP and ML algorithms to connect candidates with their ideal roles. Features semantic job matching, resume parsing, and intelligent ranking.",
    techStack: [
      "Python",
      "FastAPI",
      "React",
      "TensorFlow",
      "Redis",
      "PostgreSQL",
    ],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: true,
  },
  {
    id: "syngara",
    title: "SYNGARA",
    description:
      "Decentralized collaboration platform for creators built on the Internet Computer Protocol. Enables trustless royalty splitting, on-chain governance, and transparent revenue sharing.",
    techStack: ["ICP", "Motoko", "React", "Web3", "TypeScript"],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: true,
  },
  {
    id: "neurosolveX",
    title: "NeuroSolveX",
    description:
      "Advanced neural network framework for solving complex combinatorial optimization problems. Achieves state-of-the-art results on TSP, VRP, and scheduling benchmarks using attention-based models.",
    techStack: ["Python", "PyTorch", "CUDA", "NumPy", "Rust"],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: false,
  },
  {
    id: "ai-job-bot",
    title: "AI Job Application Bot",
    description:
      "Automated job application assistant powered by GPT-4. Tailors resumes and cover letters for each position, tracks applications, and provides interview preparation materials.",
    techStack: ["Python", "OpenAI API", "Selenium", "React", "FastAPI"],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: false,
  },
];

const PROJECT_GRADIENTS = [
  "from-cyan-500/15 to-blue-600/10",
  "from-purple-500/15 to-indigo-600/10",
  "from-emerald-500/15 to-cyan-600/10",
  "from-pink-500/15 to-purple-600/10",
];

const PROJECT_ACCENTS = [
  "border-cyan-400/20 hover:border-cyan-400/40 shadow-[0_0_0_1px_oklch(0.72_0.2_210/0.1)]",
  "border-purple-400/20 hover:border-purple-400/40 shadow-[0_0_0_1px_oklch(0.55_0.22_285/0.1)]",
  "border-emerald-400/20 hover:border-emerald-400/40 shadow-[0_0_0_1px_oklch(0.7_0.18_165/0.1)]",
  "border-pink-400/20 hover:border-pink-400/40 shadow-[0_0_0_1px_oklch(0.75_0.22_320/0.1)]",
];

const OCID_MAP: Record<number, string> = {
  0: "project.item.1",
  1: "project.item.2",
  2: "project.item.3",
  3: "project.item.4",
};

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const gradient = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length];
  const accent = PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
  const ocid = OCID_MAP[index] ?? `project.item.${index + 1}`;

  return (
    <div
      data-ocid={ocid}
      className={`relative glass rounded-2xl p-6 border ${accent} bg-gradient-to-br ${gradient} transition-all duration-300 group hover:-translate-y-1 hover:shadow-card-glow flex flex-col h-full`}
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-yellow-400 text-xs font-mono">
          <Star size={12} className="fill-yellow-400" />
          <span>Featured</span>
        </div>
      )}

      {/* Project number */}
      <div className="font-mono text-xs text-muted-foreground/40 mb-3">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Title */}
      <h3 className="font-display font-black text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.techStack.map((tech) => (
          <Badge
            key={tech}
            className="text-xs font-mono bg-muted/40 text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-primary transition-all py-0"
          >
            {tech}
          </Badge>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3 pt-4 border-t border-border/30">
        {project.demoUrl && project.demoUrl !== "#" ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ExternalLink size={13} />
            Live Demo
          </a>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/40 font-medium">
            <ExternalLink size={13} />
            Demo
          </span>
        )}
        {project.githubUrl && project.githubUrl !== "#" ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors ml-auto"
          >
            <Github size={13} />
            Code
          </a>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/40 font-medium ml-auto">
            <Github size={13} />
            Private
          </span>
        )}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();

  // Seed projects if empty
  useEffect(() => {
    if (projects && projects.length === 0 && !createProject.isPending) {
      for (const project of SEED_PROJECTS) {
        createProject.mutate(project);
      }
    }
  }, [projects, createProject.isPending, createProject.mutate]);

  const displayProjects =
    projects && projects.length > 0 ? projects : SEED_PROJECTS;
  const sorted = [...displayProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section
      id="projects"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Decorations */}
      <div className="absolute left-0 top-1/3 w-64 h-64 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="section-hidden mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-sm text-primary tracking-widest uppercase">
              03 / Projects
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl mt-3 gradient-text-cyber">
              Featured Work
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed sm:text-right">
            Projects that push the boundary of what's possible with AI and
            distributed systems.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 section-hidden">
            {sorted.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {/* View all / CTA */}
        <div className="mt-10 text-center section-hidden">
          <Button
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Zap size={16} className="mr-2 text-primary" />
            Interested in collaborating? Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
