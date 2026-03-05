import type { AboutSection } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAboutSection, useUpdateAbout } from "@/hooks/useQueries";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AdminAboutTab() {
  const { data: about, isLoading } = useAboutSection();
  const updateAbout = useUpdateAbout();

  const [form, setForm] = useState<AboutSection>({
    name: "",
    title: "",
    description: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    if (about) {
      setForm({
        name: about.name || "Navneet Singh",
        title: about.title || "AI Engineer & Full-Stack Developer",
        description:
          about.description ||
          "Passionate AI engineer and full-stack developer specializing in intelligent systems, decentralized applications, and cutting-edge machine learning solutions.",
        profileImageUrl: about.profileImageUrl || "",
      });
    }
  }, [about]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await updateAbout.mutateAsync(form);
      toast.success("About section updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <Skeleton key={i} className="h-10 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-lg">
      <h3 className="font-display font-semibold text-foreground">
        About Section
      </h3>

      <div className="space-y-1.5">
        <Label>Full Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Navneet Singh"
          className="bg-muted/30"
          data-ocid="admin.about.name_input"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Title / Role</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="AI Engineer & Full-Stack Developer"
          className="bg-muted/30"
          data-ocid="admin.about.input"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="About yourself..."
          rows={5}
          className="bg-muted/30 resize-none"
          data-ocid="admin.about.textarea"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Profile Image URL</Label>
        <Input
          value={form.profileImageUrl}
          onChange={(e) =>
            setForm((f) => ({ ...f, profileImageUrl: e.target.value }))
          }
          placeholder="https://..."
          className="bg-muted/30"
          data-ocid="admin.about.image_input"
        />
        {form.profileImageUrl && (
          <div className="mt-2">
            <img
              src={form.profileImageUrl}
              alt="Profile preview"
              className="w-16 h-16 rounded-xl object-cover border border-border/50"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <Button
        data-ocid="admin.about.save_button"
        onClick={handleSave}
        disabled={updateAbout.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
      >
        {updateAbout.isPending ? (
          <Loader2 size={14} className="mr-2 animate-spin" />
        ) : (
          <Save size={14} className="mr-2" />
        )}
        Save Changes
      </Button>
    </div>
  );
}
