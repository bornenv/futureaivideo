import { describe, expect, it } from "vitest";

import { contactFormSchema, contactSchema, type ContactInput } from "./contact";

const valid: ContactInput = {
  name: "Ana Souza",
  email: "ana@empresa.com.br",
  company: "Empresa SA",
  service: "Marketing e campanhas",
  message: "Precisamos de 30 variações de um vídeo de campanha para redes sociais.",
  consent: true,
  website: "",
  submissionId: "3f2b8c1e-7d4a-4e6b-9c2f-1a2b3c4d5e6f",
  elapsedMs: 12000,
};

function issuesFor(input: unknown) {
  const result = contactSchema.safeParse(input);
  if (result.success) return {};
  return result.error.flatten().fieldErrors;
}

describe("contactSchema", () => {
  it("accepts a complete submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("trims text fields", () => {
    const parsed = contactSchema.parse({
      ...valid,
      name: "  Ana Souza  ",
      email: " ana@empresa.com.br ",
      message: `  ${valid.message}  `,
    });
    expect(parsed.name).toBe("Ana Souza");
    expect(parsed.email).toBe("ana@empresa.com.br");
    expect(parsed.message).toBe(valid.message);
  });

  it("allows an empty company", () => {
    expect(contactSchema.safeParse({ ...valid, company: "" }).success).toBe(true);
  });

  it.each([
    ["name", { name: "A" }, "Informe seu nome."],
    ["email", { email: "ana@" }, "Informe um e-mail válido."],
    ["service", { service: "" }, "Escolha uma frente."],
    ["service", { service: "Outra coisa" }, "Escolha uma frente."],
    ["message", { message: "curta" }, "Conte um pouco mais"],
    ["message", { message: "x".repeat(5001) }, "Use no máximo 5000 caracteres."],
    ["consent", { consent: false }, "É preciso autorizar"],
  ] as const)("rejects an invalid %s with a pt-BR message", (field, patch, message) => {
    const errors = issuesFor({ ...valid, ...patch }) as Record<string, string[] | undefined>;
    expect(errors[field]?.[0]).toContain(message);
  });

  it("rejects whitespace-only required fields", () => {
    const errors = issuesFor({ ...valid, name: "   ", message: " ".repeat(40) });
    expect(errors.name).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("requires a UUID submission id and a non-negative elapsed time", () => {
    const errors = issuesFor({ ...valid, submissionId: "abc", elapsedMs: -1 });
    expect(errors.submissionId).toBeDefined();
    expect(errors.elapsedMs).toBeDefined();
  });

  it("still accepts a filled honeypot so bots get a normal response", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(
      true,
    );
  });
});

describe("contactFormSchema", () => {
  it("validates the visitor-facing fields without the transport metadata", () => {
    const { submissionId: _id, elapsedMs: _ms, ...form } = valid;
    expect(contactFormSchema.safeParse(form).success).toBe(true);
  });
});
