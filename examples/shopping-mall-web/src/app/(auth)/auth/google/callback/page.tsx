"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGoogleCallback } from "@/hooks/queries/use-auth";
import { OAUTH_CALLBACK_PATH, OAUTH_STATE_KEY } from "@/lib/constants";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleCallback = useGoogleCallback();
  const processedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const googleError = searchParams.get("error");
    if (googleError) {
      setError(`Google login was cancelled or failed: ${googleError}`);
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setError("Missing authorization parameters. Please try again.");
      return;
    }

    const savedState = sessionStorage.getItem(OAUTH_STATE_KEY);
    sessionStorage.removeItem(OAUTH_STATE_KEY);

    if (state !== savedState) {
      setError("Security validation failed. Please try signing in again.");
      return;
    }

    const redirectUri = `${window.location.origin}${OAUTH_CALLBACK_PATH}`;

    googleCallback.mutate(
      { code, redirectUri, state },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (err) => {
          setError(err.message || "Failed to complete Google login. Please try again.");
        },
      },
    );
  }, [searchParams, googleCallback, router]);

  if (error) {
    return (
      <Card className="w-full border-border">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">Login Failed</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border">
      <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Completing Google login...</p>
      </CardContent>
    </Card>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full border-border">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
