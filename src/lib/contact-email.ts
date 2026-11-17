import type { ContactInput } from "./contact";

export type EmailContent = { subject: string; html: string; text: string };

const BRAND = "Future AI Studios";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapses whitespace so user input can't break a subject onto several lines. */
function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f4f3f7;font-family:Arial,Helvetica,sans-serif;color:#1d1b24;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#241c3d;padding:20px 28px;color:#ffffff;font-size:15px;font-weight:bold;letter-spacing:0.02em;">
                ${BRAND}
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#1d1b24;">${title}</h1>
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function row(label: string, valueHtml: string): string {
  return `<tr>
  <td style="padding:8px 16px 8px 0;vertical-align:top;font-size:13px;color:#6b6780;white-space:nowrap;">${label}</td>
  <td style="padding:8px 0;vertical-align:top;font-size:14px;color:#1d1b24;">${valueHtml}</td>
</tr>`;
}

/** Notification delivered to the team inbox; replying goes straight to the visitor. */
export function buildTeamEmail(input: ContactInput, receivedAt: Date): EmailContent {
  const name = singleLine(input.name);
  const company = singleLine(input.company);
  const subject = `Novo contato pelo site: ${name}${company ? ` (${company})` : ""}`;
  const when = formatDate(receivedAt);

  const html = layout(
    "Novo contato pelo site",
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
  ${row("Nome", escapeHtml(name))}
  ${row(
    "E-mail",
    `<a href="mailto:${escapeHtml(input.email)}" style="color:#5b3fd6;">${escapeHtml(input.email)}</a>`,
  )}
  ${row("Empresa", company ? escapeHtml(company) : `<span style="color:#9a96ab;">Não informada</span>`)}
  ${row("Frente", escapeHtml(input.service))}
</table>
<h2 style="margin:24px 0 8px;font-size:13px;font-weight:normal;color:#6b6780;">Mensagem</h2>
<div style="font-size:14px;line-height:1.6;white-space:pre-wrap;background:#f6f5fa;border-radius:8px;padding:14px 16px;">${escapeHtml(input.message)}</div>
<p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#9a96ab;">
  Recebido em ${escapeHtml(when)} (horário de Brasília) · ID ${escapeHtml(input.submissionId)}<br />
  Responda a este e-mail para falar direto com ${escapeHtml(name)}.
</p>`,
  );

  const text = [
    "Novo contato pelo site",
    "",
    `Nome: ${name}`,
    `E-mail: ${input.email}`,
    `Empresa: ${company || "Não informada"}`,
    `Frente: ${input.service}`,
    "",
    "Mensagem:",
    input.message,
    "",
    `Recebido em ${when} (horário de Brasília) · ID ${input.submissionId}`,
    `Responda a este e-mail para falar direto com ${name}.`,
  ].join("\n");

  return { subject, html, text };
}

/**
 * Acknowledgement sent to the visitor. It deliberately echoes none of the
 * submitted text: the recipient address is visitor-supplied, so any echoed
 * content would let the form relay arbitrary messages to arbitrary inboxes.
 */
export function buildConfirmationEmail(): EmailContent {
  const subject = `Recebemos sua mensagem · ${BRAND}`;
  const paragraphs = [
    "Olá,",
    `Obrigado pelo contato com a ${BRAND}. Recebemos sua mensagem e nossa equipe vai responder neste mesmo endereço de e-mail.`,
    "Se quiser complementar o briefing com referências, prazos ou materiais, basta responder a este e-mail.",
    `Equipe ${BRAND}`,
  ];

  const html = layout(
    "Recebemos sua mensagem",
    paragraphs
      .map((p) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;">${escapeHtml(p)}</p>`)
      .join("\n"),
  );

  return { subject, html, text: paragraphs.join("\n\n") };
}
