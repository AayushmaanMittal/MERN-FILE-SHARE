import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Shield, Lock, FileText } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  About Our Secure File Sharing
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform provides end-to-end encrypted file sharing with a focus on security and privacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">End-to-End Encryption</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    All files are encrypted using AES-256-CBC encryption before being stored on our servers.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Lock className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Secure Authentication</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    User authentication is handled with JWT tokens stored in HTTP-only cookies for maximum security.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Multiple File Types</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Support for various file types including documents, images, spreadsheets, and archives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our secure file sharing platform uses advanced encryption to ensure your files remain private and
                  secure.
                </p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">1.</span>
                    <span>Upload your file and specify a recipient</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">2.</span>
                    <span>The file is encrypted with a unique key</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">3.</span>
                    <span>The recipient receives access to the encrypted file</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">4.</span>
                    <span>When downloaded, the file is decrypted securely</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-lg border bg-background p-8">
                  <div className="flex flex-col space-y-4">
                    <div className="h-2 w-20 rounded-lg bg-primary"></div>
                    <h3 className="text-xl font-bold">Security First</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Our platform is built with security as the top priority. We use industry-standard encryption and
                      follow best practices for secure file handling.
                    </p>
                    <div className="h-2 w-20 rounded-lg bg-primary"></div>
                    <h3 className="text-xl font-bold">Privacy Focused</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We don't analyze or inspect your files. Everything is encrypted and only accessible to you and
                      your intended recipients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
