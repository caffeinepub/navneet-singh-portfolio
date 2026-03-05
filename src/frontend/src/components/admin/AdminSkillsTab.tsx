import type { Skill } from "@/backend.d";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  useCreateSkill,
  useDeleteSkill,
  useSkills,
  useUpdateSkill,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = ["AI/ML", "Web Dev", "Blockchain", "Tools", "Other"];

const EMPTY = { name: "", category: "AI/ML", proficiency: 80 };

function generateId() {
  return `skill_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function AdminSkillsTab() {
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [formData, setFormData] = useState(EMPTY);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormData(EMPTY);
    setDialogOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditing(s);
    setFormData({
      name: s.name,
      category: s.category,
      proficiency: Number(s.proficiency),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editing) {
        await updateSkill.mutateAsync({
          ...editing,
          ...formData,
          proficiency: BigInt(formData.proficiency),
        });
        toast.success("Skill updated");
      } else {
        await createSkill.mutateAsync({
          id: generateId(),
          ...formData,
          proficiency: BigInt(formData.proficiency),
        });
        toast.success("Skill created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill.mutateAsync(id);
      toast.success("Skill deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Group by category
  const grouped = (skills ?? []).reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">
          Skills{" "}
          <span className="text-muted-foreground text-sm font-normal">
            ({skills?.length ?? 0})
          </span>
        </h3>
        <Button
          size="sm"
          data-ocid="admin.skill_add_button"
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={14} className="mr-1" />
          Add Skill
        </Button>
      </div>

      {!skills?.length ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No skills yet. Add one!
        </p>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category}>
              <h4 className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wide mb-2">
                {category}
              </h4>
              <div className="space-y-2">
                {catSkills.map((s) => (
                  <div
                    key={s.id}
                    className="glass rounded-xl px-4 py-3 flex items-center gap-4 hover:border-primary/20 border border-transparent transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-sm font-medium text-foreground">
                          {s.name}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground ml-auto">
                          {Number(s.proficiency)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Number(s.proficiency)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        data-ocid="admin.skill.edit_button"
                        className="h-7 w-7 p-0 hover:text-primary"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-ocid="admin.skill.delete_button"
                        className="h-7 w-7 p-0 hover:text-destructive"
                        onClick={() => setDeleteConfirmId(s.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="glass border-border/50 max-w-md"
          data-ocid="admin.skill.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Skill" : "Add Skill"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Skill Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Python, TensorFlow"
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData((f) => ({ ...f, category: v }))
                }
              >
                <SelectTrigger
                  className="bg-muted/30"
                  data-ocid="admin.skill.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Proficiency</Label>
                <span className="font-mono text-sm text-primary">
                  {formData.proficiency}%
                </span>
              </div>
              <Slider
                value={[formData.proficiency]}
                onValueChange={([v]) =>
                  setFormData((f) => ({ ...f, proficiency: v }))
                }
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.skill.cancel_button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.skill.save_button"
              onClick={handleSave}
              disabled={createSkill.isPending || updateSkill.isPending}
              className="bg-primary text-primary-foreground"
            >
              {createSkill.isPending || updateSkill.isPending ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              {editing ? "Save Changes" : "Create Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="glass border-border/50 max-w-sm"
          data-ocid="admin.skill.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Delete Skill?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.skill.delete_cancel_button"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="admin.skill.confirm_button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteSkill.isPending}
            >
              {deleteSkill.isPending ? (
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
