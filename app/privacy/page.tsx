import Header from "@/components/Header"

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-4">Last Updated: 15/02/2025</p>

          <p className="mb-6">
            FHAI Services Pvt. Ltd. ("we," "our," or "us") is committed to protecting your privacy. This 
            Privacy Policy describes how we collect, use, disclose, and safeguard your personal 
            information when you use our services, including investment recommendations and credit 
            bureau report retrieval, in compliance with applicable Indian laws and regulations.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information when you use our services:</p>
            
            <h3 className="text-lg font-medium mb-2">a. Personal Information:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, date of birth, PAN, Aadhaar (if applicable) for Credit Report Pull</li>
              <li>Contact details (email and phone number)</li>
              <li>Employment details and income information (optional)</li>
              <li>Bank account details for investment transactions (optional)</li>
              <li>Investment preferences and risk profile</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">b. Credit Information:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your explicit consent, we retrieve your credit bureau report from authorized 
                  credit bureaus in India.</li>
              <li>Credit score, repayment history, outstanding loans, and other credit-related details.</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">c. Technical and Usage Information:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address, device information, browser type</li>
              <li>Cookies and tracking technologies to enhance user experience</li>
              <li>Transaction details and interactions with our platform</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide investment recommendations tailored to your financial profile</li>
              <li>To assess your creditworthiness and eligibility for financial products</li>
              <li>To comply with regulatory requirements under SEBI, RBI, and other financial 
                  regulators</li>
              <li>To improve our services, security, and user experience</li>
              <li>To communicate relevant offers, updates, and personalized financial insights</li>
              <li>To prevent fraud and ensure the security of our platform</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Sharing and Disclosure of Information</h2>
            <p className="mb-3">
              We do not sell or rent your personal information. However, we may share your information 
              with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-medium">Regulatory Authorities:</span> As required by SEBI, RBI, or other relevant regulators.</li>
              <li><span className="font-medium">Credit Bureaus:</span> With your consent, for retrieving credit reports.</li>
              <li><span className="font-medium">Third-Party Partners:</span> Investment firms, mutual funds, and financial institutions for executing investment recommendations.</li>
              <li><span className="font-medium">Service Providers:</span> Data storage, analytics, customer support, and payment processing partners under strict confidentiality agreements.</li>
              <li><span className="font-medium">Legal Compliance:</span> In response to court orders, legal requests, or to protect our legal rights.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Consent and Control</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>By using our services, you provide explicit consent to collect and process your data.</li>
              <li>You have the right to withdraw your consent for credit report retrieval at any time.</li>
              <li>You may opt out of marketing communications by contacting us.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
            <p className="mb-3">We implement industry-standard security measures, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data encryption (AES-256) for sensitive information</li>
              <li>Secure access controls and authentication mechanisms</li>
              <li>Regular security audits and compliance checks</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
            <p className="mb-3">
              We retain your personal data only for as long as necessary to fulfil our obligations or as required
              by applicable laws. Credit bureau reports are not stored beyond the permitted duration.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <p className="mb-3">As per Indian data protection laws, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, update, or correct your personal information</li>
              <li>Request deletion of your data (subject to legal limitations)</li>
              <li>Object to data processing in specific circumstances</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Third-Party Links</h2>
            <p className="mb-3">
              Our platform may contain links to third-party websites. We are not responsible for their privacy
              practices and recommend reviewing their privacy policies separately.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Changes to this Policy</h2>
            <p className="mb-3">
              We may update this Privacy Policy periodically. Any changes will be communicated through our
              website or app.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
            <p className="mb-3">For any questions or concerns regarding this Privacy Policy, contact us at:</p>
            <div className="space-y-2">
              <p>FHAI Services Pvt. Ltd.</p>
              <p>Jerbai Wadia Rd, Mumbai 400012</p>
              <p>Email: support@financialhealth.co.in</p>
              <p>Phone: +91 93213 14553</p>
            </div>
          </section>

          <p className="mt-8 text-md text-gray-600">
            By using our services, you acknowledge that you have read and understood this Privacy Policy
            and agree to its terms.
          </p>

        </div>
      </main>
    </>
  );
} 