import type { ContactService } from "@/lib/contact";

// Lets another section (the portfolio dialog) hand the contact form a starting
// point without the two components sharing state.
const PREFILL_EVENT = "contact:prefill";

export type ContactPrefill = { service: ContactService; message: string };

export function prefillContact(detail: ContactPrefill) {
  window.dispatchEvent(new CustomEvent<ContactPrefill>(PREFILL_EVENT, { detail }));
}

/** Subscribes to prefill requests; returns the unsubscribe function. */
export function onContactPrefill(handler: (detail: ContactPrefill) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ContactPrefill>).detail);
  window.addEventListener(PREFILL_EVENT, listener);
  return () => window.removeEventListener(PREFILL_EVENT, listener);
}
