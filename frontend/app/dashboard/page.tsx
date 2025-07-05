"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Calendar,
  Tag,
  AlertCircle,
  LogOut,
  Settings,
  RefreshCw,
} from "lucide-react";
import { TaskForm } from "@/components/task-form";
import { TaskDetailModal } from "@/components/task-detail-modal";
import { CategoryManager } from "@/components/category-manager";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { removeUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useGetCategoriesQuery } from "@/redux/features/task/categoryApi";
import { TTask } from "@/types";
import { TTaskPayload } from "@/lib/validations/task";
import { useGetAllTasksQuery } from "@/redux/features/task/taskApi";
import { getPriorityColor } from "@/constants";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedTask, setSelectedTask] = useState<TTask | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isLoading: categoryLoading } = useGetCategoriesQuery(null);
  const { data: tasksData, isLoading: taskLoading } = useGetAllTasksQuery({
    searchTerm,
  });

  const toggleTaskComplete = (taskId: string) => {};

  const onSubmit = (data: TTaskPayload) => {
    console.log(data);
  };

  const [logoutFn] = useLogoutMutation();

  const handleLogout = () => {
    logoutFn({})
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(removeUser());
          toast.success(res?.message);
          router.push("/");
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong!");
      });
  };

  if (categoryLoading || taskLoading) {
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-16"
      >
        <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-6" />
        <p className="text-gray-600 text-lg font-medium">
          Categories loading...
        </p>
      </motion.div>
    );
  }

  const categories = data?.data;
  const tasks = tasksData?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryManagerOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Categories
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                  categories={categories || []}
                  onCancel={() => setIsAddTaskOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {categories?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500 text-center">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  categoryFilter !== "all" ||
                  priorityFilter !== "all"
                    ? "Try adjusting your filters or search query."
                    : "Get started by creating your first task."}
                </p>
              </CardContent>
            </Card>
          ) : (
            tasks?.map((task) => (
              <Card
                key={task._id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  task.completed ? "opacity-75" : ""
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskComplete(task._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p
                              className={`text-sm mt-1 ${
                                task.completed
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              style={{
                                borderColor: task?.category?.color,
                                color: task?.category?.color,
                              }}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {task?.category?.name || "Unknow"}
                            </Badge>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          categories={categories || []}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Category Manager Modal */}
      <Dialog
        open={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>
          <CategoryManager categories={categories || []} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
