import Header from "@/components/Header";
import Footers from "@/components/Footers";

const PrivacyPolicy = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header isHome={false} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        <div className="flex-1 flex items-center justify-center py-10 flex-col">
          <p className="text-center font-black text-4xl text-black dark:text-white">
            Privacy Policy
          </p>
          <div className="md:w-2/4  xs:w-full mx-4 py-10 text-justify text-black dark:text-white">
            <div className="text-black dark:text-white">
              <p>
                At Cehpoint, protecting your privacy is our priority. This
                privacy policy outlines how we handle and protect your personal
                information when you authenticate with Google Auth credentials
                to interact with Google Gemini AI within our services.
              </p>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                1. Information We Collect
              </h2>
              <p>
                When you use Google Auth to access Cehpoint services integrated
                with Google Gemini AI, we may collect and store the following
                information:
              </p>
              <ul>
                <li>
                  <strong>Google Account Information:</strong> When you log in
                  via Google Auth, we may collect your name, email address, and
                  unique user ID associated with your Google account.
                </li>
                <li>
                  <strong>Authentication Tokens:</strong> We store secure
                  authentication tokens to maintain your session.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information related to how you
                  interact with Cehpoint services and Google Gemini AI,
                  including timestamps and AI-generated outputs.
                </li>
              </ul>
              <p>
                We do not access or store any other personal data from your
                Google account unless explicitly permitted by you.
              </p>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                2. How We Use Your Information
              </h2>
              <p>We use the information collected to:</p>
              <ul>
                <li>
                  <strong>Authenticate Users:</strong> Verify your identity
                  through Google Auth for secure access to Cehpoint services and
                  Google Gemini AI.
                </li>
                <li>
                  <strong>Provide Services:</strong> Facilitate interactions
                  between your Google Auth credentials and Google Gemini AI to
                  deliver personalized, AI-driven features.
                </li>
                <li>
                  <strong>Improve User Experience:</strong> Analyze usage data
                  to enhance Cehpoint's services and the integration with Google
                  Gemini AI.
                </li>
              </ul>
              <p>
                We will never sell or share your personal information with third
                parties without your consent, except as required by law or as
                necessary to provide the service (e.g., sharing with Google for
                authentication purposes).
              </p>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                3. Data Sharing and Disclosure
              </h2>
              <p>
                We may share your Google Auth data in the following
                circumstances:
              </p>
              <ul>
                <li>
                  <strong>With Google:</strong> For authentication purposes and
                  to ensure the proper functioning of Google Gemini AI.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your data
                  if required to do so by law or in response to a valid request
                  from regulatory authorities.
                </li>
              </ul>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                4. Data Security
              </h2>
              <p>
                We take reasonable steps to protect the personal information we
                collect from unauthorized access, disclosure, alteration, or
                destruction. Security measures include:
              </p>
              <ul>
                <li>
                  <strong>Encryption:</strong> All Google Auth credentials and
                  sensitive data are encrypted both in transit and at rest.
                </li>
                <li>
                  <strong>Access Control:</strong> Access to personal data is
                  restricted to authorized Cehpoint personnel who need it to
                  perform their job functions.
                </li>
                <li>
                  <strong>Regular Audits:</strong> We regularly audit our
                  systems to identify potential vulnerabilities and improve our
                  security practices.
                </li>
              </ul>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                5. Data Retention
              </h2>
              <p>
                We retain your Google Auth data only for as long as necessary to
                provide you with our services or comply with legal obligations.
                After this period, your personal data will be securely deleted.
              </p>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                6. User Control and Data Rights
              </h2>
              <p>
                You have the following rights regarding your personal
                information:
              </p>
              <ul>
                <li>
                  <strong>Access and Update:</strong> You can access and update
                  your Google Auth information through your Cehpoint account
                  settings.
                </li>
                <li>
                  <strong>Data Deletion:</strong> You may request the deletion
                  of your Google Auth credentials from our systems by contacting
                  us.
                </li>
                <li>
                  <strong>Withdrawal of Consent:</strong> You may revoke your
                  consent to use Google Auth at any time, but this may affect
                  your ability to use certain features of Cehpoint services.
                </li>
              </ul>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                7. Changes to This Policy
              </h2>
              <p>
                Cehpoint may update this privacy policy from time to time. If
                any significant changes are made, we will notify you via email
                or a prominent notice on our platform.
              </p>
              <h2 className="font-black text-2xl text-black dark:text-white pt-4">
                8. Contact Information
              </h2>
              <p>
                For any questions or concerns about this privacy policy, or to
                exercise your data rights, please contact us at:
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:jit@cehpoint.co.in">jit@cehpoint.co.in</a>
              </p>
              <p>
                <strong>Address:</strong> Labpur, Birbhum 731303
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default PrivacyPolicy;
