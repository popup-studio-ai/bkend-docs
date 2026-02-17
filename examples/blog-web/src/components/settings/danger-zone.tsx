"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useMe } from "@/hooks/queries/use-auth";
import { useDeleteAccount } from "@/hooks/queries/use-users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

export function DangerZone() {
  const { data: user } = useMe();
  const { addToast } = useToast();
  const deleteAccount = useDeleteAccount();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await deleteAccount.mutateAsync(user.id);
      addToast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (error) {
      setIsDeleting(false);
      addToast({
        variant: "destructive",
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "Failed to delete account",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-destructive/50 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. All your
              articles, bookmarks, and data will be permanently removed.
            </p>
            <Button
              variant="destructive"
              onClick={() => setIsDialogOpen(true)}
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
