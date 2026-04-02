import { CONFERENCE_KEY } from "@/app/constants";

export function setConferenceCookie(value: string) {
  document.cookie = `${CONFERENCE_KEY}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}
