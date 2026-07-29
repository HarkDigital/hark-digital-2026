// Serverless contact endpoint that emails the form submission via SendGrid.
//
// Deploy: this file lives outside `src/`, so Vite never bundles it and the app
// typecheck ignores it. On Vercel it is auto-detected as a serverless function
// at POST /api/contact. On Netlify, move it to `netlify/functions/contact.ts`
// and adjust the handler signature, or use the Vercel adapter.
//
// Required environment variables (set them in your host's dashboard):
//   SENDGRID_API_KEY   - your SendGrid API key (keep secret; never in the client)
//   CONTACT_TO_EMAIL   - where inquiries are delivered (default mike@hark.digital)
//   CONTACT_FROM_EMAIL - a verified SendGrid sender (default noreply@hark.digital)
//
// `req`/`res` are typed loosely so this template needs no @vercel/node install.

import sgMail from '@sendgrid/mail'

const esc = (s: string) =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const { name, email, company, service, message, website } = body

  // honeypot: real users never fill this; bots do
  if (website) return res.status(200).json({ ok: true })

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in your name, email, and message' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ error: 'That email address looks off' })
  }

  const key = process.env.SENDGRID_API_KEY
  const to = process.env.CONTACT_TO_EMAIL || 'mike@hark.digital'
  const from = process.env.CONTACT_FROM_EMAIL || 'noreply@hark.digital'
  if (!key) return res.status(500).json({ error: 'Email service is not configured' })

  sgMail.setApiKey(key)

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    service ? `Service: ${service}` : null,
    '',
    message,
  ].filter(Boolean)

  try {
    await sgMail.send({
      to,
      from,
      replyTo: String(email),
      subject: `New inquiry from ${name}${company ? ` · ${company}` : ''}`,
      text: lines.join('\n'),
      html: `
        <h2>New inquiry via hark.digital</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        ${company ? `<p><strong>Company:</strong> ${esc(company)}</p>` : ''}
        ${service ? `<p><strong>Service:</strong> ${esc(service)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${esc(message).replace(/\n/g, '<br>')}</p>
      `,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('SendGrid error', err)
    return res.status(502).json({ error: 'Could not send your message right now' })
  }
}
