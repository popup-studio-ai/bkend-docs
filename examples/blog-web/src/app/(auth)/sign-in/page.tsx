"use client";

import { SignInForm } from "@/components/auth/sign-in-form";
import { PageTransition } from "@/components/motion/page-transition";

export default function SignInPage() {
  return (
    <PageTransition>
      <SignInForm />
    </PageTransition>
  );
}
