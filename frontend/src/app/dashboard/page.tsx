"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardContent from "@/components/layout/dashboard-content";
import TaskContent from "@/components/layout/tasks-content";
import ProjectsContent from "@/components/layout/projects-content";
import AdminContent from "@/components/layout/admin-content";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back,{" "}
                <span className="text-indigo-600">
                  {user?.email?.split("@")[0]}
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
                Organize your workflow, track progress, and manage tasks in a
                clean and efficient workspace.
              </p>
            </div>

            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-lg font-semibold text-indigo-700 md:flex">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className={`grid w-full rounded-2xl border border-zinc-200 bg-zinc-100 p-1 ${user.role === 'admin' ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger
              value="dashboard"
              className="rounded-xl py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-xl py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-xl py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Tasks
            </TabsTrigger>
            {user.role === 'admin' && (
              <TabsTrigger
                value="admin"
                className="rounded-xl py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
              <DashboardContent />
            </div>
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects" className="mt-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
              <ProjectsContent />
            </div>
          </TabsContent>

          {/* Tasks */}
          <TabsContent value="tasks" className="mt-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
              <TaskContent />
            </div>
          </TabsContent>

          {/* Admin */}
          {user.role === 'admin' && (
            <TabsContent value="admin" className="mt-6">
              <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                <AdminContent />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
