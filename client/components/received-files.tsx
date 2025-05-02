"use client"

import { useEffect, useState } from "react"
import { Download, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FileItem {
  _id: string
  filename: string
  size: number
  senderEmail: string
  createdAt: string
}

export default function ReceivedFiles() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/files/received", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch files")
        }

        const data = await response.json()
        setFiles(data)
      } catch (error) {
        toast({
          title: "Error fetching files",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [toast])

  const handleDownload = async (id: string, filename: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/download/${id}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to download file")
      }

      // Create a blob from the response
      const blob = await response.blob()

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download started",
        description: `${filename} is being downloaded`,
      })
    } catch (error) {
      toast({
        title: "Error downloading file",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading your files...</div>
  }

  if (files.length === 0) {
    return <div className="text-center py-8 text-gray-500">You haven't received any files yet</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Received Files</h3>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{file.filename}</p>
                <p className="text-xs text-gray-500">
                  From: {file.senderEmail} • {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDownload(file._id, file.filename)}>
              <Download className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
