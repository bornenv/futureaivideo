import { describe, expect, it } from "vitest";

import type { ContactInput } from "./contact";
import { buildConfirmationEmail, buildTeamEmail, escapeHtml } from "./contact-email";

const input: ContactInput = {
  name: "Ana Souza",
  email: "ana@empresa.com.br",
  company: "Empresa SA",
  service: "Educação e treinamento",
  message: "Linha 1\nLinha 2 com trilha de onboarding.",
  consent: true,
  website: "",
  submissionId: "3f2b8c1e-7d4a-4e6b-9c2f-1a2b3c4d5e6f",
  elapsedMs: 9000,
};

// 2026-09-11 14:30 UTC = 11:30 in São Paulo (UTC-3).
const receivedAt = new Date("2026-09-11T14:30:00Z");

describe("escapeHtml", () => {
  it("escapes every HTML-significant character", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    );
  });
});

describe("buildTeamEmail", () => {
  it("summarises the lead in the subject", () => {
    expect(buildTeamEmail(input, receivedAt).subject).toBe(
      "Novo contato pelo site: Ana Souza (Empresa SA)",
    );
  });

  it("omits the company from the subject when not given", () => {
    const { subject, text } = buildTeamEmail({ ...input, company: "" }, receivedAt);
    expect(subject).toBe("Novo contato pelo site: Ana Souza");
    expect(text).toContain("Empresa: Não informada");
  });

  it("keeps the subject on one line even if the name has line breaks", () => {
    const { subject } = buildTeamEmail({ ...input, name: "Ana\r\nBcc: x@y.z" }, receivedAt);
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it("includes every field and the Brasília timestamp in both bodies", () => {
    const { html, text } = buildTeamEmail(input, receivedAt);
    for (const body of [html, text]) {
      expect(body).toContain("Ana Souza");
      expect(body).toContain("ana@empresa.com.br");
      expect(body).toContain("Empresa SA");
      expect(body).toContain("Educação e treinamento");
      expect(body).toContain(input.submissionId);
      expect(body).toContain("11:30");
    }
    expect(text).toContain(input.message);
    expect(html).toContain('href="mailto:ana@empresa.com.br"');
  });

  it("escapes visitor input in the HTML body", () => {
    const { html } = buildTeamEmail(
      {
        ...input,
        name: "<script>alert(1)</script>",
        company: '"><img src=x onerror=alert(1)>',
        message: "<b>negrito</b> & <i>itálico</i>",
      },
      receivedAt,
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<b>negrito</b>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("&lt;b&gt;negrito&lt;/b&gt; &amp; &lt;i&gt;itálico&lt;/i&gt;");
  });
});

describe("buildConfirmationEmail", () => {
  it("is in pt-BR, without exclamation marks", () => {
    const { subject, html, text } = buildConfirmationEmail();
    expect(subject).toContain("Recebemos sua mensagem");
    expect(html).toContain('lang="pt-BR"');
    expect(`${subject}${text}`).not.toContain("!");
  });

  it("takes no visitor input, so it can't relay arbitrary content", () => {
    expect(buildConfirmationEmail.length).toBe(0);
  });
});
