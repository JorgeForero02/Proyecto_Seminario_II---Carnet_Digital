"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  QrCode,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Eye,
  BookOpen,
  UserCheck,
  UsersIcon,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Mock data for student attendance history
const studentAttendanceData = {
  courses: [
    {
      id: "course-1",
      name: "Ingeniería de Software",
      date: "4 de Marzo, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Salón A-301",
      professor: "Dr. Carlos Rodríguez",
      status: "present",
    },
    {
      id: "course-2",
      name: "Sistemas de Bases de Datos",
      date: "3 de Marzo, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Salón B-205",
      professor: "Dra. María González",
      status: "present",
    },
    {
      id: "course-3",
      name: "Fundamentos de Programación",
      date: "2 de Marzo, 2025",
      time: "8:00 AM - 10:00 AM",
      location: "Laboratorio C-103",
      professor: "Dr. Javier Pérez",
      status: "present",
    },
    {
      id: "course-4",
      name: "Ingeniería de Software",
      date: "25 de Febrero, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Salón A-301",
      professor: "Dr. Carlos Rodríguez",
      status: "absent",
    },
  ],
  counseling: [
    {
      id: "counseling-1",
      name: "Asesoría de Proyecto de Grado",
      date: "1 de Marzo, 2025",
      time: "3:00 PM - 4:00 PM",
      location: "Oficina D-210",
      professor: "Dr. Andrés Martínez",
      status: "present",
    },
    {
      id: "counseling-2",
      name: "Asesoría de Matemáticas",
      date: "27 de Febrero, 2025",
      time: "11:00 AM - 12:00 PM",
      location: "Sala de Estudio",
      professor: "Dra. Laura Sánchez",
      status: "present",
    },
  ],
  academicFriend: [
    {
      id: "friend-1",
      name: "Tutoría de Cálculo",
      date: "28 de Febrero, 2025",
      time: "4:00 PM - 5:30 PM",
      location: "Biblioteca",
      tutor: "Ana María Gómez",
      status: "present",
    },
    {
      id: "friend-2",
      name: "Tutoría de Física",
      date: "26 de Febrero, 2025",
      time: "2:00 PM - 3:30 PM",
      location: "Laboratorio F-105",
      tutor: "Juan Carlos Vargas",
      status: "present",
    },
    {
      id: "friend-3",
      name: "Tutoría de Programación",
      date: "24 de Febrero, 2025",
      time: "10:00 AM - 11:30 AM",
      location: "Sala de Cómputo",
      tutor: "Pedro Ramírez",
      status: "absent",
    },
  ],
}

