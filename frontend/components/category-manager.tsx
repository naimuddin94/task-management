"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, Palette, RefreshCw } from "lucide-react";
import { categorySchema, TCategoryPayload } from "@/lib/validations/task";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/task/categoryApi";
import { toast } from "sonner";
import { TCategory } from "@/types";


interface CategoryManagerProps {
  categories: TCategory[];
}

const colorOptions = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6b7280",
];

export function CategoryManager({ categories }: CategoryManagerProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TCategoryPayload>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
    },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const selectedColor = watch("color");

  const [addCategoryFn, { isLoading: addLoading }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: updateLoading }] =
    useUpdateCategoryMutation();

  const onSubmit = (data: TCategoryPayload) => {
    if (editingId) {
      updateCategory({ categoryId: editingId, data })
        .unwrap()
        .then((res) => {
          if (res?.success) toast.success(res?.message);
          reset();
          setEditingId(null);
          setIsAdding(false);
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Failed to update category.");
        });
    } else {
      addCategoryFn(data)
        .unwrap()
        .then((res) => {
          if (res?.success) toast.success(res?.message);
          reset();
          setIsAdding(false);
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Failed to add category.");
        });
    }
  };

  const handleEdit = (category: TCategory) => {
    setEditingId(category._id);
    setValue("name", category.name);
    setValue("color", category.color);
    setIsAdding(true);
  };

  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();

  const handleDelete = (categoryId: string) => {
    deleteCategory(categoryId)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong!");
      });
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {isAdding && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? "Edit Category" : "Add New Category"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={
                        errors.name
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            selectedColor === color
                              ? "border-black scale-110"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setValue("color", color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingId ? "Update Category" : "Add Category"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Categories ({categories?.length})
          </h3>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          )}
        </div>

        {categories?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Palette className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories yet
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Create your first category to organize your tasks.
              </p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {categories?.map((category) => (
              <Card key={category._id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
