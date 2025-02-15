import Header from "@/components/Header"

export default function TermsAndConditions() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-sm text-gray-500 mb-4">Last Updated: 15/02/2025</p>

          <p className="mb-6">
            These Terms and Conditions ("Terms") govern your access to and use of the services 
            provided by FHAI Services Pvt. Ltd. ("we," "our," or "us"), including investment 
            recommendations and credit bureau report retrieval. By using our services, you agree to 
            comply with these Terms. If you do not agree, please do not use our services.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old and a resident of India to use our services.</li>
              <li>You must provide accurate and complete information for account registration and 
                  investment profiling.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Services Provided</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We provide investment recommendations based on your risk profile and financial data.</li>
              <li>With your explicit consent, we retrieve your credit bureau report from authorized bureaus.</li>
              <li>Our platform may offer access to third-party financial products, subject to their 
                  respective terms and conditions.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. User Obligations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to provide true and accurate information for financial assessment and recommendations.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must comply with all applicable financial regulations and laws.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Consent and Data Usage</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>By using our services, you consent to the collection, processing, and sharing of your 
                  personal and financial data as outlined in our Privacy Policy.</li>
              <li>You may withdraw consent for credit bureau retrieval at any time by contacting us.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Investment and Financial Risks</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not guarantee returns on any investment recommendations.</li>
              <li>Market risks apply, and you acknowledge that investment decisions are your sole responsibility.</li>
              <li>We do not provide personalized tax or legal advice; consult a professional before 
                  making investment decisions.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Fees and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Certain services may involve fees, which will be communicated transparently.</li>
              <li>Payments for premium services are non-refundable unless stated otherwise.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Termination of Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We reserve the right to suspend or terminate your account if you violate these Terms.</li>
              <li>You may close your account at any time by notifying us in writing.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We are not liable for any financial losses arising from investment decisions based on our recommendations.</li>
              <li>We do not guarantee the accuracy or completeness of third-party financial data.</li>
              <li>Our liability is limited to the extent permitted by Indian law.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Third-Party Links and Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our platform may contain links to third-party services. We are not responsible for their content or practices.</li>
              <li>Any transactions with third parties are solely between you and the respective entity.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">10. Amendments to Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We may update these Terms periodically. Continued use of our services constitutes acceptance of the revised Terms.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">11. Governing Law and Dispute Resolution</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>These Terms are governed by the laws of India.</li>
              <li>Any disputes shall be resolved through arbitration or the appropriate courts in [Jurisdiction].</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
            <p className="mb-4">For any queries regarding these Terms, contact us at:</p>
            <div className="space-y-2">
              <p>FHAI Services Pvt Ltd</p>
              <p>Jethai Wadia Rd, Mumbai 400012</p>
              <p>Email: support@financialhealth.co.in</p>
              <p>Phone: +91 93213 14553</p>
            </div>
          </section>

          <p className="mt-8 text-md">
            By using our services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>
        </div>
      </main>
    </>
  );
} 