import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPosts } from "@/hooks/useQueries";
import { ArrowRight, BookOpen, CalendarDays, Clock } from "lucide-react";

function formatDate(timestamp: bigint): string {
  try {
    const ms = Number(timestamp);
    if (ms === 0) return "Recently";
    // If timestamp is in nanoseconds (ICP), convert to ms
    const date = ms > 1e15 ? new Date(ms / 1_000_000) : new Date(ms);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

const OCID_MAP: Record<number, string> = {
  0: "blog.item.1",
  1: "blog.item.2",
  2: "blog.item.3",
};

export function BlogSection() {
  const { data: posts, isLoading } = useBlogPosts();

  const published = posts?.filter((p) => p.published) ?? [];

  return (
    <section
      id="blog"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 w-80 h-80 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-[0.06] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="section-hidden mb-16 text-center">
          <span className="font-mono text-sm text-primary tracking-widest uppercase">
            04 / Blog
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mt-3 gradient-text-cyber">
            Thoughts & Insights
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Exploring AI, distributed systems, and the future of technology.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : published.length === 0 ? (
          <div
            data-ocid="blog.empty_state"
            className="section-hidden text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl glass flex items-center justify-center border-gradient">
              <BookOpen size={24} className="text-muted-foreground/50" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground/70 mb-2">
              No posts published yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Check back soon — articles on AI, ML, and Web3 are coming.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 section-hidden">
            {published.slice(0, 6).map((post, i) => {
              const ocid = OCID_MAP[i] ?? `blog.item.${i + 1}`;
              return (
                <article
                  key={post.id}
                  data-ocid={ocid}
                  className="glass rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all group hover:-translate-y-1 hover:shadow-card-glow flex flex-col"
                >
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs font-mono bg-primary/10 text-primary border-primary/20 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-foreground leading-snug mb-3 group-hover:text-primary transition-colors flex-1">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  {post.summary && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.summary}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/60 font-mono mt-auto pt-4 border-t border-border/30">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={11} />
                      {formatDate(post.publishedDate)}
                    </span>
                    <span className="flex items-center gap-1.5 ml-auto text-primary/60 group-hover:text-primary transition-colors">
                      Read more <ArrowRight size={11} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
