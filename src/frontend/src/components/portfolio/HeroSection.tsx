import { Button } from "@/components/ui/button";
import { ArrowDown, Brain, Code2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ParticleCanvas } from "./ParticleCanvas";

const TITLES = [
  "AI Engineer",
  "Full-Stack Developer",
  "ML Researcher",
  "Web3 Builder",
];

function useTypingEffect(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }

    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

export function HeroSection() {
  const typedTitle = useTypingEffect(TITLES);

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0">
        <ParticleCanvas />
      </div>

      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-20 pointer-events-none" />

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-gradient mb-8 text-sm text-primary font-medium"
        >
          <Sparkles size={14} className="animate-pulse-glow" />
          <span>Available for innovative projects</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-4 leading-none"
        >
          <span className="text-foreground">Navneet</span>
          <br />
          <span className="gradient-text-cyber text-glow-cyan">Singh</span>
        </motion.h1>

        {/* Typing title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="h-12 flex items-center justify-center mb-8"
        >
          <div className="flex items-center gap-3 text-xl sm:text-2xl md:text-3xl font-display font-semibold text-muted-foreground">
            <Code2 size={20} className="text-primary" />
            <span>{typedTitle}</span>
            <span className="w-0.5 h-7 bg-primary animate-cursor" />
            <Brain size={20} className="text-secondary" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Building intelligent systems, decentralized applications, and
          cutting-edge ML solutions that shape the future.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            data-ocid="hero.primary_button"
            onClick={scrollToProjects}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-base shadow-glow-cyan transition-all hover:shadow-glow-cyan hover:scale-105 border border-primary/30"
          >
            <Sparkles size={16} className="mr-2" />
            View My Work
          </Button>
          <Button
            size="lg"
            variant="outline"
            data-ocid="hero.secondary_button"
            onClick={scrollToAbout}
            className="border-border/60 hover:border-primary/40 hover:bg-primary/5 px-8 py-6 text-base transition-all hover:scale-105 font-semibold"
          >
            About Me
            <ArrowDown size={16} className="ml-2" />
          </Button>
        </motion.div>

        {/* Tech stack pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-12"
        >
          {["Python", "TensorFlow", "React", "ICP", "FastAPI", "PyTorch"].map(
            (tech, i) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono text-muted-foreground/70 border border-border/30 rounded-full hover:border-primary/30 hover:text-primary transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {tech}
              </span>
            ),
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
      >
        <span className="text-xs font-mono tracking-widest uppercase">
          scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
      </motion.div>
    </section>
  );
}
