"use client";

import { motion } from "framer-motion";
import { FileText, Bookmark, Tag, Shield } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Rich Article Management",
    description: "Create, edit, and publish blog articles with cover images and categories.",
  },
  {
    icon: Tag,
    title: "Tag Organization",
    description: "Organize your content with custom tags for easy discovery.",
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    description: "Save your favorite articles and access them anytime.",
  },
  {
    icon: Shield,
    title: "Powered by bkend",
    description: "Built on the bkend platform with secure authentication and data management.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0wIDM2YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTgtMThjMS42NTcgMCAzLTEuMzQzIDMtM3MtMS4zNDMtMy0zLTMtMyAxLjM0My0zIDMgMS4zNDMgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">bkend Blog</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-4">
              Build your blog
              <br />
              with bkend
            </h1>
            <p className="text-lg text-white/80 mb-12 max-w-md">
              A full-featured blog application built on the bkend platform.
              Experience seamless content management with modern tools.
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-sm text-white/70 mt-0.5">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">bkend Blog</span>
          </div>

          {children}

          {/* Demo credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-lg border border-dashed border-border bg-muted/50 p-4"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Account</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Email: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">demo@bkend.ai</code>
              </p>
              <p>
                Password: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">Bkend123$</code>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
