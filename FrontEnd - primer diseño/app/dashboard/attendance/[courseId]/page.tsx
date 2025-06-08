"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Download, CheckCircle, XCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock data for the attendance details
const courseData = {
  "software-eng-20250304": {
    name: "Ingeniería de Software",
    date: "4 de Marzo, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Salón A-301",
    totalStudents: 25,
    attendedStudents: 23,
    students: [
      { id: "1151001", name: "Ana María Rodríguez", attended: true },
      { id: "1151002", name: "Carlos Andrés Pérez", attended: true },
      { id: "1151003", name: "Diana Carolina Gómez", attended: true },
      { id: "1151004", name: "Eduardo José Martínez", attended: true },
      { id: "1151005", name: "Fernanda Lucía Sánchez", attended: true },
      { id: "1151006", name: "Gabriel Antonio Díaz", attended: true },
      { id: "1151007", name: "Helena Isabel Torres", attended: true },
      { id: "1151008", name: "Iván Camilo Vargas", attended: true },
      { id: "1151009", name: "Juliana Andrea Morales", attended: true },
      { id: "1151010", name: "Kevin Alejandro Rojas", attended: true },
      { id: "1151011", name: "Laura Valentina Castro", attended: true },
      { id: "1151012", name: "Manuel Sebastián Ortiz", attended: true },
      { id: "1151013", name: "Natalia Sofía Herrera", attended: true },
      { id: "1151014", name: "Oscar David Jiménez", attended: true },
      { id: "1151015", name: "Paola Cristina Mendoza", attended: true },
      { id: "1151016", name: "Quintín Esteban Navarro", attended: true },
      { id: "1151017", name: "Rosa Angélica Duarte", attended: true },
      { id: "1151018", name: "Santiago José Acosta", attended: true },
      { id: "1151019", name: "Tatiana Marcela Pineda", attended: true },
      { id: "1151020", name: "Ulises Ernesto Quintero", attended: true },
      { id: "1151021", name: "Valeria Camila Rincón", attended: true },
      { id: "1151022", name: "William Andrés Parra", attended: true },
      { id: "1151023", name: "Ximena Lucía Cárdenas", attended: true },
      { id: "1151024", name: "Yesid Mauricio Ochoa", attended: false },
      { id: "1151025", name: "Zulma Patricia Figueroa", attended: false },
    ],
  },
  "database-sys-20250303": {
    name: "Sistemas de Bases de Datos",
    date: "3 de Marzo, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Salón B-205",
    totalStudents: 18,
    attendedStudents: 17,
    students: [
      { id: "1151026", name: "Alejandro Martín Vega", attended: true },
      { id: "1151027", name: "Beatriz Elena Suárez", attended: true },
      { id: "1151028", name: "Camilo José Ramírez", attended: true },
      { id: "1151029", name: "Daniela Fernanda López", attended: true },
      { id: "1151030", name: "Esteban David Gutiérrez", attended: true },
      { id: "1151031", name: "Fabiola Andrea Medina", attended: true },
      { id: "1151032", name: "Gustavo Adolfo Reyes", attended: true },
      { id: "1151033", name: "Hilda Margarita Chávez", attended: true },
      { id: "1151034", name: "Ignacio Alberto Varela", attended: true },
      { id: "1151035", name: "Johana Patricia Montes", attended: true },
      { id: "1151036", name: "Karla Daniela Osorio", attended: true },
      { id: "1151037", name: "Leonardo Fabio Quiroz", attended: true },
      { id: "1151038", name: "Mónica Alejandra Soto", attended: true },
      { id: "1151039", name: "Néstor Iván Delgado", attended: true },
      { id: "1151040", name: "Olga Lucía Bermúdez", attended: true },
      { id: "1151041", name: "Pedro Antonio Galvis", attended: true },
      { id: "1151042", name: "Quetzalli María Robles", attended: true },
      { id: "1151043", name: "Raúl Ernesto Villegas", attended: false },
    ],
  },
  "prog-fund-20250302": {
    name: "Fundamentos de Programación",
    date: "2 de Marzo, 2025",
    time: "8:00 AM - 10:00 AM",
    location: "Laboratorio C-103",
    totalStudents: 30,
    attendedStudents: 28,
    students: [
      { id: "1151044", name: "Adriana Marcela Pinto", attended: true },
      { id: "1151045", name: "Bernardo José Cuellar", attended: true },
      { id: "1151046", name: "Catalina Isabel Duque", attended: true },
      { id: "1151047", name: "David Santiago Arango", attended: true },
      { id: "1151048", name: "Esmeralda Lucía Pardo", attended: true },
      { id: "1151049", name: "Felipe Andrés Molina", attended: true },
      { id: "1151050", name: "Gloria Patricia Henao", attended: true },
      { id: "1151051", name: "Héctor Manuel Zapata", attended: true },
      { id: "1151052", name: "Irene Sofía Jaramillo", attended: true },
      { id: "1151053", name: "Jaime Alberto Correa", attended: true },
      { id: "1151054", name: "Karen Daniela Ospina", attended: true },
      { id: "1151055", name: "Luis Fernando Mejía", attended: true },
      { id: "1151056", name: "Mariana Andrea Botero", attended: true },
      { id: "1151057", name: "Nicolás Esteban Vélez", attended: true },
      { id: "1151058", name: "Olga Marina Castaño", attended: true },
      { id: "1151059", name: "Pablo Emilio Salazar", attended: true },
      { id: "1151060", name: "Quiteria Rosa Montoya", attended: true },
      { id: "1151061", name: "Ricardo José Hoyos", attended: true },
      { id: "1151062", name: "Sandra Milena Giraldo", attended: true },
      { id: "1151063", name: "Tomás Alejandro Ríos", attended: true },
      { id: "1151064", name: "Úrsula Camila Orozco", attended: true },
      { id: "1151065", name: "Vicente Javier Agudelo", attended: true },
      { id: "1151066", name: "Wendy Carolina Toro", attended: true },
      { id: "1151067", name: "Xavier Andrés Londoño", attended: true },
      { id: "1151068", name: "Yolanda Patricia Gallo", attended: true },
      { id: "1151069", name: "Zacarías Ernesto Muñoz", attended: true },
      { id: "1151070", name: "Amelia Sofía Cardona", attended: true },
      { id: "1151071", name: "Bruno Alejandro Palacio", attended: true },
      { id: "1151072", name: "Cecilia Andrea Velasco", attended: false },
      { id: "1151073", name: "Darío Javier Zuluaga", attended: false },
    ],
  },
}

