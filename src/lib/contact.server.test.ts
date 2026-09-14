import { describe, expect, it, vi } from "vitest";

import type { ContactInput } from "./contact";
import {
  DEFAULT_CONTACT_FROM,
  DEFAULT_CONTACT_TO,
  deliverContactMessage,
  readContactConfig,
  type ContactConfig,
  type EmailSender,
} from "./contact.server";

const input: ContactInput = {
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

const config: ContactConfig = {
  apiKey: "re_test",
  from: "Future AI Video Labs <contato@futureai.consulting>",
  to: ["daniel.reis@futureai.consulting"],
  sendConfirmation: false,
};

type SendResult = Awaited<ReturnType<EmailSender["send"]>>;
const ok = { data: { id: "email_123" }, error: null, headers: null } as SendResult;
const rejected = {
  data: null,
  error: { name: "validation_error", message: "Invalid `from` field.", statusCode: 422 },
  headers: null,
} as SendResult;

function fakeSender(...results: Array<SendResult | Error>) {
  const send = vi.fn(async () => {
    const next = results.shift() ?? ok;
    if (next instanceof Error) throw next;
    return next;
  });
  return { sender: { send } as unknown as EmailSender, send };
}

function silentLog() {
  return { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
}

const now = () => new Date("2026-09-11T14:30:00Z");

describe("deliverContactMessage", () => {
  it("sends the team notification with the visitor as reply-to", async () => {
    const { sender, send } = fakeSender();
    const result = await deliverContactMessage(input, { sender, config, now, log: silentLog() });

    expect(result).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: config.from,
        to: config.to,
        replyTo: "ana@empresa.com.br",
        subject: "Novo contato pelo site: Ana Souza (Empresa SA)",
        html: expect.stringContaining("Precisamos de 30 variações"),
        text: expect.stringContaining("Precisamos de 30 variações"),
      }),
      { idempotencyKey: `contact-team/${input.submissionId}` },
    );
  });

  it("drops a filled honeypot silently, without sending", async () => {
    const { sender, send } = fakeSender();
    const result = await deliverContactMessage(
      { ...input, website: "http://spam.example" },
      { sender, config, now, log: silentLog() },
    );
    expect(result).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("drops submissions completed faster than a person could type", async () => {
    const { sender, send } = fakeSender();
    const result = await deliverContactMessage(
      { ...input, elapsedMs: 800 },
      { sender, config, now, log: silentLog() },
    );
    expect(result).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports failure when Resend rejects the email", async () => {
    const { sender } = fakeSender(rejected);
    const log = silentLog();
    const result = await deliverContactMessage(input, { sender, config, now, log });
    expect(result).toEqual({ ok: false, reason: "failed" });
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining("Invalid `from` field."));
  });

  it("reports failure when Resend can't be reached", async () => {
    const { sender } = fakeSender(new Error("fetch failed"));
    const result = await deliverContactMessage(input, { sender, config, now, log: silentLog() });
    expect(result).toEqual({ ok: false, reason: "failed" });
  });

  it("sends a confirmation to the visitor when enabled", async () => {
    const { sender, send } = fakeSender();
    const result = await deliverContactMessage(input, {
      sender,
      config: { ...config, sendConfirmation: true },
      now,
      log: silentLog(),
    });
    expect(result).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenLastCalledWith(
      expect.objectContaining({
        to: "ana@empresa.com.br",
        replyTo: config.to,
        subject: expect.stringContaining("Recebemos sua mensagem"),
      }),
      { idempotencyKey: `contact-confirmation/${input.submissionId}` },
    );
  });

  it("still succeeds when only the confirmation fails", async () => {
    for (const failure of [rejected, new Error("fetch failed")]) {
      const { sender, send } = fakeSender(ok, failure);
      const log = silentLog();
      const result = await deliverContactMessage(input, {
        sender,
        config: { ...config, sendConfirmation: true },
        now,
        log,
      });
      expect(result).toEqual({ ok: true });
      expect(send).toHaveBeenCalledTimes(2);
      expect(log.warn).toHaveBeenCalled();
    }
  });

  it("does not send a confirmation when the team email failed", async () => {
    const { sender, send } = fakeSender(rejected);
    await deliverContactMessage(input, {
      sender,
      config: { ...config, sendConfirmation: true },
      now,
      log: silentLog(),
    });
    expect(send).toHaveBeenCalledTimes(1);
  });
});

describe("readContactConfig", () => {
  it("reports a missing API key", () => {
    expect(readContactConfig({})).toEqual({ ok: false, missing: ["RESEND_API_KEY"] });
    expect(readContactConfig({ RESEND_API_KEY: "   " })).toEqual({
      ok: false,
      missing: ["RESEND_API_KEY"],
    });
  });

  it("falls back to the public inbox and Resend's sandbox sender", () => {
    expect(readContactConfig({ RESEND_API_KEY: "re_123" })).toEqual({
      ok: true,
      config: {
        apiKey: "re_123",
        from: DEFAULT_CONTACT_FROM,
        to: [DEFAULT_CONTACT_TO],
        sendConfirmation: false,
      },
    });
  });

  it("reads overrides, splitting a comma-separated recipient list", () => {
    const result = readContactConfig({
      RESEND_API_KEY: "re_123",
      CONTACT_FROM_EMAIL: "Future AI <contato@futureai.consulting>",
      CONTACT_TO_EMAIL: "a@futureai.consulting, b@futureai.consulting,",
      CONTACT_SEND_CONFIRMATION: "TRUE",
    });
    expect(result).toEqual({
      ok: true,
      config: {
        apiKey: "re_123",
        from: "Future AI <contato@futureai.consulting>",
        to: ["a@futureai.consulting", "b@futureai.consulting"],
        sendConfirmation: true,
      },
    });
  });
});

// Live check against the real Resend API. Runs only when RESEND_API_KEY is set
// (e.g. in .env.local); sends to Resend's test inbox, which accepts mail from
// the sandbox sender and never reaches a real person.
describe.skipIf(!process.env["RESEND_API_KEY"])("Resend (live)", () => {
  it("delivers the team notification and confirmation", async () => {
    const { Resend } = await import("resend");
    const apiKey = process.env["RESEND_API_KEY"]!;
    const log = silentLog();
    const result = await deliverContactMessage(
      { ...input, email: "delivered@resend.dev", submissionId: crypto.randomUUID() },
      {
        sender: new Resend(apiKey).emails,
        config: {
          apiKey,
          from: process.env["CONTACT_FROM_EMAIL"] ?? DEFAULT_CONTACT_FROM,
          to: ["delivered@resend.dev"],
          sendConfirmation: true,
        },
        log,
      },
    );
    expect(log.error.mock.calls).toEqual([]);
    expect(log.warn.mock.calls).toEqual([]);
    expect(result).toEqual({ ok: true });
  }, 20_000);
});
