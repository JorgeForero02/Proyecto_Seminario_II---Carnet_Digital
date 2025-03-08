"use client"

import type React from "react"

import { useState } from "react"
import { QrCode, Info, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Dashboard() {
  const [isActive, setIsActive] = useState(true)
  const [showQrInfo, setShowQrInfo] = useState(false)
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Carné Digital</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{isActive ? "Activo" : "Inactivo"}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsActive(!isActive)} className="p-0">
            {isActive ? (
              <ToggleRight size={28} className="text-ufps-red" />
            ) : (
              <ToggleLeft size={28} className="text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      {isActive && (
        <div className="flex flex-col items-center mb-6">
          <Button variant="outline" onClick={() => setFlipped(!flipped)} className="mb-4">
            {flipped ? "Ver Frente" : "Ver Reverso"}
          </Button>

          <div className="relative w-full max-w-[320px] transition-all duration-500 perspective">
            <div className={`relative w-full transition-all duration-500 ${flipped ? "rotate-y-180" : ""}`}>
              {!flipped ? (
                // Front of card
                <Card className="overflow-hidden border-0 shadow-lg rounded-lg">
                  <CardContent className="p-0">
                    <div className="relative bg-white">
                      {/* Red shapes - top left */}
                      <div className="absolute top-0 left-0 w-24 h-24">
                        <div className="absolute top-0 left-0 w-16 h-16 bg-ufps-red rounded-br-[100%]"></div>
                      </div>

                      {/* Red shapes - bottom right */}
                      <div className="absolute bottom-0 right-0 w-24 h-24">
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-ufps-red rounded-tl-[100%]"></div>
                      </div>

                      {/* Red dots */}
                      <div className="absolute top-1/3 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>
                      <div className="absolute top-1/2 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>
                      <div className="absolute bottom-1/3 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>

                      {/* Header with logo */}
                      <div className="pt-4 px-4 flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="bg-ufps-red text-white text-xs p-1 mr-1">UFPS</div>
                          <div className="text-xs leading-tight">
                            <div>Universidad Francisco</div>
                            <div>de Paula Santander</div>
                          </div>
                        </div>
                      </div>

                      {/* Photo and info */}
                      <div className="p-4 pt-8">
                        <div className="flex gap-4">
                          <div className="h-32 w-28 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                            <User size={64} className="text-gray-400" />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-lg">Juan Perez</h3>
                              <h4 className="font-bold text-lg">Castillo Lopez</h4>
                            </div>

                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">C.C.:</span> 1151234567
                              </p>
                              <p>
                                <span className="font-medium">Código:</span> 1331007
                              </p>
                              <p>
                                <span className="font-medium">GS RH:</span> A+
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Role badge */}
                        <div className="mt-4 bg-ufps-red text-white text-center py-1 rounded-md font-medium">
                          Estudiante
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Back of card
                <Card className="overflow-hidden border-0 shadow-lg rounded-lg rotate-y-180">
                  <CardContent className="p-0">
                    <div className="relative bg-white min-h-[400px]">
                      {/* Red shapes - top left */}
                      <div className="absolute top-0 left-0 w-24 h-24">
                        <div className="absolute top-0 left-0 w-16 h-16 bg-ufps-red rounded-br-[100%]"></div>
                      </div>

                      {/* Red shapes - bottom right */}
                      <div className="absolute bottom-0 right-0 w-24 h-24">
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-ufps-red rounded-tl-[100%]"></div>
                      </div>

                      {/* Red dots */}
                      <div className="absolute top-1/3 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>
                      <div className="absolute top-1/2 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>
                      <div className="absolute bottom-1/3 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>

                      {/* Header with logo */}
                      <div className="pt-4 px-4 flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="bg-ufps-red text-white text-xs p-1 mr-1">UFPS</div>
                          <div className="text-xs leading-tight">
                            <div>Universidad Francisco</div>
                            <div>de Paula Santander</div>
                          </div>
                        </div>
                      </div>

                      {/* Card information text */}
                      <div className="p-6 pt-10 text-xs">
                        <p className="mb-4">
                          Este carné es personal e intransferible.
                          <br />
                          Su uso indebido acarrea la pérdida de derechos y servicios.
                        </p>
                        <p>
                          En caso de extravío, por favor devolver a la Oficina de
                          <br />
                          Bienestar Universitario.
                        </p>
                      </div>

                      {/* QR Code */}
                      <div className="flex justify-center p-4">
                        <div className="bg-white p-2 border border-gray-200 rounded-lg">
                          <QrCode size={150} className="text-black" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {!isActive && (
        <div className="flex justify-center">
          <Card className="overflow-hidden border-0 shadow-lg rounded-lg max-w-[320px]">
            <CardContent className="p-0">
              <div className="relative bg-white">
                {/* Red shapes - top left */}
                <div className="absolute top-0 left-0 w-24 h-24">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-ufps-red rounded-br-[100%]"></div>
                </div>

                {/* Red shapes - bottom right */}
                <div className="absolute bottom-0 right-0 w-24 h-24">
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-ufps-red rounded-tl-[100%]"></div>
                </div>

                {/* Red dots */}
                <div className="absolute top-1/3 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>
                <div className="absolute top-1/2 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>
                <div className="absolute bottom-1/3 right-8 w-2 h-2 bg-ufps-red rounded-full"></div>

                {/* Header with logo */}
                <div className="pt-4 px-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-ufps-red text-white text-xs p-1 mr-1">UFPS</div>
                    <div className="text-xs leading-tight">
                      <div>Universidad Francisco</div>
                      <div>de Paula Santander</div>
                    </div>
                  </div>
                </div>

                {/* Photo and info */}
                <div className="p-4 pt-8">
                  <div className="flex gap-4">
                    <div className="h-32 w-28 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                      <User size={64} className="text-gray-400" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg">Juan Perez</h3>
                        <h4 className="font-bold text-lg">Castillo Lopez</h4>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">C.C.:</span> 1151234567
                        </p>
                        <p>
                          <span className="font-medium">Código:</span> 1331007
                        </p>
                        <p>
                          <span className="font-medium">GS RH:</span> A+
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Role badge */}
                  <div className="mt-4 bg-ufps-red text-white text-center py-1 rounded-md font-medium">Estudiante</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isActive && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => setShowQrInfo(true)} className="flex items-center gap-2 text-black">
            <Info size={16} />
            <span>Información del QR</span>
          </Button>
        </div>
      )}

      <Dialog open={showQrInfo} onOpenChange={setShowQrInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información del Código QR</DialogTitle>
            <DialogDescription>
              Al escanear este código QR, se proporciona acceso a tu información detallada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Información Personal</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="font-medium">Nombre:</span> Juan Perez Castillo Lopez
                </li>
                <li>
                  <span className="font-medium">C.C.:</span> 1151234567
                </li>
                <li>
                  <span className="font-medium">Programa:</span> Ingeniería de Sistemas
                </li>
                <li>
                  <span className="font-medium">Semestre:</span> 6
                </li>
                <li>
                  <span className="font-medium">Email:</span> juan.perez@ufps.edu.co
                </li>
              </ul>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Información Académica</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="font-medium">Promedio:</span> 4.2/5.0
                </li>
                <li>
                  <span className="font-medium">Créditos Completados:</span> 96
                </li>
                <li>
                  <span className="font-medium">Estado Actual:</span> Activo
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500">
              Esta información se almacena de forma segura y solo es accesible para el personal autorizado.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

