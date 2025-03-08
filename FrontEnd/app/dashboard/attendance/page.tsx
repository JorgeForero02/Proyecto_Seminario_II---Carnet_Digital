"use client"

import type React from "react"

import { useState } from "react"
import { QrCode, Plus, Calendar, Clock, Users, CheckCircle2 } from "lucide-react"
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

export default function AttendancePage() {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#004A87]">Attendance Management</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#004A87] hover:bg-[#003a6d]">
              <Plus size={16} className="mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>Enter the details for the new class or advisory session.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateClass}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="class-name">Class Name</Label>
                  <Input id="class-name" placeholder="e.g. Software Engineering" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. Room A-301" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" placeholder="Brief description of the class" />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-[#004A87] hover:bg-[#003a6d]">
                  Create Class
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="professor">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="professor">Professor View</TabsTrigger>
          <TabsTrigger value="student">Student View</TabsTrigger>
        </TabsList>

        <TabsContent value="professor" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Software Engineering</CardTitle>
                <CardDescription>Today, 10:00 AM - 12:00 PM</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Monday, March 6, 2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-500" />
                  <span>25 students registered</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleShowQr("Software Engineering")}>
                  <QrCode size={16} className="mr-2" />
                  Show QR Code
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Database Systems</CardTitle>
                <CardDescription>Today, 2:00 PM - 4:00 PM</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Monday, March 6, 2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-500" />
                  <span>18 students registered</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleShowQr("Database Systems")}>
                  <QrCode size={16} className="mr-2" />
                  Show QR Code
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Recent classes and attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Software Engineering</h3>
                    <p className="text-sm text-gray-500">March 4, 2025</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">23/25</span> students attended
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Database Systems</h3>
                    <p className="text-sm text-gray-500">March 3, 2025</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">17/18</span> students attended
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Programming Fundamentals</h3>
                    <p className="text-sm text-gray-500">March 2, 2025</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">28/30</span> students attended
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Registered Classes</CardTitle>
              <CardDescription>Classes you are currently registered for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Software Engineering</h3>
                    <p className="text-sm text-gray-500">Monday, 10:00 AM - 12:00 PM</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 size={16} />
                    <span>Registered</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Database Systems</h3>
                    <p className="text-sm text-gray-500">Monday, 2:00 PM - 4:00 PM</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 size={16} />
                    <span>Registered</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h3 className="font-medium">Programming Fundamentals</h3>
                    <p className="text-sm text-gray-500">Tuesday, 8:00 AM - 10:00 AM</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 size={16} />
                    <span>Registered</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Scan a QR code to register for a class or advisory</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-gray-100 p-8 rounded-lg mb-4 w-full max-w-xs flex items-center justify-center">
                <QrCode size={120} className="text-gray-400" />
              </div>
              <p className="text-center text-sm text-gray-500">
                Point your camera at a QR code provided by your professor to register for a class or advisory session
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#E30613] hover:bg-[#c00510]">Scan QR Code</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass}</DialogTitle>
            <DialogDescription>Students can scan this QR code to register for this class</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 border border-gray-200 rounded-lg mb-4">
              <QrCode size={200} className="text-[#004A87]" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Monday, March 6, 2025</p>
              <p className="text-sm">10:00 AM - 12:00 PM</p>
              <p className="text-sm">Room A-301</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQrCode(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

