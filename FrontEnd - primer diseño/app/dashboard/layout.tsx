import type React from "react"
import Link from "next/link"
import { LogOut, User, QrCode, BookOpen, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import "./styles.css"
import logoUniversidad from "../../public/Logo-nuevo-vertical-removebg-preview.png";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white py-4 px-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="bg-[#333333] p-2 rounded">
            <Image src={logoUniversidad} alt="Foto del usuario" width={70} height={80} className="rounded-md" />
          </div>
          <Link href="/dashboard" className="text-xl font-bold">
            UFPS Carné Digital
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span>Juan Perez</span>
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <User size={18} />
              </div>
            </div>

            <Button variant="outline" size="sm" className="text-black border-white hover:bg-white/10">
              <LogOut size={18} className="mr-2" />
              <span>Cerrar Sesión</span>
            </Button>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-black/10">
                <Menu size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 bg-gray-50 border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
              <QrCode size={20} />
              <span>Carné Digital</span>
            </Link>
            <Link href="/dashboard/attendance" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
              <BookOpen size={20} />
              <span>Asistencias</span>
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
              <User size={20} />
              <span>Perfil</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
              <Settings size={20} />
              <span>Configuración</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
      </div>

      <footer className="bg-black text-white py-4 px-6">
        <div className="container mx-auto text-center text-sm">
          © {new Date().getFullYear()} Universidad Francisco de Paula Santander - Carnet Digital
        </div>
      </footer>
    </div>
  )
}

