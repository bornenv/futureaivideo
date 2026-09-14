import { Resend } from "resend";

import { MIN_FILL_MS, type ContactInput, type ContactResult } from "./contact";
import { buildConfirmationEmail, buildTeamEmail } from "./contact-email";

export const DEFAULT_CONTACT_TO = "daniel.reis@futureai.consulting";
// Must be on a domain verified in Resend; CONTACT_FROM_EMAIL overrides it.
export const DEFAULT_CONTACT_FROM = "Site FutureAI Video <contato@futureailabs.com>";

export type ContactConfig = {
  apiKey: string;
  from: string;
  to: string[];
  sendConfirmation: boolean;
};

type Env = Record<string, string | undefined>;

/**
 * Reads the server environment. In dev and on Node, TanStack Start loads `.env*`
 * into `process.env`; on Cloudflare Workers, Nitro exposes the bindings on
 * `globalThis.__env__`.
 */
export function serverEnv(): Env {
  const bindings = (globalThis as { __env__?: Record<string, unknown> }).__env__ ?? {};
  const env: Env = {};
  for (const [key, value] of Object.entries(bindings)) {
    if (typeof value === "string") env[key] = value;
  }
  return { ...env, ...process.env };
}

export function readContactConfig(
  env: Env,
): { ok: true; config: ContactConfig } | { ok: false; missing: string[] } {
  const get = (key: string) => env[key]?.trim() || undefined;

  const apiKey = get("RESEND_API_KEY");
  if (!apiKey) return { ok: false, missing: ["RESEND_API_KEY"] };

  const to = (get("CONTACT_TO_EMAIL") ?? DEFAULT_CONTACT_TO)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  return {
    ok: true,
    config: {
      apiKey,
      from: get("CONTACT_FROM_EMAIL") ?? DEFAULT_CONTACT_FROM,
      to,
      sendConfirmation: get("CONTACT_SEND_CONFIRMATION")?.toLowerCase() === "true",
    },
  };
}

/** The slice of the Resend SDK this module uses; tests pass a fake. */
export type EmailSender = Pick<Resend["emails"], "send">;

type Deps = {
  sender: EmailSender;
  config: ContactConfig;
  now?: () => Date;
  log?: Pick<Console, "info" | "warn" | "error">;
};

export async function deliverContactMessage(
  input: ContactInput,
  { sender, config, now = () => new Date(), log = console }: Deps,
): Promise<ContactResult> {
  // Spam heuristics fail silently: a bot gets the same success a person does.
  if (input.website.trim() !== "") {
    log.info(`[contact] dropped ${input.submissionId}: honeypot filled`);
    return { ok: true };
  }
  if (input.elapsedMs < MIN_FILL_MS) {
    log.info(`[contact] dropped ${input.submissionId}: submitted in ${input.elapsedMs}ms`);
    return { ok: true };
  }

  const team = buildTeamEmail(input, now());
  try {
    const { error } = await sender.send(
      {
        from: config.from,
        to: config.to,
        replyTo: input.email,
        subject: team.subject,
        html: team.html,
        text: team.text,
        tags: [{ name: "category", value: "contact_form" }],
      },
      { idempotencyKey: `contact-team/${input.submissionId}` },
    );
    if (error) {
      log.error(`[contact] Resend rejected ${input.submissionId}: ${error.name}: ${error.message}`);
      return { ok: false, reason: "failed" };
    }
  } catch (error) {
    log.error(`[contact] could not reach Resend for ${input.submissionId}`, error);
    return { ok: false, reason: "failed" };
  }

  if (config.sendConfirmation) {
    // Best effort: the team already has the message, so a failed
    // acknowledgement must not turn the visitor's submit into an error.
    const confirmation = buildConfirmationEmail();
    try {
      const { error } = await sender.send(
        {
          from: config.from,
          to: input.email,
          replyTo: config.to,
          subject: confirmation.subject,
          html: confirmation.html,
          text: confirmation.text,
          tags: [{ name: "category", value: "contact_confirmation" }],
        },
        { idempotencyKey: `contact-confirmation/${input.submissionId}` },
      );
      if (error) {
        log.warn(
          `[contact] confirmation for ${input.submissionId} not sent: ${error.name}: ${error.message}`,
        );
      }
    } catch (error) {
      log.warn(`[contact] confirmation for ${input.submissionId} not sent`, error);
    }
  }

  log.info(`[contact] delivered ${input.submissionId}`);
  return { ok: true };
}

export async function handleContactSubmission(input: ContactInput): Promise<ContactResult> {
  const result = readContactConfig(serverEnv());
  if (!result.ok) {
    console.error(`[contact] not configured, missing: ${result.missing.join(", ")}`);
    return { ok: false, reason: "unavailable" };
  }
  const { config } = result;
  return deliverContactMessage(input, { sender: new Resend(config.apiKey).emails, config });
}
