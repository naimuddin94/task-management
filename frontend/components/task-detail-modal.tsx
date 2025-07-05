"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Tag, Edit, Trash2, Clock } from "lucide-react";
import { TaskForm } from "./task-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TCategory, TTask } from "@/types";
import { getPriorityColor } from "@/constants";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/features/task/taskApi";
import { toast } from "sonner";

interface TaskDetailModalProps {
  task: TTask;
  categories: TCategory[];
  onClose: () => void;
}

export function TaskDetailModal({
  task,
  categories,
  onClose,
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [deleteTaskFn] = useDeleteTaskMutation();

  const handleDelete = (taskId: string) => {
    deleteTaskFn(taskId)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          onClose();
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong!");
      });
  };

  const [updateTask] = useUpdateTaskMutation();

  const toggleTaskComplete = (task: TTask) => {
    updateTask({ taskId: task?._id, data: { completed: !task.completed } })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          onClose();
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong!");
      });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? "Edit Task" : "Task Details"}</span>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the task.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <TaskForm
            categories={categories}
            initialData={{
              _id: task?._id,
              title: task.title,
              description: task?.description || "",
              dueDate: task?.dueDate || "",
              priority: task.priority,
              category: task?.category?._id || "",
            }}
            onCancel={() => setIsEditing(false)}
            onCloseDetailModal={onClose}
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h2
                className={`text-xl font-semibold ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h2>
              {task.description && (
                <p
                  className={`mt-2 ${
                    task.completed ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Priority
                  </h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Category
                  </h3>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: task?.category?.color,
                      color: task?.category?.color,
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {task?.category?.name}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {task.dueDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Due Date
                    </h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-orange-400" />
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Created
                  </h3>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={task.completed ? "default" : "secondary"}>
                  {task.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => toggleTaskComplete(task)}
              >
                Mark as {task.completed ? "Pending" : "Complete"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
