"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Router } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { taskSchema, TTaskPayload } from "@/lib/validations/task";
import { TCategory, TPriority } from "@/types";
import {
  useAddTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/features/task/taskApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TaskFormProps {
  categories: TCategory[];
  initialData?: {
    _id: string;
    title: string;
    description: string;
    dueDate?: string;
    priority: TPriority;
    category: string;
  };
  onCancel: () => void;
  onCloseDetailModal?: () => void;
}

export function TaskForm({
  categories,
  initialData,
  onCancel,
  onCloseDetailModal,
}: TaskFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TTaskPayload>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialData?.dueDate || "",
      priority: initialData?.priority || "Medium",
      category: initialData?.category || categories[0]?._id || "",
    },
  });

  const dueDateValue = watch("dueDate");
  const selectedDate = dueDateValue ? new Date(dueDateValue) : undefined;

  const [addTaskFn] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const onSubmit = (data: TTaskPayload) => {
    if (initialData?._id) {
      updateTask({ taskId: initialData?._id, data })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message);
            reset();
            onCancel();
            onCloseDetailModal && onCloseDetailModal();
          }
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Something went wrong!");
        });
    } else {
      addTaskFn(data)
        .unwrap()
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message);
            reset();
            onCancel();
          }
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Something went wrong!");
        });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setValue("dueDate", date ? date.toISOString() : "", {
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      {/* Priority & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            defaultValue={initialData?.priority || "Medium"}
            onValueChange={(value) =>
              setValue("priority", value as TPriority, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-red-500">{errors.priority.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            defaultValue={initialData?.category || categories[0]?._id}
            onValueChange={(value) =>
              setValue("category", value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-transparent"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dueDate && (
          <p className="text-sm text-red-500">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? "Update Task" : "Add Task"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
