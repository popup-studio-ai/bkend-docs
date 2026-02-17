"use client";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { PageTransition } from "@/components/motion/page-transition";

export default function SignUpPage() {
  return (
    <PageTransition>
      <SignUpForm />
    </PageTransition>
  );
}
