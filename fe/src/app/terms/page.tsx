import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Video AI Studio",
  description: "Terms of Service and Usage Conditions for Video AI Studio",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 pb-5 mb-6">
          <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">
            &larr; Back to Video AI Studio
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: November 20, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing and using Video AI Studio (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;service&rdquo;) at{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700">https://nguyen-video.vercel.app</code>,
              you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. Description of Service</h2>
            <p>
              Video AI Studio provides video creation, subtitle synthesis, voiceovers, and publishing automation tools
              for verified content creators. Our service integrates with third-party platforms including TikTok, Facebook,
              and YouTube to help creators manage their own content distribution.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. Third-Party Integrations &amp; TikTok API</h2>
            <p>
              Our application utilizes official developer APIs, including the TikTok for Developers Content Posting API and Login Kit.
              By linking your TikTok account, you grant us permission to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Retrieve your basic public profile and channel statistics.</li>
              <li>Publish video content that you explicitly choose and configure to your TikTok account.</li>
            </ul>
            <p className="mt-2">
              You may revoke these permissions at any time through your TikTok account privacy settings or through our platform dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. User Content &amp; Compliance</h2>
            <p>
              You retain all ownership rights to the content you create and upload. You agree that any content published through
              our platform complies with the TikTok Community Guidelines, applicable intellectual property laws, and our acceptable use policies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">5. Disclaimer of Warranties &amp; Limitation of Liability</h2>
            <p>
              The service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We are not liable for any indirect,
              incidental, or consequential damages resulting from your use of the service or third-party platform policies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:{" "}
              <span className="font-semibold text-gray-900">support@nguyen-video.vercel.app</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