export default function AttendanceDetailsPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const course = courseData[courseId as keyof typeof courseData]

  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Curso no encontrado</h1>
        <p className="mb-6">No se pudo encontrar información para el curso solicitado.</p>
        <Link href="/dashboard/attendance">
          <Button className="bg-black hover:bg-black/90">
            <ArrowLeft size={16} className="mr-2" />
            Volver a Asistencias
          </Button>
        </Link>
      </div>
    )
  }

  // Filter students based on search term and attendance filter
  const filteredStudents = course.students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.id.includes(searchTerm)

    if (filter === "all") return matchesSearch
    if (filter === "attended") return matchesSearch && student.attended
    if (filter === "absent") return matchesSearch && !student.attended

    return matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/attendance">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-black">Detalles de Asistencia</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{course.name}</CardTitle>
          <CardDescription>Información detallada de la sesión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-ufps-red" />
                <span>{course.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-ufps-red" />
                <span>{course.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-ufps-red" />
                <span>{course.location}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total de Estudiantes:</span>
                <span>{course.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Estudiantes Presentes:</span>
                <span className="text-green-600">{course.attendedStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Estudiantes Ausentes:</span>
                <span className="text-ufps-red">{course.totalStudents - course.attendedStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Porcentaje de Asistencia:</span>
                <span>{Math.round((course.attendedStudents / course.totalStudents) * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Exportar Reporte</span>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>
            {course.attendedStudents} de {course.totalStudents} estudiantes asistieron a esta clase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nombre o código"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
              <TabsList className="grid grid-cols-3 w-full md:w-[300px]">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="attended">Presentes</TabsTrigger>
                <TabsTrigger value="absent">Ausentes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-3 font-medium bg-gray-50 border-b">
              <div className="col-span-2">Código</div>
              <div className="col-span-8">Nombre</div>
              <div className="col-span-2 text-center">Estado</div>
            </div>

            <div className="divide-y">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div key={student.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                    <div className="col-span-2 text-sm">{student.id}</div>
                    <div className="col-span-8">{student.name}</div>
                    <div className="col-span-2 flex justify-center">
                      {student.attended ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Presente
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-ufps-red hover:bg-red-50 border-red-200">
                          <XCircle size={14} className="mr-1" />
                          Ausente
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron estudiantes que coincidan con la búsqueda
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {filteredStudents.length} de {course.students.length} estudiantes
          </div>
          <Button className="bg-black hover:bg-black/90">
            <Download size={16} className="mr-2" />
            Descargar Lista
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

