import type { BlogPost } from "@/backend.d";
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
  useBlogPosts,
  useCreateBlogPost,
  useDeleteBlogPost,
  useUpdateBlogPost,
} from "@/hooks/useQueries";
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY: Omit<BlogPost, "id"> = {
  title: "",
  content: "",
  summary: "",
  tags: [],
  published: false,
  publishedDate: BigInt(0),
};

function generateId() {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function BlogForm({
  value,
  onChange,
}: {
  value: Omit<BlogPost, "id">;
  onChange: (v: Omit<BlogPost, "id">) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !value.tags.includes(t)) {
      onChange({ ...value, tags: [...value.tags, t] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    onChange({ ...value, tags: value.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Post title"
          className="bg-muted/30"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Summary</Label>
        <Textarea
          value={value.summary}
          onChange={(e) => onChange({ ...value, summary: e.target.value })}
          placeholder="Brief summary shown in cards..."
          rows={2}
          className="bg-muted/30 resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Content</Label>
        <Textarea
          value={value.content}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
          placeholder="Full post content (markdown supported)..."
          rows={8}
          className="bg-muted/30 resize-none font-mono text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag..."
            className="bg-muted/30"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors font-mono text-xs"
              onClick={() => removeTag(t)}
            >
              {t} ×
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={value.published}
          onCheckedChange={(checked) =>
            onChange({
              ...value,
              published: checked,
              publishedDate: checked ? BigInt(Date.now()) : BigInt(0),
            })
          }
          id="published-switch"
        />
        <Label htmlFor="published-switch" className="cursor-pointer">
          Publish post
        </Label>
      </div>
    </div>
  );
}

export function AdminBlogTab() {
  const { data: posts, isLoading } = useBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Omit<BlogPost, "id">>(EMPTY);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormData(EMPTY);
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
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
        await updatePost.mutateAsync({ ...formData, id: editing.id });
        toast.success("Post updated");
      } else {
        await createPost.mutateAsync({ ...formData, id: generateId() });
        toast.success("Post created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await updatePost.mutateAsync({
        ...post,
        published: !post.published,
        publishedDate: !post.published ? BigInt(Date.now()) : BigInt(0),
      });
      toast.success(post.published ? "Post unpublished" : "Post published");
    } catch {
      toast.error("Failed to update");
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
          Blog Posts{" "}
          <span className="text-muted-foreground text-sm font-normal">
            ({posts?.length ?? 0})
          </span>
        </h3>
        <Button
          size="sm"
          data-ocid="admin.blog_add_button"
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={14} className="mr-1" />
          New Post
        </Button>
      </div>

      <div className="space-y-3">
        {!posts?.length ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No posts yet. Create one!
          </p>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              className="glass rounded-xl p-4 flex items-start gap-4 hover:border-primary/20 border border-transparent transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {p.title}
                  </h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs py-0 flex-shrink-0 ${p.published ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : "bg-muted/40 text-muted-foreground"}`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                {p.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {p.summary}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0, 4).map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="text-xs py-0 font-mono"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="admin.blog.toggle_button"
                  className={`h-7 w-7 p-0 ${p.published ? "hover:text-amber-400" : "hover:text-emerald-400"}`}
                  onClick={() => togglePublish(p)}
                  title={p.published ? "Unpublish" : "Publish"}
                >
                  {p.published ? <EyeOff size={13} /> : <Eye size={13} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="admin.blog.edit_button"
                  className="h-7 w-7 p-0 hover:text-primary"
                  onClick={() => openEdit(p)}
                >
                  <Pencil size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="admin.blog.delete_button"
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
          className="glass border-border/50 max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.blog.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Post" : "New Post"}
            </DialogTitle>
          </DialogHeader>
          <BlogForm value={formData} onChange={setFormData} />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.blog.cancel_button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.blog.save_button"
              onClick={handleSave}
              disabled={createPost.isPending || updatePost.isPending}
              className="bg-primary text-primary-foreground"
            >
              {createPost.isPending || updatePost.isPending ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              {editing ? "Save Changes" : "Create Post"}
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
          data-ocid="admin.blog.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Delete Post?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.blog.delete_cancel_button"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="admin.blog.confirm_button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deletePost.isPending}
            >
              {deletePost.isPending ? (
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
