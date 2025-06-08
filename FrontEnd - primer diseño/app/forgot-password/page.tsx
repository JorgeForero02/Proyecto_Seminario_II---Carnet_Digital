"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate password reset request
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#004A87] text-white py-4 px-6">
        <div className="container mx-auto">
          <Link href="/login" className="flex items-center gap-2 text-white">
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#004A87]">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {!submitted
                ? "Enter your email address and we'll send you a link to reset your password"
                : "Check your email for the reset link"}
            </CardDescription>
          </CardHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-[#004A87] hover:bg-[#003a6d]" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <p className="text-green-800">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <p className="text-sm text-gray-500 text-center">
                If you don't see the email in your inbox, please check your spam folder.
              </p>
            </CardContent>
          )}

          <CardFooter className="flex justify-center pt-0">
            <Link href="/login" className="text-sm text-[#004A87] hover:underline">
              Return to login
            </Link>
          </CardFooter>
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

