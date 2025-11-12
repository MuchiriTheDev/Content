import React from 'react';
import { backendUrl } from '../../App';

const PP = () => {
  return (
    <div className="min-h-screen bg-white text-brown font-sans py-8 px-4 md:px-8 lg:px-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-fadeBrown max-w-2xl mx-auto">
          Last Updated: November 10, 2025
        </p>
        <div className="w-24 h-1 bg-yellowGreen mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">1. Introduction</h2>
        <p className="text-brown leading-relaxed mb-6">
          At <strong>CCI (Content Creator Insurance)</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our mobile app and website (the "Service"), designed for Kenyan YouTube creators.
        </p>
        <p className="text-brown leading-relaxed mb-4">
          We comply with the Kenyan <strong>Data Protection Act, 2019 (DPA)</strong> and act as the data controller. By using CCI, you consent to the practices described here. If you have questions, contact us at <a href="mailto:eddymuchiri123@gmail.com" className="text-yellowGreen hover:underline">eddymuchiri123@gmail.com</a>.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">2. Information We Collect</h2>
        <p className="text-brown leading-relaxed mb-6">
          We collect only the minimum data needed to provide insurance, verify claims, and prevent fraud. All collection is digital and consent-based.
        </p>
        <div className="bg-yellowGreen/10 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-brown mb-2">Personal Data</h3>
          <ul className="space-y-2 text-brown">
            <li><strong>Identity:</strong> Full name, National ID/Passport number (hashed for storage).</li>
            <li><strong>Contact:</strong> Phone number (M-Pesa registered) for OTP and payouts.</li>
            <li><strong>YouTube Data:</strong> Channel ID, earnings analytics (via YouTube API – no video content stored).</li>
          </ul>
        </div>
        <div className="bg-appleGreen/10 p-4 rounded-lg">
          <p className="text-brown font-medium text-sm">We do <strong>not</strong> collect sensitive data like passwords, full videos, or financial statements beyond API pulls.</p>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">3. How We Use Your Information</h2>
        <p className="text-brown leading-relaxed mb-4">
          Your data powers CCI's core features securely and transparently.
        </p>
        <ul className="space-y-2 text-brown pl-4 list-disc">
          <li><strong>Onboarding & Verification:</strong> ID checks via NDVS/Huduma API; earnings via YouTube Analytics API; M-Pesa name match.</li>
          <li><strong>Premium Calculation:</strong> Based on average daily revenue to set fair 2-5% fees.</li>
          <li><strong>Claims Processing:</strong> Detect revenue drops, verify events, and calculate 70% payouts.</li>
          <li><strong>Fraud Prevention:</strong> AI scans for red flags (e.g., revenue spikes) using anonymized patterns.</li>
          <li><strong>Service Improvement:</strong> Aggregated analytics (no personal identifiers) for app enhancements like AI tips.</li>
        </ul>
        <p className="text-brown leading-relaxed mt-4 text-sm italic">
          We retain raw data only as needed (e.g., ID hashes for 3 years per DPA); delete after 30 days where possible.
        </p>
      </section>

      {/* Sharing and Disclosure */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">4. Sharing and Disclosure</h2>
        <p className="text-brown leading-relaxed mb-6">
          We never sell your data. Sharing is limited to trusted partners for service delivery.
        </p>
        <div className="bg-yellowGreen/5 border-l-4 border-yellowGreen p-6 rounded-r-lg mb-6">
          <h3 className="text-xl font-semibold text-brown mb-2">Who We Share With</h3>
          <ul className="space-y-1 text-brown">
            <li><strong>Verification Partners:</strong> NDVS (gov't ID), Safaricom (M-Pesa), Google (YouTube OAuth – revocable).</li>
            <li><strong>Payouts:</strong> Safaricom for M-Pesa transfers (name + amount only).</li>
            <li><strong>Legal/Regulatory:</strong> IRA (Insurance Regulatory Authority), ODPC (Data Protection Commissioner) if required.</li>
            <li><strong>Audits:</strong> Anonymized data for fraud detection models (no re-identification).</li>
          </ul>
        </div>
        <p className="text-brown leading-relaxed text-sm">
          In case of merger/acquisition, data transfers with DPA-compliant notice. International transfers (e.g., Google servers) use adequacy safeguards.
        </p>
      </section>

      {/* Data Security */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">5. Data Security</h2>
        <p className="text-brown leading-relaxed mb-4">
          We use industry-standard measures to protect your data from unauthorized access, loss, or breach.
        </p>
        <ul className="space-y-2 text-brown pl-4 list-disc">
          <li>Encryption: In-transit (TLS 1.3) and at-rest (AES-256).</li>
          <li>Access Controls: Role-based, with 2FA for staff.</li>
          <li>Hashes: ID numbers stored as irreversible SHA-256 hashes.</li>
          <li>Audits: Regular penetration testing and DPA compliance reviews.</li>
        </ul>
        <div className="bg-appleGreen/10 p-4 rounded-lg mt-4">
          <p className="text-brown font-medium">In event of a breach, we notify affected users and ODPC within 72 hours per DPA.</p>
        </div>
      </section>

      {/* Your Rights */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">6. Your Rights Under DPA</h2>
        <p className="text-brown leading-relaxed mb-4">
          As a Kenyan data subject, you have rights to control your information.
        </p>
        <ul className="space-y-2 text-brown pl-4 list-disc">
          <li><strong>Access:</strong> Request a copy of your data (free, once/year).</li>
          <li><strong>Rectification:</strong> Correct inaccuracies via app or email.</li>
          <li><strong>Erasure ("Right to be Forgotten"):</strong> Delete data (may cancel policy).</li>
          <li><strong>Objection:</strong> Opt-out of processing (e.g., AI tips).</li>
          <li><strong>Portability:</strong> Export YouTube-linked data in JSON.</li>
          <li><strong>Withdraw Consent:</strong> Revoke OAuth anytime – ends coverage.</li>
        </ul>
        <p className="text-brown leading-relaxed mt-4 text-sm">
          Exercise rights at <a href="mailto:eddymuchiri123@gmail.com" className="text-yellowGreen hover:underline">eddymuchiri123@gmail.com</a>. We respond within 30 days.
        </p>
      </section>

      {/* Cookies and Tracking */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">7. Cookies and Tracking</h2>
        <p className="text-brown leading-relaxed">
          Our app uses essential cookies for functionality (e.g., session management). We do not use third-party trackers or advertising cookies. You can manage preferences in your browser.
        </p>
      </section>

      {/* Children's Privacy */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">8. Children's Privacy</h2>
        <p className="text-brown leading-relaxed">
          CCI is not intended for users under 18. We do not knowingly collect data from children. If we discover such data, we delete it immediately and notify guardians.
        </p>
      </section>

      {/* Changes to This Policy */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">9. Changes to This Policy</h2>
        <p className="text-brown leading-relaxed mb-4">
          We may update this policy to reflect changes in our practices or laws. We'll notify you via app/email 30 days in advance for material changes. Continued use constitutes acceptance.
        </p>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">10. Contact Us</h2>
        <p className="text-brown mb-4">
          For privacy concerns, reach out to our Data Protection Officer at <a href="mailto:eddymuchiri123@gmail.com" className="text-yellowGreen hover:underline">eddymuchiri123@gmail.com</a> or +254 114672193.
        </p>
        <a href={`/login`} className="bg-appleGreen text-white px-6 py-3 rounded-full inline-block font-semibold">
          Your Privacy Matters to Us
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-fadeBrown mt-16 pt-8 border-t border-fadeBrown">
        <p>&copy; 2025 CCI. All rights reserved. Protecting Creators, One Policy at a Time.</p>
      </footer>
    </div>
  );
};

export default PP;