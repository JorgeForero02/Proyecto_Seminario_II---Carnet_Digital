"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate registration process
    setTimeout(() => {
      setLoading(false)
      router.push("/login")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#004A87] text-white py-4 px-6">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-2 text-white">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#004A87]">Create an Account</CardTitle>
            <CardDescription className="text-center">Register for your UFPS Digital Card</CardDescription>
          </CardHeader>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="professor">Professor</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="First name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Last name" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" placeholder="Enter your student ID" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@ufps.edu.co" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="systems">Systems Engineering</SelectItem>
                        <SelectItem value="civil">Civil Engineering</SelectItem>
                        <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                        <SelectItem value="industrial">Industrial Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" placeholder="Confirm your password" required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full bg-[#E30613] hover:bg-[#c00510]" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                  </Button>
                  <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#004A87] hover:underline">
                      Login here
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="professor">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prof-first-name">First Name</Label>
                      <Input id="prof-first-name" placeholder="First name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prof-last-name">Last Name</Label>
                      <Input id="prof-last-name" placeholder="Last name" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professor-id">Professor ID</Label>
                    <Input id="professor-id" placeholder="Enter your professor ID" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-email">Email</Label>
                    <Input id="prof-email" type="email" placeholder="your.email@ufps.edu.co" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="systems">Systems Engineering</SelectItem>
                        <SelectItem value="civil">Civil Engineering</SelectItem>
                        <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                        <SelectItem value="industrial">Industrial Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="prof-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-confirm-password">Confirm Password</Label>
                    <Input id="prof-confirm-password" type="password" placeholder="Confirm your password" required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full bg-[#004A87] hover:bg-[#003a6d]" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                  </Button>
                  <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#004A87] hover:underline">
                      Login here
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      <footer className="bg-[#004A87] text-white py-4 px-6">
        <div className="container mx-auto text-center text-sm">
          © {new Date().getFullYear()} Francisco de Paula Santander University
        </div>
      </footer>
    </div>
  )
}

