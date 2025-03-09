import Link from "next/link"
import { Button } from "@/components/ui/button"
import logoVerticalBlanco from "../public/BLANCO.png";
import logoHorizontalUniversidad from "../public/Logo-nuevo-horizontal-removebg-preview.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#E30613] text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src={logoHorizontalUniversidad} alt="Foto del usuario" width={140} height={140} className="rounded-md" />
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Login
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#E30613] mb-6">Welcome to UFPS Digital Card</h1>
          <p className="text-lg mb-8">
            The digital identification and attendance management system for the Systems Engineering program at Francisco
            de Paula Santander University.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-[#E30613] mb-4">For Students</h2>
              <ul className="text-left space-y-2 mb-6">
                <li>• Digital student ID card</li>
                <li>• Easy class registration via QR code</li>
                <li>• Track your attendance history</li>
                <li>• Access university services</li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-[#E30613] hover:bg-[#c00510]">Student Login</Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-[#E30613] mb-4">For Professors</h2>
              <ul className="text-left space-y-2 mb-6">
                <li>• Create and manage classes</li>
                <li>• Generate QR codes for attendance</li>
                <li>• Track student participation</li>
                <li>• Manage advisory sessions</li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-[#E30613] hover:bg-[#c00510]">Professor Login</Button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-[#E30613] mb-4">About the Platform</h2>
            <p className="mb-4">
              The UFPS Digital Card platform modernizes university identification and attendance tracking, replacing
              traditional physical cards with a secure digital solution.
            </p>
            <p>
              Scan QR codes to register for classes, view your academic information, and access university services -
              all from your mobile device.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#1B1B1B] text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Logo column - make it smaller */}
            <div className="mb-0">
              <Image src={logoVerticalBlanco} alt="Logo UFPS" width={112} height={128} className="rounded-md" />
            </div>
            
            {/* Portales Institucionales */}
            <div className="col-span-1">
              <h2 className="text-lg font-medium mb-2 pb-2 border-b border-ufps-red">Portales Institucionales</h2>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Divisist
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Pagos de Egresados y Externos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Piagev
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    PDQRS
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    DatarSoft
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Sistema de Nómina
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    DISERACA
                  </a>
                </li>
              </ul>
            </div>

            {/* Enlaces de Interés */}
            <div className="col-span-1">
              <h2 className="text-lg font-medium mb-2 pb-2 border-b border-ufps-red">Enlaces de Interés</h2>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Plan Anticorrupción
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Proceso de selección
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Contratación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Proceso democrático
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Derechos pecuniarios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Correo Electrónico Institucional
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Consultorio Jurídico
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Consultorio Técnico Minero
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ufps-red transition-colors">
                    Centro de Conciliación
                  </a>
                </li>
              </ul>
            </div>

            {/* Contactos */}
            <div className="col-span-1">
              <h2 className="text-lg font-medium mb-2 pb-2 border-b border-ufps-red">Contactos</h2>
              <div className="space-y-3">
                <div>
                  <p>Avenida Gran Colombia No. 12E-96 Barrio Colsag,</p>
                  <p>San José de Cúcuta - Colombia</p>
                  <p>Teléfono (057)(7) 5776655</p>
                </div>

                <div>
                  <p className="font-medium">Solicitudes y correspondencia</p>
                  <p>Unidad de Gestión Documental</p>
                  <a href="mailto:ugad@ufps.edu.co" className="text-ufps-red hover:underline">
                    ugad@ufps.edu.co
                  </a>
                </div>

                <div>
                  <p className="font-medium">Uso único y exclusivo para notificaciones judiciales:</p>
                  <a href="mailto:notificacionesjudiciales@ufps.edu.co" className="text-ufps-red hover:underline">
                    notificacionesjudiciales@ufps.edu.co
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} All Rights Reserved. Desarrollado por: VAVM - División de Sistemas</p>
          </div>
        </div>
      </footer>
    </div>
  )
}