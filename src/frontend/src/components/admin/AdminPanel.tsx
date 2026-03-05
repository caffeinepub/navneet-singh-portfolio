import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import {
  useAboutSection,
  useBlogPosts,
  useContactMessages,
  useCreateProject,
  useCreateSkill,
  useProjects,
  useSkills,
  useUpdateAbout,
} from "@/hooks/useQueries";
import {
  ArrowLeft,
  LayoutDashboard,
  Loader2,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { AdminAboutTab } from "./AdminAboutTab";
import { AdminBlogTab } from "./AdminBlogTab";
import { AdminLogin } from "./AdminLogin";
import { AdminMessagesTab } from "./AdminMessagesTab";
import { AdminProjectsTab } from "./AdminProjectsTab";
import { AdminSkillsTab } from "./AdminSkillsTab";

// Seed data for the admin panel on first load
const SEED_PROJECTS = [
  {
    id: "talentsync-ai",
    title: "TalentSync AI",
    description:
      "AI-powered talent matching platform leveraging NLP and ML algorithms to connect candidates with their ideal roles.",
    techStack: ["Python", "FastAPI", "React", "TensorFlow"],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: true,
  },
  {
    id: "syngara",
    title: "SYNGARA",
    description:
      "Decentralized collaboration platform for creators built on the Internet Computer Protocol.",
    techStack: ["ICP", "Motoko", "React", "Web3"],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: true,
  },
  {
    id: "neurosolveX",
    title: "NeuroSolveX",
    description:
      "Neural network framework for solving complex combinatorial optimization problems.",
    techStack: ["Python", "PyTorch", "CUDA", "NumPy"],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: false,
  },
  {
    id: "ai-job-bot",
    title: "AI Job Application Bot",
    description: "Automated job application assistant powered by GPT-4.",
    techStack: ["Python", "OpenAI API", "Selenium", "React"],
    demoUrl: "#",
    githubUrl: "#",
    imageUrl: "",
    featured: false,
  },
];

const SEED_SKILLS = [
  {
    id: "skill-python",
    name: "Python",
    category: "AI/ML",
    proficiency: BigInt(95),
  },
  {
    id: "skill-tf",
    name: "TensorFlow",
    category: "AI/ML",
    proficiency: BigInt(90),
  },
  {
    id: "skill-pytorch",
    name: "PyTorch",
    category: "AI/ML",
    proficiency: BigInt(88),
  },
  {
    id: "skill-sklearn",
    name: "scikit-learn",
    category: "AI/ML",
    proficiency: BigInt(85),
  },
  {
    id: "skill-react",
    name: "React",
    category: "Web Dev",
    proficiency: BigInt(92),
  },
  {
    id: "skill-ts",
    name: "TypeScript",
    category: "Web Dev",
    proficiency: BigInt(88),
  },
  {
    id: "skill-node",
    name: "Node.js",
    category: "Web Dev",
    proficiency: BigInt(85),
  },
  {
    id: "skill-fastapi",
    name: "FastAPI",
    category: "Web Dev",
    proficiency: BigInt(87),
  },
  {
    id: "skill-icp",
    name: "ICP",
    category: "Blockchain",
    proficiency: BigInt(82),
  },
  {
    id: "skill-motoko",
    name: "Motoko",
    category: "Blockchain",
    proficiency: BigInt(78),
  },
  {
    id: "skill-web3",
    name: "Web3",
    category: "Blockchain",
    proficiency: BigInt(80),
  },
  {
    id: "skill-docker",
    name: "Docker",
    category: "Tools",
    proficiency: BigInt(83),
  },
  { id: "skill-git", name: "Git", category: "Tools", proficiency: BigInt(95) },
  { id: "skill-aws", name: "AWS", category: "Tools", proficiency: BigInt(76) },
  {
    id: "skill-linux",
    name: "Linux",
    category: "Tools",
    proficiency: BigInt(88),
  },
];

function SeedInitializer() {
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: about } = useAboutSection();
  const createProject = useCreateProject();
  const createSkill = useCreateSkill();
  const updateAbout = useUpdateAbout();

  useEffect(() => {
    if (projects && projects.length === 0) {
      for (const project of SEED_PROJECTS) {
        createProject.mutate(project);
      }
    }
  }, [projects, createProject.mutate]);

  useEffect(() => {
    if (skills && skills.length === 0) {
      for (const skill of SEED_SKILLS) {
        createSkill.mutate(skill);
      }
    }
  }, [skills, createSkill.mutate]);

  useEffect(() => {
    if (about && !about.name) {
      updateAbout.mutate({
        name: "Navneet Singh",
        title: "AI Engineer & Full-Stack Developer",
        description:
          "Passionate AI engineer and full-stack developer specializing in intelligent systems, decentralized applications, and cutting-edge machine learning solutions. Building the future one algorithm at a time.",
        profileImageUrl: "",
      });
    }
  }, [about, updateAbout.mutate]);

  return null;
}

function NotAdmin() {
  const { clear } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 max-w-sm w-full border-gradient text-center space-y-5"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <ShieldAlert size={24} className="text-destructive" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm">
            You don't have admin privileges for this portfolio.
          </p>
        </div>

        {/* Token hint */}
        <div className="glass rounded-xl p-3 border border-border/20 text-left">
          <p className="text-xs text-muted-foreground/70 font-mono leading-relaxed">
            If you have an admin token, sign out and re-enter it on the login
            page.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={clear}
          className="w-full border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 font-mono text-xs gap-1.5"
          data-ocid="admin.secondary_button"
        >
          <LogOut size={12} />
          Sign Out &amp; Try Again
        </Button>

        <a
          href="/"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
          data-ocid="admin.link"
        >
          <ArrowLeft size={14} />
          Back to portfolio
        </a>
      </motion.div>
    </div>
  );
}

export function AdminPanel() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();

  // Not logged in
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={24} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!identity) {
    return <AdminLogin />;
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 size={24} className="text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm font-mono">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <NotAdmin />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-5 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              <span className="font-mono">Portfolio</span>
            </a>
            <span className="text-border/60">|</span>
            <div className="flex items-center gap-2">
              <LayoutDashboard size={15} className="text-primary" />
              <span className="font-display font-semibold text-foreground text-sm">
                Admin Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground/60 hidden sm:block truncate max-w-[200px]">
              {identity.getPrincipal().toString().slice(0, 16)}...
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground text-xs gap-1.5"
            >
              <LogOut size={13} />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Seed initializer (silent) */}
      <SeedInitializer />

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="glass border border-border/30 h-auto p-1 flex flex-wrap gap-1 bg-transparent">
            <TabsTrigger
              value="projects"
              data-ocid="admin.projects_tab"
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 font-mono"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              data-ocid="admin.skills_tab"
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 font-mono"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              data-ocid="admin.blog_tab"
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 font-mono"
            >
              Blog Posts
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              data-ocid="admin.messages_tab"
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 font-mono"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="about"
              data-ocid="admin.about_tab"
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 font-mono"
            >
              About
            </TabsTrigger>
          </TabsList>

          <div className="glass rounded-2xl p-6 border border-border/30">
            <TabsContent value="projects" className="mt-0">
              <AdminProjectsTab />
            </TabsContent>
            <TabsContent value="skills" className="mt-0">
              <AdminSkillsTab />
            </TabsContent>
            <TabsContent value="blog" className="mt-0">
              <AdminBlogTab />
            </TabsContent>
            <TabsContent value="messages" className="mt-0">
              <AdminMessagesTab />
            </TabsContent>
            <TabsContent value="about" className="mt-0">
              <AdminAboutTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
