"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  FilePlus,
  Bookmark,
  PenSquare,
  Tag,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { useArticles } from "@/hooks/queries/use-articles";
import { useBookmarks } from "@/hooks/queries/use-bookmarks";
import { calculateReadingTime, formatRelativeTime, stripHtml, truncate } from "@/lib/utils";
import { PageTransition } from "@/components/motion/page-transition";

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  color,
  index,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  href: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={href}>
        <Card className="group transition-all duration-200 hover:shadow-md hover:border-accent-color/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                {value !== undefined ? (
                  <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
                ) : (
                  <Skeleton className="mt-2 h-8 w-12" />
                )}
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: publishedData } = useArticles({
    page: 1,
    limit: 1,
    filters: { isPublished: true },
  });

  const { data: draftData } = useArticles({
    page: 1,
    limit: 1,
    filters: { isPublished: false },
  });

  const { data: recentArticles } = useArticles({
    page: 1,
    limit: 4,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  const { data: bookmarkData } = useBookmarks(1, 1);

  const stats = [
    {
      label: "Published",
      value: publishedData?.pagination.total,
      icon: FileText,
      href: "/articles",
      color: "bg-gradient-brand",
    },
    {
      label: "Drafts",
      value: draftData?.pagination.total,
      icon: FilePlus,
      href: "/articles",
      color: "bg-amber-500",
    },
    {
      label: "Bookmarks",
      value: bookmarkData?.pagination.total,
      icon: Bookmark,
      href: "/bookmarks",
      color: "bg-emerald-500",
    },
  ];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <PageTransition className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, {user?.name || "there"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your blog
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Recent Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Articles</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/articles">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentArticles?.items && recentArticles.items.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentArticles.items.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              >
                <Link href={`/articles/${article.id}`}>
                  <Card className="group h-full transition-all duration-200 hover:shadow-md hover:border-accent-color/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium line-clamp-1 group-hover:text-accent-color transition-colors">
                            {article.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {truncate(stripHtml(article.content), 100)}
                          </p>
                        </div>
                        {article.coverImage && (
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md">
                            <img
                              src={article.coverImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        {article.category && (
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {calculateReadingTime(article.content)} min read
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(article.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No articles yet. Write your first one!
              </p>
              <Button className="mt-4" size="sm" asChild>
                <Link href="/articles/new">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Write Article
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/articles/new">
              <PenSquare className="mr-2 h-4 w-4" />
              Write New Article
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tags">
              <Tag className="mr-2 h-4 w-4" />
              Manage Tags
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/bookmarks">
              <Bookmark className="mr-2 h-4 w-4" />
              My Bookmarks
            </Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
