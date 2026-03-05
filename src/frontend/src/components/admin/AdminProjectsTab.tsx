import type { Project } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/useQueries";
import {
  ExternalLink,
  Github,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY: Omit<Project, "id"> = {
  title: "",
  description: "",
  techStack: [],
  demoUrl: "",
  githubUrl: "",
  imageUrl: "",
  featured: false,
};

function generateId() {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function ProjectForm({
  value,
  onChange,
}: {
  value: Omit<Project, "id">;
  onChange: (v: Omit<Project, "id">) => void;
}) {
  const [techInput, setTechInput] = useState("");

  const addTech = () => {
    const t = techInput.trim();
    if (t && !value.techStack.includes(t)) {
      onChange({ ...value, techStack: [...value.techStack, t] });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    onChange({
      ...value,
      techStack: value.techStack.filter((t) => t !== tech),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Project title"
          className="bg-muted/30"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Project description"
          rows={3}
          className="bg-muted/30 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Demo URL</Label>
          <Input
            value={value.demoUrl}
            onChange={(e) => onChange({ ...value, demoUrl: e.target.value })}
            placeholder="https://..."
            className="bg-muted/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label>GitHub URL</Label>
          <Input
            value={value.githubUrl}
            onChange={(e) => onChange({ ...value, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
            className="bg-muted/30"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Image URL</Label>
        <Input
          value={value.imageUrl}
          onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
          placeholder="https://..."
          className="bg-muted/30"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Tech Stack</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="Add technology..."
            className="bg-muted/30"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTech}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.techStack.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={() => removeTech(t)}
            >
              {t} ×
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={value.featured}
          onCheckedChange={(checked) =>
            onChange({ ...value, featured: checked })
          }
          id="featured-switch"
        />
        <Label htmlFor="featured-switch" className="cursor-pointer">
          Featured project
        </Label>
      </div>
    </div>
  );
}

export function AdminProjectsTab() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, "id">>(EMPTY);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormData(EMPTY);
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    const { id: _id, ...rest } = p;
    setFormData(rest);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      if (editing) {
        await updateProject.mutateAsync({ ...formData, id: editing.id });
        toast.success("Project updated");
      } else {
        await createProject.mutateAsync({ ...formData, id: generateId() });
        toast.success("Project created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">
          Projects{" "}
          <span className="text-muted-foreground text-sm font-normal">
            ({projects?.length ?? 0})
          </span>
        </h3>
        <Button
          size="sm"
          data-ocid="admin.project_add_button"
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={14} className="mr-1" />
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {!projects?.length ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No projects yet. Add one!
          </p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="glass rounded-xl p-4 flex items-start gap-4 hover:border-primary/20 border border-transparent transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {p.title}
                  </h4>
                  {p.featured && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20 py-0"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.techStack.slice(0, 4).map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="text-xs py-0 font-mono"
                    >
                      {t}
                    </Badge>
                  ))}
                  {p.techStack.length > 4 && (
                    <Badge
                      variant="secondary"
                      className="text-xs py-0 font-mono"
                    >
                      +{p.techStack.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {p.demoUrl && p.demoUrl !== "#" && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                {p.githubUrl && p.githubUrl !== "#" && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={14} />
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="admin.project.edit_button"
                  className="h-7 w-7 p-0 hover:text-primary"
                  onClick={() => openEdit(p)}
                >
                  <Pencil size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="admin.project.delete_button"
                  className="h-7 w-7 p-0 hover:text-destructive"
                  onClick={() => setDeleteConfirmId(p.id)}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="glass border-border/50 max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.project.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm value={formData} onChange={setFormData} />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.project.cancel_button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.project.save_button"
              onClick={handleSave}
              disabled={createProject.isPending || updateProject.isPending}
              className="bg-primary text-primary-foreground"
            >
              {createProject.isPending || updateProject.isPending ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              {editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="glass border-border/50 max-w-sm"
          data-ocid="admin.project.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Delete Project?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.project.delete_cancel_button"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="admin.project.confirm_button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
