import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_LIMITS,
  CONTACT_SERVICES,
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/contact";
import { sendContactMessage } from "@/lib/contact.functions";
import { cn } from "@/lib/utils";
import { onContactPrefill } from "./contact-prefill";

export const CONTACT_EMAIL = "daniel.reis@futureai.consulting";

/** How long the service field stays highlighted after a prefill fills it in. */
const PREFILL_HIGHLIGHT_MS = 1400;
/** Upper bound for the smooth anchor scroll, for browsers without `scrollend`. */
const SCROLL_SETTLE_FALLBACK_MS = 1200;

const EMPTY: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  // Placeholder option; the schema rejects it until the visitor picks a real one.
  service: "" as ContactFormValues["service"],
  message: "",
  consent: false,
  website: "",
};

type Status = "idle" | "success" | "error" | "unavailable";

const fieldClass =
  "h-12 rounded-xl border-white/40 bg-white/[0.04] px-4 text-[0.95rem] text-white shadow-none transition-colors placeholder:text-white/55 hover:border-white/60 focus-visible:border-violet/70 focus-visible:ring-2 focus-visible:ring-violet/35 aria-[invalid=true]:border-red-300/60 md:text-sm";

/**
 * Runs `fn` once the page stops scrolling (the jump to #contato is a smooth scroll),
 * or after a fallback delay when no scroll happens. Returns a cancel function.
 */
function afterScrollSettles(fn: () => void) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cancel();
    fn();
  };
  const fallback = window.setTimeout(run, SCROLL_SETTLE_FALLBACK_MS);
  window.addEventListener("scrollend", run, { once: true });
  function cancel() {
    done = true;
    window.clearTimeout(fallback);
    window.removeEventListener("scrollend", run);
  }
  return cancel;
}

