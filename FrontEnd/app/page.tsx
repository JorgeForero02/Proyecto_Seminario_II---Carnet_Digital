import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#004A87] text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">UFPS Digital Card</h1>
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
          <h1 className="text-4xl font-bold text-[#004A87] mb-6">Welcome to UFPS Digital Card</h1>
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
              <h2 className="text-2xl font-bold text-[#004A87] mb-4">For Professors</h2>
              <ul className="text-left space-y-2 mb-6">
                <li>• Create and manage classes</li>
                <li>• Generate QR codes for attendance</li>
                <li>• Track student participation</li>
                <li>• Manage advisory sessions</li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-[#004A87] hover:bg-[#003a6d]">Professor Login</Button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-[#004A87] mb-4">About the Platform</h2>
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

      <footer className="bg-[#004A87] text-white py-6 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold">UFPS Digital Card</h2>
              <p className="text-sm">Systems Engineering Program</p>
            </div>
            <div className="text-sm">© {new Date().getFullYear()} Francisco de Paula Santander University</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

