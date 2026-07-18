import { Resend } from "resend";

export interface EmailProvider {
  addToAudience(email: string): Promise<void>;
  sendDownloadEmail(opts: {
    to: string;
    artTitle: string;
    downloadUrl: string;
  }): Promise<void>;
  sendWelcomeEmail(to: string): Promise<void>;
}

const FROM = process.env.EMAIL_FROM || "The Pixel Prince <hello@thepixelprince.com>";

function resendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  return new Resend(key);
}

export const emailProvider: EmailProvider = {
  async addToAudience(email) {
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) throw new Error("RESEND_AUDIENCE_ID not configured");
    await resendClient().contacts.create({ email, audienceId, unsubscribed: false });
  },

  async sendDownloadEmail({ to, artTitle, downloadUrl }) {
    await resendClient().emails.send({
      from: FROM,
      to,
      subject: `Your free print: ${artTitle}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2a2a2a;">
          <h1 style="font-size: 24px;">Your download is ready</h1>
          <p><strong>${artTitle}</strong> is waiting for you.</p>
          <p style="margin: 28px 0;">
            <a href="${downloadUrl}"
               style="background:#4a7bc7;color:#fff;padding:14px 28px;border-radius:16px;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-weight:bold;">
              Download your print
            </a>
          </p>
          <p style="font-size: 13px; color: #6b6b6b;">This link works for 72 hours. Personal use only — see the license note included with your file.</p>
          <p style="font-size: 13px; color: #6b6b6b;">— Kenny, The Pixel Prince<br/>
            <a href="https://thepixelprince.etsy.com?utm_source=pixelprince&utm_medium=email&utm_campaign=download">Printed versions on Etsy</a></p>
        </div>`,
    });
  },

  async sendWelcomeEmail(to) {
    await resendClient().emails.send({
      from: FROM,
      to,
      subject: "Welcome — here's how the free prints work",
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2a2a2a;">
          <h1 style="font-size: 24px;">Hey, I'm Kenny</h1>
          <p>I design retro gaming and map wall art — every piece drawn by an actual human.</p>
          <p>Here's the deal: <strong>one email a month</strong> with a brand-new free print, plus whatever's new in the shop. That's it. No spam.</p>
          <p>
            <a href="https://thepixelprince.etsy.com?utm_source=pixelprince&utm_medium=email&utm_campaign=welcome">Browse printed prints</a> ·
            <a href="https://pixelprinceprintable.etsy.com?utm_source=pixelprince&utm_medium=email&utm_campaign=welcome">Printable bundles</a>
          </p>
          <p style="font-size: 13px; color: #6b6b6b;">— Kenny, The Pixel Prince</p>
        </div>`,
    });
  },
};
