import { Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            UIR PROBLEMES ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. We are fully compliant with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1.1 Information You Provide</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                We collect information that you voluntarily provide when using our platform:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Content you post (problems, forum threads, crush finder posts, chat messages)</li>
                <li>Comments and replies you submit</li>
                <li>Photos you upload (optional, for crush finder feature)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1.2 Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                We use browser local storage to store:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Your consent preferences</li>
                <li>Content you create (stored locally on your device)</li>
                <li>Temporary session data (pseudonyms for chat)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1.3 What We Do NOT Collect</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Personal identification information (name, email, phone number)</li>
                <li>IP addresses</li>
                <li>Cookies or tracking technologies</li>
                <li>Location data</li>
                <li>Device information</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            The information stored locally on your device is used solely to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Display your submitted content on the platform</li>
            <li>Enable interaction features (likes, comments, replies)</li>
            <li>Maintain anonymous chat sessions</li>
            <li>Remember your consent preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage and Security</h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              <strong>Local Storage:</strong> All data is stored locally in your browser's local storage. This means your data never leaves your device and is not transmitted to any external servers.
            </p>
            <p>
              <strong>No Server Storage:</strong> We do not operate any backend servers that store user data. The platform operates entirely in your browser.
            </p>
            <p>
              <strong>Data Security:</strong> Since data is stored locally, you maintain full control over it. You can clear it at any time by clearing your browser data or using the platform's features to delete specific content.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Anonymity and Pseudonymity</h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              We are committed to protecting your identity:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Problem submissions are completely anonymous</li>
              <li>Forum posts use randomly generated pseudonyms</li>
              <li>Chat participants receive random pseudonyms that change each session</li>
              <li>Crush finder posts are anonymous</li>
              <li>We do not track or link your activity across different features</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your GDPR Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Under GDPR, you have the following rights:
          </p>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">Right to Access</h3>
              <p className="text-gray-700">
                Since all data is stored locally on your device, you have direct access to it through your browser's developer tools or storage management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Right to Rectification</h3>
              <p className="text-gray-700">
                You can modify or delete your content at any time using the platform's features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Right to Erasure</h3>
              <p className="text-gray-700">
                You can delete all your data by clearing your browser's local storage for this site.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Right to Data Portability</h3>
              <p className="text-gray-700">
                Your data is stored in standard JSON format in local storage, which you can export at any time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Right to Object</h3>
              <p className="text-gray-700">
                You can decline data storage consent, though this will limit platform functionality.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
          <p className="text-gray-700 leading-relaxed">
            We do not use any third-party services, analytics, advertising networks, or external APIs. Your data is not shared with, sold to, or accessed by any third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            Data is retained in your browser's local storage indefinitely until you:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Clear your browser data</li>
            <li>Delete specific content using platform features</li>
            <li>Uninstall or reset your browser</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            This platform is intended for university students, typically 18 years or older. We do not knowingly collect information from individuals under 18. If you are under 18, please do not use this platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Content Guidelines and Moderation</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            While we respect anonymity, users are expected to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Not post illegal content</li>
            <li>Not share others' personal information without consent</li>
            <li>Not post harassing, threatening, or abusive content</li>
            <li>Not post sexually explicit content</li>
            <li>Respect the privacy and dignity of others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Photo Upload Guidelines</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            When using the Crush Finder photo upload feature:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Only upload photos you have the right to share</li>
            <li>Do not upload photos that violate someone's privacy</li>
            <li>Photos should be appropriate and respectful</li>
            <li>Photos are stored locally on your device only</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date at the top of this policy. Your continued use of the platform after any changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us through our Instagram page @UIR_PROBLEMES.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Consent</h2>
          <p className="text-gray-700 leading-relaxed">
            By using UIR PROBLEMES, you consent to this Privacy Policy and our data practices. You can withdraw consent at any time by clearing your browser data, though this will remove all your submitted content from your device.
          </p>
        </section>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
            <p className="text-sm text-gray-700">
              We designed UIR PROBLEMES with privacy at its core. Your data stays on your device, your identity remains protected, and you maintain complete control over your information. We believe in transparency and your right to privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
