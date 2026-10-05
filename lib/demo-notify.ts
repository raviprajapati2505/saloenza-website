const NOTIFY_EMAIL = 'anjumarshad07@gmail.com';

export interface DemoRequestInput {
  date: string;
  time: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  locations: string;
  notes: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function row(label: string, value: string): string {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value || '—');
  return `
    <tr>
      <td style="padding: 12px 16px; width: 160px; color: #6B7280; font-size: 13px; font-weight: 600; vertical-align: top; border-bottom: 1px solid #F3E8EE;">${safeLabel}</td>
      <td style="padding: 12px 16px; color: #24183F; font-size: 15px; vertical-align: top; border-bottom: 1px solid #F3E8EE;">${safeValue}</td>
    </tr>`;
}

export function buildDemoRequestEmail(input: DemoRequestInput): {
  subject: string;
  html: string;
  text: string;
} {
  const when = `${formatDate(input.date)} · ${input.time} IST`;
  const subject = `New demo request — ${input.businessName} — ${input.date} ${input.time}`;
  const notesBlock = input.notes
    ? `
      <tr>
        <td colspan="2" style="padding: 16px; color: #24183F; font-size: 15px; line-height: 1.5;">
          <div style="font-size: 13px; font-weight: 600; color: #6B7280; margin-bottom: 6px;">Notes</div>
          ${escapeHtml(input.notes).replace(/\n/g, '<br>')}
        </td>
      </tr>`
    : '';

  const html = `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: #F7F4F6; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #F7F4F6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #F3E8EE;">
          <tr>
            <td style="background: #24183F; padding: 22px 24px;">
              <div style="color: #d50d65; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; letter-spacing: 0.14em; font-weight: 700;">SALOENZA</div>
              <div style="color: #ffffff; font-size: 22px; margin-top: 6px;">New demo request</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 24px 8px; color: #374151; font-size: 15px; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
              Someone asked for a 30-minute product walkthrough. Details from the booking form are below.
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 24px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #F3E8EE; border-radius: 12px; overflow: hidden; font-family: Arial, Helvetica, sans-serif;">
                ${row('Requested time', when)}
                ${row('Name', input.fullName)}
                ${row('Salon / business', input.businessName)}
                ${row('Email', input.email)}
                ${row('Phone', input.phone)}
                ${row('Locations', input.locations)}
                ${notesBlock}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    'New Saloenza demo request',
    '',
    `Requested time: ${when}`,
    `Name: ${input.fullName}`,
    `Salon / business: ${input.businessName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Locations: ${input.locations}`,
    input.notes ? `Notes: ${input.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

export async function sendDemoRequestEmail(input: DemoRequestInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.MAIL_FROM_ADDRESS?.trim();

  if (!apiKey || !fromEmail) {
    throw new Error('Email is not configured.');
  }

  const { subject, html, text } = buildDemoRequestEmail(input);
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Saloenza', email: fromEmail },
      to: [{ email: NOTIFY_EMAIL, name: 'Saloenza' }],
      replyTo: { email: input.email, name: input.fullName },
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo rejected the message (${response.status}).`);
  }
}
