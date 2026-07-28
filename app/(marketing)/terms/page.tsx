import LegalLayout, {LegalSection} from "@/components/legal/LegalLayout";

const SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "account", title: "Account Responsibilities" },
  { id: "acceptable", title: "Acceptable Use" },
  { id: "subscriptions", title: "Subscriptions" },
  { id: "payments", title: "Payments" },
  { id: "refunds", title: "Refund Policy" },
  { id: "termination", title: "Account Termination" },
  { id: "ip", title: "Intellectual Property" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "contact", title: "Contact" },
];

export const metadata = { title: "Terms of Service — SalaryNest" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="July 2026" sections={SECTIONS}>
      <LegalSection id="intro" title="Introduction">
        <p>
          Welcome to SalaryNest. These Terms of Service govern your access to and use of the
          SalaryNest application and services. By creating an account or using SalaryNest, you
          agree to these terms. If you do not agree, please do not use the service.
        </p>
      </LegalSection>

      <LegalSection id="account" title="Account Responsibilities">
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activity that occurs under your account. You agree to provide accurate
          information and to keep it up to date. You must notify us promptly of any unauthorised
          use of your account.
        </p>
        <p>You must be at least 16 years old to use SalaryNest.</p>
      </LegalSection>

      <LegalSection id="acceptable" title="Acceptable Use">
        <p>
          You agree not to misuse the service, including attempting to access it through
          unauthorised means, interfering with its normal operation, or using it for any unlawful
          purpose. You retain ownership of the financial data you enter; you are responsible for
          its accuracy.
        </p>
      </LegalSection>

      <LegalSection id="subscriptions" title="Subscriptions">
        <p>
          SalaryNest offers a free plan and a paid Premium plan. Premium is billed on a monthly or
          annual basis. Your subscription renews automatically until cancelled. You may cancel at
          any time from your billing settings, and access continues until the end of the current
          billing period.
        </p>
      </LegalSection>

      <LegalSection id="payments" title="Payments">
        <p>
          Payments are processed securely by Stripe. We do not store your full card details on our
          servers. By subscribing, you authorise us to charge your payment method for the
          applicable fees. Prices are shown in GBP and may change with notice.
        </p>
      </LegalSection>

      <LegalSection id="refunds" title="Refund Policy">
        <p>
          Monthly subscriptions may be refunded within 7 days of the initial charge if you have
          not made substantial use of Premium features. Annual subscriptions may be refunded
          within 14 days of purchase. Renewal charges are generally non-refundable. To request a
          refund, contact support.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="Account Termination">
        <p>
          You may delete your account at any time from your settings, which permanently removes
          your data. We may suspend or terminate accounts that violate these terms. Upon
          termination, your right to use the service ends immediately.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="Intellectual Property">
        <p>
          SalaryNest, including its design, branding, and software, is owned by us and protected by
          intellectual property laws. These terms do not grant you any right to use our trademarks
          or content except as necessary to use the service.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="Limitation of Liability">
        <p>
          SalaryNest is a personal finance tracking tool and does not provide financial, tax, or
          investment advice. The service is provided "as is." To the fullest extent permitted by
          law, we are not liable for any indirect or consequential damages arising from your use of
          the service, or for decisions made based on information within it.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          For questions about these terms, contact us at{" "}
          <a href="mailto:support@getsalarynest.com" className="text-teal-600 hover:underline dark:text-teal-400">
            support@getsalarynest.com
          </a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}