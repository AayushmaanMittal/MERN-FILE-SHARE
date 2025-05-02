"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  recipientEmail: string
}

export default function FileUpload({ recipientEmail }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    if (!recipientEmail) {
      toast({
        title: "No recipient specified",
        description: "Please enter a recipient email address",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setProgress(0)

    // Create form data
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("recipientEmail", recipientEmail)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 300)

      // Send to server
      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      clearInterval(interval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} has been sent to ${recipientEmail}`,
      })

      // Reset state
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={uploading}
        />

        {!selectedFile ? (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <label htmlFor="file-upload" className="cursor-pointer text-primary hover:underline">
                Click to upload
              </label>{" "}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500">Supported files: PDF, DOCX, XLSX, JPG, PNG, ZIP (up to 100MB)</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-[80%]">{selectedFile.name}</span>
              <Button variant="ghost" size="sm" onClick={clearSelectedFile} disabled={uploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="space-y-2">
          {uploading && <Progress value={progress} className="h-2 w-full" />}
          <Button onClick={handleUpload} className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Send File"}
          </Button>
        </div>
      )}
    </div>
  )
}