function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-xs text-red-300">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serviceHighlighted, setServiceHighlighted] = useState(false);
  // One id per form session: retries of the same message reuse it so Resend's
  // idempotency key drops duplicates; a new message after success gets a new one.
  const session = useRef<{ id: string; startedAt: number } | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const startSession = () => {
    session.current = { id: crypto.randomUUID(), startedAt: Date.now() };
  };

  useEffect(startSession, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });

  const messageLength = watch("message").length;

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  // Another section (a portfolio piece, the legal link) can hand the form a starting
  // point. The visitor's own choices always win: a service or message they already
  // gave is never replaced. Once the scroll to the form settles, focus moves to the
  // message and the service field flashes if it was filled in for them.
  useEffect(() => {
    let highlightTimer = 0;
    let cancelPending = () => {};
    const unsubscribe = onContactPrefill(({ service, message }) => {
      setStatus("idle");
      const fillService = !getValues("service");
      if (fillService) setValue("service", service, { shouldValidate: true });
      if (!getValues("message").trim()) setValue("message", message, { shouldDirty: true });

      cancelPending();
      cancelPending = afterScrollSettles(() => {
        const field = document.getElementById("contact-message");
        if (field instanceof HTMLTextAreaElement) {
          field.focus({ preventScroll: true });
          field.setSelectionRange(field.value.length, field.value.length);
        }
        if (!fillService) return;
        setServiceHighlighted(true);
        window.clearTimeout(highlightTimer);
        highlightTimer = window.setTimeout(
          () => setServiceHighlighted(false),
          PREFILL_HIGHLIGHT_MS,
        );
      });
    });
    return () => {
      unsubscribe();
      cancelPending();
      window.clearTimeout(highlightTimer);
    };
  }, [getValues, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (!session.current) startSession();
    const { id, startedAt } = session.current!;
    setStatus("idle");
    try {
      const result = await sendContactMessage({
        data: { ...values, submissionId: id, elapsedMs: Math.max(0, Date.now() - startedAt) },
      });
      if (result.ok) {
        setStatus("success");
        reset(EMPTY);
        startSession();
      } else {
        setStatus(result.reason === "unavailable" ? "unavailable" : "error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[26rem] flex-col items-start justify-center outline-none animate-in fade-in-0 duration-500 ease-out motion-safe:slide-in-from-bottom-2"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <h3 className="mt-6 text-2xl font-semibold">Mensagem recebida</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
          Obrigado pelo contato. Nossa equipe vai responder no e-mail que você informou.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-8">
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm text-white/70">
            Nome
          </label>
          <Input
            id="contact-name"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            placeholder="Seu nome"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClass}
            {...register("name")}
          />
          <FieldError id="contact-name-error" message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm text-white/70">
            E-mail corporativo
          </label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.email}
            placeholder="voce@empresa.com.br"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={fieldClass}
            {...register("email")}
          />
          <FieldError id="contact-email-error" message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-company" className="mb-2 block text-sm text-white/70">
            Empresa <span className="text-white/60">(opcional)</span>
          </label>
          <Input
            id="contact-company"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company}
            placeholder="Nome da empresa"
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? "contact-company-error" : undefined}
            className={fieldClass}
            {...register("company")}
          />
          <FieldError id="contact-company-error" message={errors.company?.message} />
        </div>
        <div>
          <label htmlFor="contact-service" className="mb-2 block text-sm text-white/70">
            Frente de interesse
          </label>
          <select
            id="contact-service"
            // `required` makes :invalid match the empty placeholder so it dims like
            // the other placeholders; the form's noValidate keeps native popups off.
            required
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={errors.service ? "contact-service-error" : undefined}
            className={cn(
              fieldClass,
              "flex w-full appearance-none border bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10 outline-none invalid:text-white/55",
              "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
              serviceHighlighted && "border-violet ring-2 ring-violet/40",
            )}
            {...register("service")}
          >
            <option value="" disabled className="bg-popover text-white/50">
              Selecione
            </option>
            {CONTACT_SERVICES.map((service) => (
              <option key={service} value={service} className="bg-popover text-foreground">
                {service}
              </option>
            ))}
          </select>
          <FieldError id="contact-service-error" message={errors.service?.message} />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <label htmlFor="contact-message" className="block text-sm text-white/70">
            Sobre o projeto
          </label>
          <span id="contact-message-hint" className="text-xs tabular-nums text-white/55">
            {messageLength < CONTACT_LIMITS.messageMin
              ? `Mínimo de ${CONTACT_LIMITS.messageMin} caracteres`
              : `${messageLength}/${CONTACT_LIMITS.message}`}
          </span>
        </div>
        <Textarea
          id="contact-message"
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          placeholder="Objetivo, público, canais, formatos e prazo que você tem em mente."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "contact-message-hint contact-message-error" : "contact-message-hint"
          }
          className={cn(fieldClass, "h-auto min-h-[8.5rem] resize-y py-3 leading-relaxed")}
          {...register("message")}
        />
        <FieldError id="contact-message-error" message={errors.message?.message} />
      </div>

      {/* Honeypot: off-screen and skipped by keyboard and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Site</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label htmlFor="contact-consent" className="flex cursor-pointer items-start gap-3">
          <input
            id="contact-consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-violet"
            {...register("consent")}
          />
          <span className="text-xs leading-relaxed text-white/65">
            Autorizo o uso destes dados apenas para que a Future AI Video Labs responda a este
            contato. Não usamos para newsletter.
          </span>
        </label>
        <FieldError id="contact-consent-error" message={errors.consent?.message} />
      </div>

      <div aria-live="polite">
        {status === "error" || status === "unavailable" ? (
          <p className="rounded-xl border border-red-300/25 bg-red-400/[0.07] px-4 py-3 text-sm text-red-200 animate-in fade-in-0 duration-300">
            {status === "unavailable"
              ? "O envio pelo site está indisponível no momento."
              : "Não foi possível enviar sua mensagem agora. Tente de novo em instantes."}{" "}
            Se preferir, escreva para{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary group w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:justify-self-start"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando
          </>
        ) : (
          <>
            Enviar mensagem
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
