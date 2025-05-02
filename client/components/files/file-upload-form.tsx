"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { filesAPI } from "@/lib/api"

interface FileUploadFormProps {
  recipientEmail: string
  onRecipientChange: (email: string) => void
  onUploadComplete: () => void
}

export default function FileUploadForm({ recipientEmail, onRecipientChange, onUploadComplete }: FileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRecipientChange(e.target.value)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
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
      await filesAPI.uploadFile(formData)

      clearInterval(interval)
      setProgress(100)

      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} has been sent to ${recipientEmail}`,
      })

      // Reset state
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Notify parent component
      onUploadComplete()
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
      <div className="space-y-2">
        <label htmlFor="recipient" className="text-sm font-medium">
          Recipient Email
        </label>
        <Input
          id="recipient"
          type="email"
          placeholder="recipient@example.com"
          value={recipientEmail}
          onChange={handleRecipientChange}
          disabled={uploading}
        />
      </div>

      <div
        className={`upload-area ${dragActive ? "dragging" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
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
