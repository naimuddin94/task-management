import { redirect } from "next/navigation"

export default function HomePage() {
  // In a real app, you'd check authentication status here
  // For now, redirect to login
  redirect("/login")
}
