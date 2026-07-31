import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.log(`\n[EMAIL → ${to}] ${subject}\n${html.replace(/<[^>]+>/g, "")}\n`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || "TemplateFlow <noreply@localhost>",
    to,
    subject,
    html,
  });
}
