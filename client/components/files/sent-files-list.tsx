"use client"

import { useEffect, useState } from "react"
import { FileIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { filesAPI } from "@/lib/api"
import { formatBytes, formatDate, getFileIcon } from "@/lib/utils"

interface FileItem {
  _id: string
  filename: string
  originalName: string
  size: number
  recipientEmail: string
  createdAt: string
  downloaded: boolean
}

interface SentFilesListProps {
  refreshTrigger?: number
}

export default function SentFilesList({ refreshTrigger = 0 }: SentFilesListProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true)
        const data = await filesAPI.getSentFiles()
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

  const handleDelete = async (id: string) => {
    try {
      await filesAPI.deleteFile(id)
      setFiles(files.filter((file) => file._id !== id))

      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error deleting file",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading your files...</div>
  }

  if (files.length === 0) {
    return <div className="text-center py-8 text-gray-500">You haven't sent any files yet</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recently Sent Files</h3>
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
                    <span>To: {file.recipientEmail}</span>
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
              <Button variant="ghost" size="sm" onClick={() => handleDelete(file._id)}>
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
