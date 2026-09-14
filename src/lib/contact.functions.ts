import { createServerFn } from "@tanstack/react-start";

import { contactSchema } from "./contact";
import { handleContactSubmission } from "./contact.server";

// Safe to import from components: the Start compiler replaces the handler with
// an RPC stub in the client bundle, so contact.server.ts never ships to the browser.
export const sendContactMessage = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(({ data }) => handleContactSubmission(data));
