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

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login process
    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-black text-white py-4 px-6">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-2 text-white">
            <ArrowLeft size={20} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-black">UFPS Carné Digital</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="student">Estudiante</TabsTrigger>
              <TabsTrigger value="professor">Profesor</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Código de Estudiante</Label>
                    <Input id="student-id" placeholder="Ingresa tu código de estudiante" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="student-password">Contraseña</Label>
                      <Link href="/forgot-password" className="text-sm text-ufps-red hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
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
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full bg-ufps-red hover:bg-ufps-red/90" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="professor">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="professor-id">ID de Profesor</Label>
                    <Input id="professor-id" placeholder="Ingresa tu ID de profesor" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="professor-password">Contraseña</Label>
                      <Link href="/forgot-password" className="text-sm text-ufps-red hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="professor-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
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
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full bg-black hover:bg-black/90" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-id">ID de Administrador</Label>
                    <Input id="admin-id" placeholder="Ingresa tu ID de administrador" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password">Contraseña</Label>
                      <Link href="/forgot-password" className="text-sm text-ufps-red hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
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
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full bg-black hover:bg-black/90" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      <footer className="bg-black text-white py-4 px-6">
        <div className="container mx-auto text-center text-sm">
          © {new Date().getFullYear()} Universidad Francisco de Paula Santander
        </div>
      </footer>
    </div>
  )
}

