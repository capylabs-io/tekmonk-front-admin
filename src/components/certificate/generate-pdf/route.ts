import { type NextRequest, NextResponse } from "next/server"
import PDFDocument from "pdfkit"

// Convert stream to buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on("end", () => resolve(Buffer.concat(chunks)))
    stream.on("error", reject)
  })
}

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData()

    // Get the background image
    const backgroundFile = formData.get("background") as File
    if (!backgroundFile) {
      return NextResponse.json({ error: "Background image is required" }, { status: 400 })
    }

    // Get the certificate data
    const certificateDataStr = formData.get("certificateData") as string
    const certificateData = JSON.parse(certificateDataStr)

    // Get the certificate dimensions
    const width = Number.parseInt(formData.get("width") as string) || 1200
    const height = Number.parseInt(formData.get("height") as string) || 800

    // Convert the background image to a buffer
    const backgroundBuffer = Buffer.from(await backgroundFile.arrayBuffer())

    // Create a new PDF document
    const doc = new PDFDocument({
      size: [width, height],
      margin: 0,
      info: {
        Title: "Certificate",
        Author: "Certificate Generator",
      },
    })

    // Add the background image
    doc.image(backgroundBuffer, 0, 0, {
      width,
      height,
    })

    // Add the text fields
    for (const field of certificateData) {
      doc
        .font(field.fontWeight === "bold" ? "Helvetica-Bold" : "Helvetica")
        .fontSize(field.fontSize)
        .fillColor(field.color)
        .text(field.value, field.position.x, field.position.y, {
          align: "center",
          width: 400, // Adjust as needed
        })
    }

    // Finalize the PDF
    doc.end()

    // Convert the PDF stream to a buffer
    const pdfBuffer = await streamToBuffer(doc)

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="certificate.pdf"',
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

