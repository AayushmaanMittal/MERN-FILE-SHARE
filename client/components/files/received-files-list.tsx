"use client"

import { useEffect, useState } from "react"
import { Download, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { filesAPI } from "@/lib/api"
import { formatBytes, formatDate, getFileIcon } from "@/lib/utils"

interface FileItem {
  _id: string
  filename: string
  originalName: string
  size: number
  senderEmail: string
  createdAt: string
  downloaded: boolean
}

interface ReceivedFilesListProps {
  refreshTrigger?: number
}

export default function ReceivedFilesList({ refreshTrigger = 0 }: ReceivedFilesListProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true)
        const data = await filesAPI.getReceivedFiles()
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
  }, [toast, refreshTrigger])

  const handleDownload = async (id: string, filename: string) => {
    try {
      const response = await filesAPI.downloadFile(id)

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

      // Update the downloaded status in the UI
      setFiles(files.map((file) => (file._id === id ? { ...file, downloaded: true } : file)))
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
        {files.map((file) => {
          const FileIconComponent = getFileIcon(file.originalName)
          return (
            <div
              key={file._id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{file.originalName}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 gap-1 sm:gap-2">
                    <span>From: {file.senderEmail}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{formatDate(file.createdAt)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{formatBytes(file.size)}</span>
                    {file.downloaded && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-green-500">Downloaded</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDownload(file._id, file.originalName)}>
                <Download className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
