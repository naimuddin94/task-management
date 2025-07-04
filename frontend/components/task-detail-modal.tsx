"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Tag, Edit, Trash2, Clock } from "lucide-react"
import { TaskForm } from "./task-form"
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
} from "@/components/ui/alert-dialog"

interface Task {
  id: string
  title: string
  description: string
  dueDate?: string
  priority: "low" | "medium" | "high"
  category: string
  completed: boolean
  createdAt: string
}

interface Category {
  id: string
  name: string
  color: string
}

interface TaskDetailModalProps {
  task: Task
  categories: Category[]
  onUpdate: (taskId: string, data: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onClose: () => void
}

export function TaskDetailModal({ task, categories, onUpdate, onDelete, onClose }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category?.color || "#6b7280"
  }

  const handleUpdate = (data: Partial<Task>) => {
    onUpdate(task.id, data)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? "Edit Task" : "Task Details"}</span>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
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
                          This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
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
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              priority: task.priority,
              category: task.category,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h2
                className={`text-xl font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
              >
                {task.title}
              </h2>
              {task.description && (
                <p className={`mt-2 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>{task.description}</p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: getCategoryColor(task.category),
                      color: getCategoryColor(task.category),
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {task.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {task.dueDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Due Date</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
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
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
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
              <Button variant="outline" onClick={() => onUpdate(task.id, { completed: !task.completed })}>
                Mark as {task.completed ? "Pending" : "Complete"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