export default function AttendancePage() {
  const router = useRouter()
  const [showQrCode, setShowQrCode] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle class creation logic
    setShowQrCode(false)
  }

  const handleShowQr = (className: string) => {
    setSelectedClass(className)
    setShowQrCode(true)
  }

  const handleViewDetails = (courseId: string) => {
    router.push(`/dashboard/attendance/${courseId}`)
  }

  const handleViewStudentDetails = (attendanceType: string, attendanceId: string) => {
    router.push(`/dashboard/attendance/student/${attendanceType}/${attendanceId}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Gestión de Asistencias</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-black/90">
              <Plus size={16} className="mr-2" />
              Crear Clase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Clase</DialogTitle>
              <DialogDescription>Ingresa los detalles para la nueva clase o sesión de asesoría.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateClass}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="class-name">Nombre de la Clase</Label>
                  <Input id="class-name" placeholder="ej. Ingeniería de Software" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input id="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input id="time" type="time" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" placeholder="ej. Salón A-301" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Input id="description" placeholder="Breve descripción de la clase" />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-black hover:bg-black/90">
                  Crear Clase
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="professor">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="professor">Vista de Profesor</TabsTrigger>
          <TabsTrigger value="student">Vista de Estudiante</TabsTrigger>
        </TabsList>

        <TabsContent value="professor" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Ingeniería de Software</CardTitle>
                <CardDescription>Hoy, 10:00 AM - 12:00 PM</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Lunes, 6 de Marzo, 2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-500" />
                  <span>25 estudiantes registrados</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleShowQr("Ingeniería de Software")}>
                  <QrCode size={16} className="mr-2" />
                  Mostrar Código QR
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sistemas de Bases de Datos</CardTitle>
                <CardDescription>Hoy, 2:00 PM - 4:00 PM</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Lunes, 6 de Marzo, 2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-500" />
                  <span>18 estudiantes registrados</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleShowQr("Sistemas de Bases de Datos")}>
                  <QrCode size={16} className="mr-2" />
                  Mostrar Código QR
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Asistencias</CardTitle>
              <CardDescription>Clases recientes y registros de asistencia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Ingeniería de Software</h3>
                    <p className="text-sm text-gray-500">4 de Marzo, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">23/25</span> estudiantes asistieron
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-ufps-red"
                      onClick={() => handleViewDetails("software-eng-20250304")}
                    >
                      <Eye size={14} />
                      <span>Ver Detalles</span>
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Sistemas de Bases de Datos</h3>
                    <p className="text-sm text-gray-500">3 de Marzo, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">17/18</span> estudiantes asistieron
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-ufps-red"
                      onClick={() => handleViewDetails("database-sys-20250303")}
                    >
                      <Eye size={14} />
                      <span>Ver Detalles</span>
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Fundamentos de Programación</h3>
                    <p className="text-sm text-gray-500">2 de Marzo, 2025</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">28/30</span> estudiantes asistieron
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-ufps-red"
                      onClick={() => handleViewDetails("prog-fund-20250302")}
                    >
                      <Eye size={14} />
                      <span>Ver Detalles</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tus Clases Registradas</CardTitle>
                <CardDescription>Clases en las que estás actualmente registrado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <h3 className="font-medium">Ingeniería de Software</h3>
                      <p className="text-sm text-gray-500">Lunes, 10:00 AM - 12:00 PM</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle2 size={16} />
                      <span>Registrado</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <h3 className="font-medium">Sistemas de Bases de Datos</h3>
                      <p className="text-sm text-gray-500">Lunes, 2:00 PM - 4:00 PM</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle2 size={16} />
                      <span>Registrado</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <h3 className="font-medium">Fundamentos de Programación</h3>
                      <p className="text-sm text-gray-500">Martes, 8:00 AM - 10:00 AM</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle2 size={16} />
                      <span>Registrado</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Escanear Código QR</CardTitle>
                <CardDescription>Escanea un código QR para registrarte en una clase o asesoría</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="bg-gray-100 p-8 rounded-lg mb-4 w-full max-w-xs flex items-center justify-center">
                  <QrCode size={120} className="text-gray-400" />
                </div>
                <p className="text-center text-sm text-gray-500">
                  Apunta tu cámara al código QR proporcionado por tu profesor para registrarte en una clase o sesión de
                  asesoría
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-ufps-red hover:bg-ufps-red/90">Escanear Código QR</Button>
              </CardFooter>
            </Card>
          </div>

          {/* New Attendance History Section */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Asistencias</CardTitle>
              <CardDescription>Registro de todas tus asistencias</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="courses">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="courses" className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>Clases</span>
                  </TabsTrigger>
                  <TabsTrigger value="counseling" className="flex items-center gap-1">
                    <UserCheck size={16} />
                    <span>Asesorías</span>
                  </TabsTrigger>
                  <TabsTrigger value="academicFriend" className="flex items-center gap-1">
                    <UsersIcon size={16} />
                    <span>Amigo Académico</span>
                  </TabsTrigger>
                </TabsList>

                {/* Courses Tab */}
                <TabsContent value="courses">
                  <div className="space-y-3">
                    {studentAttendanceData.courses.map((course) => (
                      <div key={course.id} className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{course.name}</h3>
                            <p className="text-sm text-gray-500">Profesor: {course.professor}</p>
                          </div>
                          {course.status === "present" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Presente</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ausente</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-500" />
                            <span>{course.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-500" />
                            <span>{course.time}</span>
                          </div>
                          <div className="flex items-center gap-1 col-span-2">
                            <MapPin size={14} className="text-gray-500" />
                            <span>{course.location}</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-ufps-red"
                            onClick={() => handleViewStudentDetails("courses", course.id)}
                          >
                            <span>Ver Detalles</span>
                            <ChevronRight size={14} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Counseling Tab */}
                <TabsContent value="counseling">
                  <div className="space-y-3">
                    {studentAttendanceData.counseling.map((session) => (
                      <div key={session.id} className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{session.name}</h3>
                            <p className="text-sm text-gray-500">Profesor: {session.professor}</p>
                          </div>
                          {session.status === "present" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Presente</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ausente</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-500" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-500" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1 col-span-2">
                            <MapPin size={14} className="text-gray-500" />
                            <span>{session.location}</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-ufps-red"
                            onClick={() => handleViewStudentDetails("counseling", session.id)}
                          >
                            <span>Ver Detalles</span>
                            <ChevronRight size={14} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Academic Friend Tab */}
                <TabsContent value="academicFriend">
                  <div className="space-y-3">
                    {studentAttendanceData.academicFriend.map((session) => (
                      <div key={session.id} className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{session.name}</h3>
                            <p className="text-sm text-gray-500">Tutor: {session.tutor}</p>
                          </div>
                          {session.status === "present" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Presente</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ausente</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-500" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-500" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1 col-span-2">
                            <MapPin size={14} className="text-gray-500" />
                            <span>{session.location}</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-ufps-red"
                            onClick={() => handleViewStudentDetails("academicFriend", session.id)}
                          >
                            <span>Ver Detalles</span>
                            <ChevronRight size={14} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass}</DialogTitle>
            <DialogDescription>
              Los estudiantes pueden escanear este código QR para registrarse en esta clase
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 border border-gray-200 rounded-lg mb-4">
              <QrCode size={200} className="text-black" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Lunes, 6 de Marzo, 2025</p>
              <p className="text-sm">10:00 AM - 12:00 PM</p>
              <p className="text-sm">Salón A-301</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQrCode(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

