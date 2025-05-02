"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileUploadForm from "@/components/files/file-upload-form"
import SentFilesList from "@/components/files/sent-files-list"
import ReceivedFilesList from "@/components/files/received-files-list"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const [recipientEmail, setRecipientEmail] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { user, loading } = useAuth()

  const handleRecipientChange = (email: string) => {
    setRecipientEmail(email)
  }

  const handleUploadComplete = () => {
    // Trigger a refresh of the files lists
    setRefreshTrigger((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg">Please log in to access the dashboard</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Secure File Sharing</CardTitle>
            <CardDescription>Share files securely with end-to-end encryption</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="send" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="send">Send Files</TabsTrigger>
                <TabsTrigger value="received">Received Files</TabsTrigger>
              </TabsList>
              <TabsContent value="send" className="space-y-6">
                <FileUploadForm
                  recipientEmail={recipientEmail}
                  onRecipientChange={handleRecipientChange}
                  onUploadComplete={handleUploadComplete}
                />
                <SentFilesList refreshTrigger={refreshTrigger} />
              </TabsContent>
              <TabsContent value="received">
                <ReceivedFilesList refreshTrigger={refreshTrigger} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4 text-xs text-gray-500">
            <div>Files are encrypted end-to-end</div>
            <div>Max file size: 100MB</div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
