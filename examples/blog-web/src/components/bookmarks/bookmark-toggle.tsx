"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useBookmarkByArticle,
  useToggleBookmark,
} from "@/hooks/queries/use-bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkToggleProps {
  articleId: string;
  size?: "default" | "sm";
}

export function BookmarkToggle({
  articleId,
  size = "default",
}: BookmarkToggleProps) {
  const { data: bookmark } = useBookmarkByArticle(articleId);
  const toggle = useToggleBookmark();

  const isBookmarked = !!bookmark;

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon" : "default"}
      className={cn(
        size === "sm" ? "h-7 w-7" : "h-9",
        isBookmarked && "text-accent-color"
      )}
      onClick={() => toggle.mutate(articleId)}
      disabled={toggle.isPending}
    >
      <Bookmark
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
          isBookmarked && "fill-current"
        )}
      />
      {size !== "sm" && (
        <span className="ml-1">{isBookmarked ? "Saved" : "Bookmark"}</span>
      )}
    </Button>
  );
}
