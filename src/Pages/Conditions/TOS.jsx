import React from 'react';
import { backendUrl } from '../../App';

const TOS = () => {
  return (
    <div className="min-h-screen bg-white text-brown font-sans py-8 px-4 md:px-8 lg:px-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
          Terms of Service
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
          Welcome to <strong>CCI (Content Creator Insurance)</strong>, a micro-insurance product designed exclusively for Kenyan YouTube creators earning $500+ per month (approximately KSh 65,000). By accessing or using the CCI app or website (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Service.
        </p>
        <p className="text-brown leading-relaxed">
          CCI provides protection against sudden income loss from YouTube platform risks, such as demonetization, temporary suspensions, or glitches. We operate under Kenyan insurance regulations and use YouTube's API for seamless, digital experiences.
        </p>
      </section>

      {/* Definitions */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">2. Definitions</h2>
        <ul className="space-y-2 text-brown leading-relaxed">
          <li className="flex items-start">
            <span className="bg-appleGreen w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span><strong>Channel:</strong> Your verified YouTube channel connected via OAuth.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-appleGreen w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span><strong>Covered Event:</strong> Platform-risk losses like ad suitability demonetization or policy updates (see Section 5).</span>
          </li>
          <li className="flex items-start">
            <span className="bg-appleGreen w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span><strong>Premium:</strong> Monthly fee of 2-5% of your average monthly earnings, paid via M-Pesa.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-appleGreen w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span><strong>Payout:</strong> Up to 70% of your average daily ad revenue for verified claims, capped monthly.</span>
          </li>
        </ul>
      </section>

      {/* Coverage Details */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">3. Coverage Details</h2>
        <p className="text-brown leading-relaxed mb-6">
          CCI covers income loss from Covered Events on your eligible YouTube Channel. Coverage begins upon premium payment and verification.
        </p>
        <div className="bg-yellowGreen/10 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-brown mb-2">What We Cover</h3>
          <ul className="space-y-2 text-brown">
            <li>• Ad suitability demonetization (yellow icon on ≥70% of videos)</li>
            <li>• Temporary suspensions (≤30 days, first offense)</li>
            <li>• Policy update waves (e.g., July 2025 "real content" rules)</li>
            <li>• Platform glitches later reversed by YouTube</li>
          </ul>
        </div>
      </section>

      {/* Premiums and Payments */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">4. Premiums and Payments</h2>
        <p className="text-brown leading-relaxed mb-4">
          Your premium is calculated as 2-5% of your average monthly YouTube earnings (minimum KSh 1,000), based on risk profile. Payments are auto-debited monthly via M-Pesa. Failure to pay cancels coverage.
        </p>
        <div className="bg-appleGreen/10 p-4 rounded-lg">
          <p className="text-brown font-medium">Example: If you earn KSh 97,000/month, premium ≈ KSh 2,900.</p>
        </div>
      </section>

      {/* Claims Process */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">5. Claims Process</h2>
        <p className="text-brown leading-relaxed mb-6">
          File claims in-app with minimal details (date, issue type, appeal status). We verify using YouTube API and pay 70% of baseline daily revenue in 7-10 days via M-Pesa.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-brown pl-4">
          <li>Detect revenue drop ≥70% via API.</li>
          <li>Confirm Covered Event (auto-check).</li>
          <li>Run fraud scan (AI score >75% approves).</li>
          <li>Payout calculated: <code className="bg-fadeBrown px-2 py-1 rounded text-white text-sm">baseline_daily * 0.7 * lost_days</code> (monthly cap applies).</li>
        </ol>
        <p className="text-brown leading-relaxed mt-4 text-sm italic">
          If reinstated retroactively, repay 50% within 30 days.
        </p>
      </section>

      {/* Exclusions */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">6. Exclusions</h2>
        <div className="bg-yellowGreen/5 border-l-4 border-yellowGreen p-6 rounded-r-lg">
          <p className="text-brown font-semibold mb-2">No coverage for:</p>
          <ul className="space-y-1 text-brown">
            <li>• Copyright/DMCA strikes</li>
            <li>• Community Guidelines violations (hate speech, violence, spam)</li>
            <li>• Fraudulent activity (view bots, sub4sub)</li>
            <li>• Impersonation or trademark issues</li>
            <li>• Self-disabled monetization</li>
            <li>• Government blocks (e.g., Cybercrimes Act)</li>
          </ul>
        </div>
      </section>

      {/* Fraud and Misrepresentation */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">7. Fraud and Misrepresentation</h2>
        <p className="text-brown leading-relaxed mb-4">
          We use AI and API checks to detect fraud (e.g., revenue spikes, name mismatches). Fake claims result in rejection, blacklisting, and reporting to YouTube. Misrepresentation voids coverage.
        </p>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
          <p className="text-red-800 font-medium">Red Flags Include: Revenue spikes >200%, IP-blocked views, or mismatched ID/M-Pesa names.</p>
        </div>
      </section>

      {/* Termination */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">8. Termination</h2>
        <p className="text-brown leading-relaxed">
          You may cancel anytime via app. We may terminate for non-payment, fraud, or policy violation. Coverage ends immediately upon termination.
        </p>
      </section>

      {/* Governing Law */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">9. Governing Law</h2>
        <p className="text-brown leading-relaxed">
          These Terms are governed by Kenyan law. Disputes resolved in Nairobi courts. CCI complies with IRA (micro-insurer), Data Protection Act 2019, and AML/CFT regulations.
        </p>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-brown mb-4">10. Contact Us</h2>
        <p className="text-brown mb-4">
          Questions? Email <a href="mailto:eddymuchiri123@gmail.com" className="text-yellowGreen hover:underline">eddymuchiri123@gmail.com</a> or visit our app dashboard.
        </p>
        <a href={`/login`} className="bg-appleGreen text-white px-6 py-3 rounded-full inline-block font-semibold">
          Start Protecting Your Channel Today
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-fadeBrown mt-16 pt-8 border-t border-fadeBrown">
        <p>&copy; 2025 CCI. All rights reserved. Built for Kenyan Creators.</p>
      </footer>
    </div>
  );
};

export default TOS;