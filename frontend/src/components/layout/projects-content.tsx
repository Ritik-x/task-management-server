"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { projects, type Project } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProjectsContent() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await projects.getAll();
      setProjectsList(data.projects || []);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch projects",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Project name is required",
      });
      return;
    }

    try {
      await projects.create(newProjectName);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setNewProjectName("");
      setIsAddOpen(false);
      fetchProjects();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create project",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projects.delete(id);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      fetchProjects();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddProject();
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProject}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projectsList.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-sm text-zinc-500 max-w-sm mt-2 mb-4">
            Create your first project to start organizing your tasks efficiently.
          </p>
          <Button variant="outline" onClick={() => setIsAddOpen(true)}>
            Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projectsList.map((project) => (
            <Card key={project._id} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between">
                  <span className="truncate pr-4" title={project.name}>
                    {project.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-red-500 -mt-2 -mr-2"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="text-sm text-zinc-500">
                  {project.createdAt ? `Created ${new Date(project.createdAt).toLocaleDateString()}` : "Active"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
