"use client"

import type React from "react"

import { useState } from "react"
import { User, Camera, Mail, Phone, MapPin, Pencil, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#004A87]">Profile</h1>

        <Button
          onClick={() => setEditing(!editing)}
          variant={editing ? "default" : "outline"}
          className={editing ? "bg-[#004A87] hover:bg-[#003a6d]" : ""}
        >
          {editing ? (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil size={16} className="mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>

                {editing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 h-8 w-8 bg-[#004A87] rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Camera size={16} className="text-white" />
                    <input
                      type="file"
                      id="profile-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div className="text-center">
                <h3 className="font-bold">Juan Perez</h3>
                <p className="text-sm text-gray-500">Systems Engineering</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="academic">Academic Info</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      {editing ? (
                        <Input id="first-name" defaultValue="Juan" />
                      ) : (
                        <div className="p-2 border rounded-md bg-gray-50">Juan</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      {editing ? (
                        <Input id="last-name" defaultValue="Perez" />
                      ) : (
                        <div className="p-2 border rounded-md bg-gray-50">Perez</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      {editing ? (
                        <Input id="email" defaultValue="juan.perez@ufps.edu.co" />
                      ) : (
                        <div className="p-2 border rounded-md bg-gray-50 w-full flex items-center gap-2">
                          <Mail size={16} className="text-gray-500" />
                          <span>juan.perez@ufps.edu.co</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      {editing ? (
                        <Input id="phone" defaultValue="+57 315 123 4567" />
                      ) : (
                        <div className="p-2 border rounded-md bg-gray-50 w-full flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          <span>+57 315 123 4567</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="flex items-center gap-2">
                      {editing ? (
                        <Input id="address" defaultValue="Calle 10 #12-34, Cúcuta" />
                      ) : (
                        <div className="p-2 border rounded-md bg-gray-50 w-full flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>Calle 10 #12-34, Cúcuta</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Your academic details and progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Student ID</Label>
                      <div className="p-2 border rounded-md bg-gray-50">1151234567</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Program</Label>
                      <div className="p-2 border rounded-md bg-gray-50">Systems Engineering</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Semester</Label>
                      <div className="p-2 border rounded-md bg-gray-50">6</div>
                    </div>
                    <div className="space-y-2">
                      <Label>GPA</Label>
                      <div className="p-2 border rounded-md bg-gray-50">4.2/5.0</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Credits Completed</Label>
                    <div className="p-2 border rounded-md bg-gray-50">96/160</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Academic Status</Label>
                    <div className="p-2 border rounded-md bg-gray-50 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

