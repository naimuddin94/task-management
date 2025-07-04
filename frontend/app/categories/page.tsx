"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CategoryManager } from "@/components/category-manager"

interface Category {
  id: string
  name: string
  color: string
}

const mockCategories: Category[] = [
  { id: "1", name: "work", color: "#3b82f6" },
  { id: "2", name: "personal", color: "#10b981" },
  { id: "3", name: "health", color: "#f59e0b" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Category Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryManager categories={categories} onUpdateCategories={setCategories} />
      </div>
    </div>
  )
}
