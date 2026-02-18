import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { PageTransition } from "@/components/motion/page-transition";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your bkend Blog account to manage articles and bookmarks.",
};

export default function SignInPage() {
  return (
    <PageTransition>
      <SignInForm />
    </PageTransition>
  );
}
