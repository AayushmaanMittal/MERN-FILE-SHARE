"use client"

import { useEffect, useState } from "react"
import { FileIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FileItem {
  _id: string
  filename: string
  size: number
  recipientEmail: string
  createdAt: string
}

export default function FilesList() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/files/sent", {
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

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
        {files.map((file) => (
          <div key={file._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{file.filename}</p>
                <p className="text-xs text-gray-500">
                  Sent to: {file.recipientEmail} • {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(file._id)}>
              <Trash2 className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
