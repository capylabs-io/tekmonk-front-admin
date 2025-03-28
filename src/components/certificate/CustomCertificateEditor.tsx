"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Draggable from "react-draggable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Download, Upload, Move } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { CommonButton } from "@/components/common/button/CommonButton";

// Define the certificate field type
type CertificateField = {
  id: string
  label: string
  value: string
  position: { x: number; y: number }
  fontSize: number
  fontWeight: string
  color: string
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function CertificateEditor() {
  // Certificate background image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [isOpenAddTextBlock, setIsOpenAddTextBlock] = useState(false)
  const [textBlockName, setTextBlockName] = useState("")
  // Certificate dimensions
  const certificateWidth = 1200
  const certificateHeight = 800

  // Certificate fields with default positions
  const [fields, setFields] = useState<CertificateField[]>([
    {
      id: "name",
      label: "Tên người nhận",
      value: "John Doe",
      position: { x: 400, y: 380 },
      fontSize: 24,
      fontWeight: "normal",
      color: "#333333",
    },
    {
      id: "course",
      label: "Tên khóa học",
      value: "Web Development Masterclass",

      position: { x: 400, y: 300 },
      fontSize: 36,
      fontWeight: "bold",
      color: "#000000",
    },
    {
      id: "date",
      label: "Ngày cấp",
      value: new Date().toLocaleDateString(),
      position: { x: 400, y: 450 },
      fontSize: 18,
      fontWeight: "normal",
      color: "#555555",
    },
    {
      id: "signature",
      label: "Chữ ký",
      value: "Jane Smith",
      position: { x: 400, y: 520 },
      fontSize: 20,
      fontWeight: "normal",
      color: "#000000",
    },
  ])

  const certificateRef = useRef<HTMLDivElement>(null)
  const fieldRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [activeTab, setActiveTab] = useState("content")

  // Initialize refs for each field
  useEffect(() => {
    fields.forEach((field) => {
      if (!fieldRefs.current[field.id]) {
        fieldRefs.current[field.id] = React.createRef<HTMLDivElement>()
      }
    })
  }, [fields])

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (certificateRef.current) {
        setContainerSize({
          width: certificateRef.current.offsetWidth,
          height: certificateRef.current.offsetHeight,
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Handle field value changes
  const handleFieldChange = (id: string, value: string) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, value } : field)))
  }

  // Handle field style changes
  const handleStyleChange = (id: string, property: keyof CertificateField, value: any) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, [property]: value } : field)))
  }

  // Handle position change via input fields
  const handlePositionChange = (id: string, axis: "x" | "y", value: number) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
            ...field,
            position: {
              ...field.position,
              [axis]: value,
            },
          }
          : field,
      ),
    )
  }

  // Handle drag stop to update position
  const handleDragStop = (id: string, e: any, data: { x: number; y: number }) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
            ...field,
            position: {
              x: data.x,
              y: data.y,
            },
          }
          : field,
      ),
    )
  }

  // Handle background image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      // toast({
      //   title: "Invalid file type",
      //   description: "Please upload an image file (JPEG, PNG, etc.)",
      //   variant: "destructive",
      // })
      return
    }

    // Create a URL for the image preview
    const imageUrl = URL.createObjectURL(file)
    setBackgroundImage(imageUrl)
    setBackgroundFile(file)
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Export as PDF using PDFKit on the server
  const exportAsPDF = async () => {
    if (!backgroundFile) {
      // toast({
      //   title: "Background image required",
      //   description: "Please upload a background image first",
      //   variant: "destructive",
      // })
      return
    }

    setIsGeneratingPDF(true)

    try {
      // Create a FormData object to send the background image and certificate data
      const formData = new FormData()
      formData.append("background", backgroundFile)
      formData.append("certificateData", JSON.stringify(fields))
      formData.append("width", certificateWidth.toString())
      formData.append("height", certificateHeight.toString())

      // Send the data to the server to generate the PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Get the PDF as a blob
      const pdfBlob = await response.blob()

      // Create a download link for the PDF
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "certificate.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // toast({
      //   title: "PDF Generated",
      //   description: "Your certificate has been downloaded",
      // })
    } catch (error) {
      console.error("Error generating PDF:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to generate PDF. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (backgroundImage) {
        URL.revokeObjectURL(backgroundImage)
      }
    }
  }, [backgroundImage])

  // Add new field
  const addNewField = (name: string) => {
    const newId = `field-${Date.now()}`
    setFields([
      ...fields,
      {
        id: newId,
        label: name,
        value: "văn bản mới",
        position: { x: 100, y: 100 },
        fontSize: 18,
        fontWeight: "normal",
        color: "#000000",
      },
    ])
    setIsOpenAddTextBlock(false)
    setActiveTab("content")
    setTextBlockName("")
  }

  // Delete field
  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
    delete fieldRefs.current[id]
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto">
        {/* Certificate Preview */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-white p-4 rounded-lg h-full">
            <div className="flex justify-end items-center">
              <Button onClick={() => setIsOpenAddTextBlock(true)} variant="outline" size="sm">
                Thêm khối văn bản
              </Button>
            </div>
            <div
              ref={certificateRef}
              className="relative bg-white border border-gray-200 rounded-lg overflow-hidden my-4"
              style={{
                width: "100%",
                height: "calc(100% - 36px - 40px - 32px)",
                maxWidth: "100%",
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: backgroundImage ? "transparent" : "#f9f9f9",
              }}
            >
              {!backgroundImage && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <p>Vui lòng tải lên hình nền</p>
                </div>
              )}
              {fields.map((field) => (
                <Draggable
                  key={field.id}
                  position={field.position}
                  bounds="parent"
                  onStop={(e, data) => handleDragStop(field.id, e, data)}
                  nodeRef={fieldRefs.current[field.id]}
                >
                  <div
                    ref={fieldRefs.current[field.id]}
                    className="absolute cursor-move draggable-field border-2 border-transparent hover:border-blue-400 rounded px-2 py-1 text-center touch-none"
                    style={{
                      fontSize: `${field.fontSize}px`,
                      fontWeight: field.fontWeight,
                      color: field.color,
                    }}
                  >
                    {field.value}
                  </div>
                </Draggable>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={exportAsPDF} disabled={isGeneratingPDF || !backgroundFile}>
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? "Đang tạo..." : "Xuất ra PDF"}
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Controls */}
        <div className="lg:col-span-1 h-full overflow-y-auto">
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="background">Hình nền</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {fields.map((field) => (
                      <div key={field.id} className="space-y-4 pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={field.id} className="text-base font-medium">
                            {field.label}
                          </Label>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground"
                              onClick={() => setActiveTab("position-" + field.id)}
                            >
                              <Move className="h-4 w-4 mr-1" />
                              Vị trí
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-red-500 hover:text-red-600"
                              onClick={() => deleteField(field.id)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                        <Input
                          id={field.id}
                          value={field.value}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor={`${field.id}-size`} className="text-xs">
                              Kích thước chữ
                            </Label>
                            <Input
                              id={`${field.id}-size`}
                              type="number"
                              value={field.fontSize}
                              onChange={(e) => handleStyleChange(field.id, "fontSize", Number.parseInt(e.target.value))}
                              min={8}
                              max={72}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${field.id}-weight`} className="text-xs">
                              Độ dày chữ
                            </Label>
                            <select
                              id={`${field.id}-weight`}
                              value={field.fontWeight}
                              onChange={(e) => handleStyleChange(field.id, "fontWeight", e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor={`${field.id}-color`} className="text-xs">
                              Màu sắc
                            </Label>
                            <Input
                              id={`${field.id}-color`}
                              type="color"
                              value={field.color}
                              onChange={(e) => handleStyleChange(field.id, "color", e.target.value)}
                              className="h-10 p-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="background" className="h-max">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="background-file">Hình nền</Label>
                    <input
                      ref={fileInputRef}
                      id="background-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="grid gap-2">
                      <Button onClick={handleUploadClick} variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Tải lên hình nền
                      </Button>
                      {backgroundImage && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                          <div
                            className="h-full w-full bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Để đạt kết quả tốt nhất, hãy sử dụng hình ảnh có kích thước gần 1200×800 pixels.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dynamic position tabs for each field */}
            {fields.map((field) => (
              <TabsContent key={`position-${field.id}`} value={`position-${field.id}`}>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Position: {field.label}</h3>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("content")}>
                        Quay lại nội dung
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* X Position */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor={`${field.id}-x-position`}>Vị trí X</Label>
                          <span className="text-sm text-muted-foreground">{Math.round(field.position.x)}px</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Slider
                            id={`${field.id}-x-position`}
                            min={0}
                            max={containerSize.width || 1200}
                            step={1}
                            value={[field.position.x]}
                            onValueChange={(value) => handlePositionChange(field.id, "x", value[0])}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={Math.round(field.position.x)}
                            onChange={(e) => handlePositionChange(field.id, "x", Number.parseInt(e.target.value) || 0)}
                            className="w-20"
                            min={0}
                            max={containerSize.width || 1200}
                          />
                        </div>
                      </div>

                      {/* Y Position */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor={`${field.id}-y-position`}>Vị trí Y</Label>
                          <span className="text-sm text-muted-foreground">{Math.round(field.position.y)}px</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Slider
                            id={`${field.id}-y-position`}
                            min={0}
                            max={containerSize.height || 800}
                            step={1}
                            value={[field.position.y]}
                            onValueChange={(value) => handlePositionChange(field.id, "y", value[0])}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={Math.round(field.position.y)}
                            onChange={(e) => handlePositionChange(field.id, "y", Number.parseInt(e.target.value) || 0)}
                            className="w-20"
                            min={0}
                            max={containerSize.height || 800}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Tip: Bạn cũng có thể kéo văn bản trực tiếp trên chứng chỉ để đặt vị trí.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <Dialog open={isOpenAddTextBlock} onOpenChange={setIsOpenAddTextBlock}>
        <DialogContent className="bg-white h-max w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thêm khối văn bản</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Input
              value={textBlockName}
              onChange={(e) => setTextBlockName(e.target.value)}
              id="text-block-name"
              placeholder="Tên khối văn bản"
            />
          </DialogDescription>
          <DialogFooter>
            <CommonButton
              variant="secondary"
              onClick={() => setIsOpenAddTextBlock(false)}
            >
              Hủy
            </CommonButton>
            <CommonButton onClick={() => addNewField(textBlockName)}>Xác nhận</CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}