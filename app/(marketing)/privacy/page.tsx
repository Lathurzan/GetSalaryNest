import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";

const SECTIONS = [
  { id: "collect", title: "Information We Collect" },
  { id: "use", title: "How We Use Data" },
  { id: "cookies", title: "Cookies" },
  { id: "auth", title: "Authentication" },
  { id: "payment", title: "Payment Information" },
  { id: "third-party", title: "Third-party Services" },
  { id: "security", title: "Data Security" },
  { id: "rights", title: "Your Rights" },
  { id: "deletion", title: "Account Deletion" },
  { id: "contact", title: "Contact" },
];

export const metadata = { title: "Privacy Policy — SalaryNest" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 2026" sections={SECTIONS}>
      <LegalSection id="collect" title="Information We Collect">
        <p>
          We collect the information you provide when you create an account (name, email) and the
          financial data you enter — income, expenses, savings goals, and categories. We also
          collect basic technical information such as your browser type when you submit a bug
          report.
        </p>
      </LegalSection>

      <LegalSection id="use" title="How We Use Data">
        <p>
          We use your data to provide the service: to display your dashboard, generate reports,
          process subscriptions, and send account-related emails. We do not sell your personal
          information, and we do not show advertising based on your financial data.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>
          We use essential cookies to keep you signed in and to remember your preferences. With
          your consent, we may use analytics cookies to understand how the service is used. You can
          manage your cookie preferences at any time from the footer.
        </p>
      </LegalSection>

      <LegalSection id="auth" title="Authentication">
        <p>
          Sign-in is handled securely. Passwords are hashed and never stored in plain text. If you
          sign in with Google, we receive your name, email, and profile image from Google to create
          your account — we never see your Google password.
        </p>
      </LegalSection>

      <LegalSection id="payment" title="Payment Information">
        <p>
          Payments are processed by Stripe. Your card details are handled directly by Stripe and
          are never stored on our servers. We retain only a subscription reference needed to manage
          your plan.
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="Third-party Services">
        <p>We rely on a small number of trusted providers to operate SalaryNest:</p>
        <p>
          <strong className="text-[#0a1f1f] dark:text-white">Google Sign-In</strong> — optional
          authentication. Google verifies your email ownership.
        </p>
        <p>
          <strong className="text-[#0a1f1f] dark:text-white">Stripe</strong> — payment processing
          for Premium subscriptions.
        </p>
        <p>
          <strong className="text-[#0a1f1f] dark:text-white">Resend</strong> — delivery of
          account emails such as verification links.
        </p>
      </LegalSection>

      <LegalSection id="security" title="Data Security">
        <p>
          We take reasonable measures to protect your data, including encryption in transit and
          secure password hashing. No method of transmission or storage is completely secure, but
          we work to safeguard your information and limit access to it.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your Rights">
        <p>
          You have the right to access, correct, or delete your personal data. You can view and
          edit most of your information directly within the app, and you can export or remove your
          data at any time.
        </p>
      </LegalSection>

      <LegalSection id="deletion" title="Account Deletion">
        <p>
          You can permanently delete your account from your settings. This removes your expenses,
          income records, savings goals, categories, and account data from our database. This
          action is irreversible.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          For privacy questions or data requests, contact{" "}
          <a href="mailto:support@getsalarynest.com" className="text-teal-600 hover:underline dark:text-teal-400">
            support@getsalarynest.com
          </a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}