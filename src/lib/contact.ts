import { z } from "zod";

// Shared by the contact form (client validation) and the server function (the
// authoritative check). Keep user-facing messages in pt-BR.

export const CONTACT_SERVICES = [
  "Vídeos corporativos",
  "Marketing e campanhas",
  "Educação e treinamento",
  "Conteúdo de marca",
  "Avatares e personagens",
  "Consultoria e P&D",
  "Ainda não sei",
] as const;

export type ContactService = (typeof CONTACT_SERVICES)[number];

/** Submissions completed faster than this are almost certainly bots. */
export const MIN_FILL_MS = 3000;

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  message: 5000,
  messageMin: 20,
} as const;

/** Fields the visitor fills in (plus the hidden honeypot). */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(CONTACT_LIMITS.name, "Use no máximo 120 caracteres."),
  email: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.email, "E-mail longo demais.")
    .email("Informe um e-mail válido."),
  company: z.string().trim().max(CONTACT_LIMITS.company, "Use no máximo 160 caracteres."),
  service: z.enum(CONTACT_SERVICES, {
    errorMap: () => ({ message: "Escolha uma frente." }),
  }),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.messageMin,
      "Conte um pouco mais sobre o projeto (mínimo de 20 caracteres).",
    )
    .max(CONTACT_LIMITS.message, "Use no máximo 5000 caracteres."),
  consent: z.boolean().refine((v) => v, "É preciso autorizar o uso dos dados para responder."),
  // Honeypot: hidden from people, filled by naive bots. Accepted here so bots get
  // a normal-looking success response; the server drops the message silently.
  website: z.string().max(500),
});

/** Payload the server function receives. */
export const contactSchema = contactFormSchema.extend({
  /** Generated once per form session; doubles as the Resend idempotency key. */
  submissionId: z.string().uuid(),
  /** Milliseconds between the form mounting and the submit, measured on the client. */
  elapsedMs: z.number().int().nonnegative(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult = { ok: true } | { ok: false; reason: "unavailable" | "failed" };
