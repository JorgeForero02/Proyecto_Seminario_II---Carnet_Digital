"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  Download,
  BookOpen,
  UserCheck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for student attendance details
const studentAttendanceData = {
  courses: {
    "course-1": {
      id: "course-1",
      name: "Ingeniería de Software",
      date: "4 de Marzo, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Salón A-301",
      professor: "Dr. Carlos Rodríguez",
      status: "present",
      topic: "Metodologías Ágiles - Scrum",
      notes: "Clase sobre los principios de Scrum y roles en equipos ágiles.",
      materials: ["Presentación de Scrum", "Ejemplos de Historias de Usuario"],
      checkInTime: "9:55 AM",
      duration: "2 horas",
      nextClass: "11 de Marzo, 2025",
    },
    "course-2": {
      id: "course-2",
      name: "Sistemas de Bases de Datos",
      date: "3 de Marzo, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Salón B-205",
      professor: "Dra. María González",
      status: "present",
      topic: "Normalización de Bases de Datos",
      notes: "Clase sobre formas normales y diseño de esquemas relacionales.",
      materials: ["Ejercicios de Normalización", "Diagrama ER"],
      checkInTime: "1:50 PM",
      duration: "2 horas",
      nextClass: "10 de Marzo, 2025",
    },
    "course-3": {
      id: "course-3",
      name: "Fundamentos de Programación",
      date: "2 de Marzo, 2025",
      time: "8:00 AM - 10:00 AM",
      location: "Laboratorio C-103",
      professor: "Dr. Javier Pérez",
      status: "present",
      topic: "Estructuras de Control",
      notes: "Clase práctica sobre bucles y condicionales en Java.",
      materials: ["Ejercicios de Programación", "Código de Ejemplo"],
      checkInTime: "7:50 AM",
      duration: "2 horas",
      nextClass: "9 de Marzo, 2025",
    },
    "course-4": {
      id: "course-4",
      name: "Ingeniería de Software",
      date: "25 de Febrero, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Salón A-301",
      professor: "Dr. Carlos Rodríguez",
      status: "absent",
      topic: "Requisitos de Software",
      notes: "Clase sobre técnicas de elicitación de requisitos.",
      materials: ["Plantilla de Requisitos", "Casos de Estudio"],
      checkInTime: "No registrado",
      duration: "2 horas",
      nextClass: "4 de Marzo, 2025",
      absenceReason: "Justificada - Cita médica",
    },
  },
  counseling: {
    "counseling-1": {
      id: "counseling-1",
      name: "Asesoría de Proyecto de Grado",
      date: "1 de Marzo, 2025",
      time: "3:00 PM - 4:00 PM",
      location: "Oficina D-210",
      professor: "Dr. Andrés Martínez",
      status: "present",
      topic: "Revisión de Metodología",
      notes: "Revisión del capítulo de metodología y ajustes al cronograma.",
      checkInTime: "2:55 PM",
      duration: "1 hora",
      nextSession: "15 de Marzo, 2025",
      progress: "70% completado",
      feedback: "Buen avance en la metodología. Necesita más detalle en la justificación.",
    },
    "counseling-2": {
      id: "counseling-2",
      name: "Asesoría de Matemáticas",
      date: "27 de Febrero, 2025",
      time: "11:00 AM - 12:00 PM",
      location: "Sala de Estudio",
      professor: "Dra. Laura Sánchez",
      status: "present",
      topic: "Ecuaciones Diferenciales",
      notes: "Resolución de ejercicios de ecuaciones diferenciales de primer orden.",
      checkInTime: "10:55 AM",
      duration: "1 hora",
      nextSession: "6 de Marzo, 2025",
      progress: "Mejorando",
      feedback: "Buen manejo de conceptos básicos. Necesita practicar más con problemas complejos.",
    },
  },
  academicFriend: {
    "friend-1": {
      id: "friend-1",
      name: "Tutoría de Cálculo",
      date: "28 de Febrero, 2025",
      time: "4:00 PM - 5:30 PM",
      location: "Biblioteca",
      tutor: "Ana María Gómez",
      status: "present",
      topic: "Integrales Definidas",
      notes: "Resolución de ejercicios de aplicación de integrales definidas.",
      checkInTime: "3:55 PM",
      duration: "1.5 horas",
      nextSession: "7 de Marzo, 2025",
      progress: "Mejorando",
      feedback: "Buen entendimiento de conceptos. Necesita más práctica con técnicas de integración.",
    },
    "friend-2": {
      id: "friend-2",
      name: "Tutoría de Física",
      date: "26 de Febrero, 2025",
      time: "2:00 PM - 3:30 PM",
      location: "Laboratorio F-105",
      tutor: "Juan Carlos Vargas",
      status: "present",
      topic: "Dinámica de Partículas",
      notes: "Resolución de problemas de dinámica y leyes de Newton.",
      checkInTime: "1:55 PM",
      duration: "1.5 horas",
      nextSession: "5 de Marzo, 2025",
      progress: "Bueno",
      feedback: "Buen manejo de conceptos físicos. Mejorar en la aplicación matemática.",
    },
    "friend-3": {
      id: "friend-3",
      name: "Tutoría de Programación",
      date: "24 de Febrero, 2025",
      time: "10:00 AM - 11:30 AM",
      location: "Sala de Cómputo",
      tutor: "Pedro Ramírez",
      status: "absent",
      topic: "Estructuras de Datos",
      notes: "Sesión sobre listas enlazadas y árboles binarios.",
      checkInTime: "No registrado",
      duration: "1.5 horas",
      nextSession: "3 de Marzo, 2025",
      progress: "Necesita refuerzo",
      absenceReason: "No justificada",
    },
  },
}

