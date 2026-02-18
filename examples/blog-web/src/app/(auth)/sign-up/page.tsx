import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { PageTransition } from "@/components/motion/page-transition";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new bkend Blog account to start writing and publishing articles.",
};

export default function SignUpPage() {
  return (
    <PageTransition>
      <SignUpForm />
    </PageTransition>
  );
}
