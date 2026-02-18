"use client";

import { isValidElement } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) {
      return <Package className="h-7 w-7 text-accent-color" />;
    }
    if (isValidElement(icon)) {
      return icon;
    }
    // LucideIcon: function or forwardRef object
    const Icon = icon as LucideIcon;
    return <Icon className="h-7 w-7 text-accent-color" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed p-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand-subtle">
        {renderIcon()}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
