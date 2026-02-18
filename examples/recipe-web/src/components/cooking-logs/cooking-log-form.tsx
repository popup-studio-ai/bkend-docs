"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./star-rating";
import { useCreateCookingLog } from "@/hooks/queries/use-cooking-logs";
import { useDemoGuard } from "@/hooks/use-demo-guard";
import { DemoBanner } from "@/components/shared/demo-banner";

interface CookingLogFormProps {
  recipeId: string;
}

export function CookingLogForm({ recipeId }: CookingLogFormProps) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const createCookingLog = useCreateCookingLog();
  const { isDemoAccount } = useDemoGuard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    await createCookingLog.mutateAsync({
      recipeId,
      rating,
      notes: notes.trim() || undefined,
    });

    setRating(0);
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isDemoAccount && <DemoBanner />}
      <div className="space-y-2">
        <Label>Rating</Label>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating === 0 && (
          <p className="text-xs text-muted-foreground">Please select a rating</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cooking-notes">Notes (optional)</Label>
        <Textarea
          id="cooking-notes"
          placeholder="Share your cooking experience..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || createCookingLog.isPending || isDemoAccount}
        className="w-full"
      >
        {createCookingLog.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Add Cooking Log
      </Button>
    </form>
  );
}
