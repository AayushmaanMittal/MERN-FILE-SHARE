import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="lead">Last updated: May 1, 2023</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to Secure File Sharing. These terms and conditions outline the rules and regulations for the use
              of our website and services.
            </p>

            <h2>2. Acceptance of Terms</h2>
            <p>
              By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use
              our website if you do not accept all of the terms and conditions stated on this page.
            </p>

            <h2>3. License to Use</h2>
            <p>
              Unless otherwise stated, Secure File Sharing and/or its licensors own the intellectual property rights for
              all material on this website. All intellectual property rights are reserved.
            </p>

            <h2>4. User Account</h2>
            <p>
              When you create an account with us, you guarantee that the information you provide is accurate, complete,
              and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate
              termination of your account on our service.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account and password, including but not
              limited to the restriction of access to your computer and/or account. You agree to accept responsibility
              for any and all activities or actions that occur under your account and/or password.
            </p>

            <h2>5. Services and Fees</h2>
            <p>
              We offer secure file sharing services that allow you to upload, store, and share files with end-to-end
              encryption. Some of our services may be offered free of charge, while others may require payment.
            </p>
            <p>
              For paid services, you agree to provide current, complete, and accurate purchase and account information
              for all purchases made via our website. You further agree to promptly update account and payment
              information, including email address, payment method, and payment card expiration date, so that we can
              complete your transactions and contact you as needed.
            </p>

            <h2>6. Prohibited Uses</h2>
            <p>
              You may not use our services for any illegal or unauthorized purpose nor may you, in the use of the
              service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
            <p>You agree not to upload, share, or store any content that:</p>
            <ul>
              <li>
                Is illegal, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous,
                or otherwise objectionable
              </li>
              <li>
                Infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party
              </li>
              <li>
                Contains software viruses or any other computer code, files, or programs designed to interrupt, destroy,
                or limit the functionality of any computer software or hardware
              </li>
              <li>Interferes with or disrupts the services or servers or networks connected to the services</li>
            </ul>

            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall Secure File Sharing, nor its directors, employees, partners, agents, suppliers, or
              affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
              access to or use of or inability to access or use the service.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material we will provide at least 30 days' notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at terms@securefilesharing.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