export default function StudentAttendanceDetailsPage() {
  const params = useParams()
  const type = params.type as string
  const id = params.id as string

  const [attendanceData, setAttendanceData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would be an API call
    if (type && id) {
      const data = studentAttendanceData[type as keyof typeof studentAttendanceData]?.[id]
      setAttendanceData(data)
    }
  }, [type, id])

  if (!attendanceData) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Registro no encontrado</h1>
        <p className="mb-6">No se pudo encontrar información para la asistencia solicitada.</p>
        <Link href="/dashboard/attendance">
          <Button className="bg-black hover:bg-black/90">
            <ArrowLeft size={16} className="mr-2" />
            Volver a Asistencias
          </Button>
        </Link>
      </div>
    )
  }

  // Get the appropriate icon based on attendance type
  const getTypeIcon = () => {
    switch (type) {
      case "courses":
        return <BookOpen size={20} className="text-ufps-red" />
      case "counseling":
        return <UserCheck size={20} className="text-ufps-red" />
      case "academicFriend":
        return <Users size={20} className="text-ufps-red" />
      default:
        return <Calendar size={20} className="text-ufps-red" />
    }
  }

  // Get the appropriate title based on attendance type
  const getTypeTitle = () => {
    switch (type) {
      case "courses":
        return "Clase"
      case "counseling":
        return "Asesoría"
      case "academicFriend":
        return "Amigo Académico"
      default:
        return "Asistencia"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/attendance">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {getTypeIcon()}
          <h1 className="text-2xl font-bold text-black">Detalles de {getTypeTitle()}</h1>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{attendanceData.name}</CardTitle>
              <CardDescription>
                {type === "courses"
                  ? `Profesor: ${attendanceData.professor}`
                  : type === "counseling"
                    ? `Profesor: ${attendanceData.professor}`
                    : `Tutor: ${attendanceData.tutor}`}
              </CardDescription>
            </div>
            {attendanceData.status === "present" ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Presente</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ausente</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Información General</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-ufps-red" />
                    <span>{attendanceData.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-ufps-red" />
                    <span>{attendanceData.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-ufps-red" />
                    <span>{attendanceData.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles de Asistencia</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Hora de registro:</span>
                    <span className="font-medium">{attendanceData.checkInTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duración:</span>
                    <span className="font-medium">{attendanceData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tema:</span>
                    <span className="font-medium">{attendanceData.topic}</span>
                  </div>
                  {attendanceData.status === "absent" && (
                    <div className="flex items-center justify-between">
                      <span>Razón de ausencia:</span>
                      <span className="font-medium">{attendanceData.absenceReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-md border">{attendanceData.notes}</p>
              </div>

              {attendanceData.materials && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Materiales</h3>
                  <ul className="space-y-1">
                    {attendanceData.materials.map((material: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <FileText size={14} className="text-gray-500" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(type === "counseling" || type === "academicFriend") && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Retroalimentación</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded-md border">{attendanceData.feedback}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Próxima Sesión</h3>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>{attendanceData.nextClass || attendanceData.nextSession}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {attendanceData.status === "present" ? (
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-600" />
                <span>Asistencia registrada correctamente</span>
              </div>
            ) : (
              <div className="text-ufps-red">Ausencia registrada</div>
            )}
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Descargar Comprobante</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

