"use client";

import { LogOut, User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/hooks/queries/use-auth";
import { formatDate } from "@/lib/format";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const logout = useLogout();

  if (!user) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title="Profile" description="View your account information" />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-slate-900 text-xl text-white dark:bg-slate-200 dark:text-slate-900">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <dl className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-400" />
                <dt className="w-20 text-sm text-slate-500 dark:text-slate-400">
                  Name
                </dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {user.name}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <dt className="w-20 text-sm text-slate-500 dark:text-slate-400">
                  Email
                </dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {user.email}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <dt className="w-20 text-sm text-slate-500 dark:text-slate-400">
                  Joined
                </dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Button variant="destructive" className="w-full" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
