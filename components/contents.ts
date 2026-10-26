import { MAIN_PROJECT_NAME } from "@/content/site";

// The table of contents. Drives the cover's contents page, the nav, and each section's page number.
export const contents = {
  intro: { id: "intro", page: "02", label: "Intro", title: "In Brandon’s words" },
  feature: { id: "waitless", page: "04", label: "Feature", title: MAIN_PROJECT_NAME },
  work: { id: "work", page: "08", label: "Work", title: "Five jobs, in brief" },
  masthead: { id: "masthead", page: "12", label: "Clubs & Honors", title: "The masthead" },
  back: { id: "off-the-clock", page: "15", label: "Back Page", title: "Off the clock" },
  contact: { id: "contact", page: "16", label: "Letters", title: "Get in touch" },
} as const;
