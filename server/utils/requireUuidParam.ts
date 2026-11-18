import type { H3Event } from "h3";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requireUuidParam(event: H3Event, name = "id") {
  const value = getRouterParam(event, name);
  if (!value || !UUID_RE.test(value)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }
  return value;
}