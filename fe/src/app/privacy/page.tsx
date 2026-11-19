import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Video AI Studio",
  description: "Privacy Policy and Data Protection practices for Video AI Studio",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 pb-5 mb-6">
          <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">
            &larr; Back to Video AI Studio
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: November 20, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. Overview</h2>
            <p>
              Video AI Studio (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services
              at <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700">https://nguyen-video.vercel.app</code>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Account Information:</strong> Basic profile information provided during authentication, such as username and email.
              </li>
              <li>
                <strong>TikTok Data:</strong> When you connect your TikTok account via official OAuth v2, we receive your public display name,
                avatar URL, open ID, follower counts, and OAuth access tokens required to perform video publishing operations on your behalf.
              </li>
              <li>
                <strong>User Generated Content:</strong> Videos and metadata you upload or configure to be published to your accounts.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>We strictly use the collected data to provide and improve our services, specifically to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Authenticate your identity and manage your connected channels.</li>
              <li>Publish video content that you explicitly command to your TikTok, Facebook, or YouTube accounts.</li>
              <li>Display channel performance metrics inside your creator dashboard.</li>
            </ul>
            <p className="mt-2 font-semibold text-gray-900">
              We NEVER sell, rent, or trade your personal information or TikTok account data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. Data Storage &amp; Security</h2>
            <p>
              We implement industry-standard security measures, including HTTPS encryption in transit and secure database storage
              for OAuth tokens. Tokens are securely encrypted and can be deleted immediately when you disconnect a channel.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">5. Data Retention &amp; Account Disconnection</h2>
            <p>
              You can revoke our access to your TikTok account at any time either by clicking &ldquo;Disconnect&rdquo; in the TikTok Studio
              dashboard or through your TikTok app security settings. Upon disconnection, your access tokens are permanently deleted from our servers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">6. Contact Information</h2>
            <p>
              If you have any questions or data deletion requests regarding this Privacy Policy, please reach out to us at:{" "}
              <span className="font-semibold text-gray-900">privacy@nguyen-video.vercel.app</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
