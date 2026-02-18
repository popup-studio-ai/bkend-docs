"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignIn } from "@/hooks/queries/use-auth";
import { Loader2 } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const signIn = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "demo@bkend.ai",
      password: "Bkend123$",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn.mutateAsync(data);
      router.push("/");
    } catch {
      // error handled by mutation
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign in with your email and password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {signIn.isError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {signIn.error?.message || "Sign in failed."}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={signIn.isPending}
          >
            {signIn.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-accent-color underline-offset-4 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
