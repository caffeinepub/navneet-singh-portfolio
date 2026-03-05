import type { ContactMessage } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useContactMessages,
  useDeleteContactMessage,
} from "@/hooks/useQueries";
import { Clock, Loader2, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint) {
  try {
    const ms = Number(ts);
    if (ms === 0) return "Unknown";
    const date = ms > 1e15 ? new Date(ms / 1_000_000) : new Date(ms);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "Unknown";
  }
}

export function AdminMessagesTab() {
  const { data: messages, isLoading } = useContactMessages();
  const deleteMessage = useDeleteContactMessage();

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage.mutateAsync(id);
      toast.success("Message deleted");
      setDeleteConfirmId(null);
      if (selected?.id === id) setSelected(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">
          Messages{" "}
          <span className="text-muted-foreground text-sm font-normal">
            ({messages?.length ?? 0})
          </span>
        </h3>
      </div>

      {!messages?.length ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl glass flex items-center justify-center border-gradient">
            <Mail size={20} className="text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              type="button"
              className="glass rounded-xl p-4 cursor-pointer hover:border-primary/20 border border-transparent transition-all w-full text-left"
              onClick={() => setSelected(msg)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-foreground text-sm">
                      {msg.name}
                    </span>
                    <span className="text-xs text-muted-foreground/60 font-mono truncate">
                      {msg.email}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground/80 truncate">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-muted-foreground/40 font-mono hidden sm:block">
                    {formatDate(msg.timestamp)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="admin.message.delete_button"
                    className="h-7 w-7 p-0 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(msg.id);
                    }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Message detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          className="glass border-border/50 max-w-lg"
          data-ocid="admin.message.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Message from {selected?.name}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="glass rounded-lg p-3 space-y-0.5">
                  <p className="text-xs text-muted-foreground/60 font-mono uppercase">
                    From
                  </p>
                  <p className="text-foreground font-medium">{selected.name}</p>
                </div>
                <div className="glass rounded-lg p-3 space-y-0.5">
                  <p className="text-xs text-muted-foreground/60 font-mono uppercase">
                    Email
                  </p>
                  <p className="text-primary text-sm truncate">
                    {selected.email}
                  </p>
                </div>
              </div>
              <div className="glass rounded-lg p-3 space-y-0.5">
                <p className="text-xs text-muted-foreground/60 font-mono uppercase">
                  Subject
                </p>
                <p className="text-foreground font-medium">
                  {selected.subject}
                </p>
              </div>
              <div className="glass rounded-lg p-3 space-y-1.5">
                <p className="text-xs text-muted-foreground/60 font-mono uppercase">
                  Message
                </p>
                <ScrollArea className="max-h-40">
                  <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </ScrollArea>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50 font-mono">
                <Clock size={11} />
                {formatDate(selected.timestamp)}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.message.close_button"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              data-ocid="admin.message.delete_confirm_button"
              onClick={() => selected && setDeleteConfirmId(selected.id)}
            >
              <Trash2 size={14} className="mr-1" />
              Delete
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
          data-ocid="admin.message.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Delete Message?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.message.delete_cancel_button"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="admin.message.confirm_button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteMessage.isPending}
            >
              {deleteMessage.isPending ? (
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
