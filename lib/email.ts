import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.EMAIL_FROM ?? "SalaryNest <onboarding@resend.dev>";

export async function sendVerificationEmail(to: string, name: string, link: string) {
  const firstName = name?.split(" ")[0] ?? "there";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your SalaryNest account",
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
          <div style="width:32px;height:32px;border-radius:8px;background:#0f2b2b;color:#14b8a6;display:flex;align-items:center;justify-content:center;font-weight:bold">S</div>
          <span style="font-weight:600;color:#0a1f1f">SalaryNest</span>
        </div>
        <h1 style="font-size:20px;color:#0a1f1f;margin:0 0 12px">Verify your email</h1>
        <p style="color:#525252;font-size:14px;line-height:1.6;margin:0 0 24px">
          Hi ${firstName}, tap the button below to verify your account and start tracking your salary.
        </p>
        <a href="${link}" style="display:inline-block;background:#0f2b2b;color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600">
          Verify my email
        </a>
        <p style="color:#a3a3a3;font-size:12px;line-height:1.6;margin:24px 0 0">
          This link expires in 30 minutes. If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="color:#a3a3a3;font-size:12px;margin:12px 0 0;word-break:break-all">
          Or paste this link: ${link}
        </p>
      </div>
    `,
  });
}