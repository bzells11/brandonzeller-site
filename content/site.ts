// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit this file to update the site.
// ─────────────────────────────────────────────────────────────

// Your main app's name. Change it here and it updates everywhere it appears.
export const MAIN_PROJECT_NAME = "WaitLess";

export type ProjectStatus = "Launching Soon" | "Prototype" | "In Development" | "Live";

export type Project = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  // Optional link to the live app, repo, or demo. Leave undefined to hide.
  href?: string;
  // Optional screenshot in /public/projects (e.g. "/projects/waitless.png").
  // Until you add one, a clean placeholder frame is shown.
  image?: string;
  // "feature" = the cover story. Use it for one project only.
  size: "feature" | "standard";
  // Paragraphs for the feature story. Optional.
  story?: string[];
};

export const site = {
  name: "Brandon Zeller",
  url: "https://brandonzeller.co",
  email: "brandonzeller01@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/brandon-z-701502390/",
    github: "https://github.com/bzells11",
  },
  resumePath: "/Brandon_Zeller_Resume.pdf",
  headshot: {
    src: "/headshot.jpg",
    alt: "Brandon Zeller in a grey suit against a blue studio backdrop",
    width: 944,
    height: 1104,
  },

  seo: {
    title: "Brandon Zeller",
    description:
      "Founder and builder studying Business Administration at Ohio State's Fisher College of Business. Building real products with AI.",
  },

  hero: {
    tagline: "Founder. Builder. Fisher '30.",
    location: "Columbus, OH",
    subline: "Business student at Ohio State building real products with AI.",
  },

  // The site is laid out like a magazine issue. Bump these whenever you like.
  issue: { number: "01", season: "Fall 2026" },

  about: [
    "I grew up in Syosset, Long Island, and I'm studying Business Administration at Ohio State's Fisher College of Business.",
    "I taught myself to code as a kid by building a game in Unity with C#. Now I design and ship full products using AI tools like Claude Code.",
    "Right now I'm most interested in where business and technology overlap, and in entrepreneurship.",
  ],

  // Quick facts shown next to the intro.
  facts: [
    { label: "Hometown", value: "Syosset, Long Island" },
    { label: "School", value: "Ohio State, Fisher College of Business" },
    { label: "Class of", value: "2030" },
    { label: "Based in", value: "Columbus, OH" },
  ],

  projects: [
    {
      id: "main-project",
      name: MAIN_PROJECT_NAME,
      description:
        "An iOS app that aggregates real-time urgent care wait times so people can find the fastest care nearby.",
      tags: ["React Native", "Expo", "Node.js", "Supabase", "Google Places API", "Claude AI"],
      status: "Launching Soon",
      size: "feature",
      story: [
        "Urgent care wait times are scattered across clinic websites, if they're even posted at all. WaitLess pulls them into one list and sorts the clinics near you by how long you'd actually wait.",
        "It's an iOS app built with React Native and Expo, with a Node.js and Supabase backend and the Google Places API for finding clinics nearby.",
      ],
    },
  ] satisfies Project[],

  experience: [
    {
      role: "Game Master",
      org: "RYCO's Escape Room & Lounge",
      location: "Westbury, NY",
      dates: "Apr 2026 – Present",
      summary:
        "Run live escape room sessions from a control room, monitoring camera feeds and giving players real-time hints.",
    },
    {
      role: "IT Technician",
      org: "Syosset High School IT Department",
      location: "Syosset, NY",
      dates: "Sep 2025 – Jun 2026",
      summary:
        "Diagnosed and repaired student and staff Chromebooks in a daily customer-facing support role.",
    },
    {
      role: "Video & Audio Technician",
      org: "Temple Or Elohim",
      location: "Jericho, NY",
      dates: "Oct 2024 – Jun 2026",
      summary: "Ran the weekly livestream, handling camera work and the audio mix.",
    },
    {
      role: "Junior Counselor",
      org: "Kenwal Day Camp",
      location: "Melville, NY",
      dates: "Summers 2024 & 2026",
      summary:
        "Mentored campers ages 6–9, including one-on-one support for a camper with special needs.",
    },
    {
      role: "Marketing Intern",
      org: "XZellerate Media",
      location: "Syosset, NY",
      dates: "Jun – Aug 2024",
      summary: "Helped run digital marketing campaigns and tracked how they performed.",
    },
  ],

  involvement: [
    { org: "Builders", detail: "Ohio State entrepreneurship program", role: "Member", dates: "2026 – Present" },
    { org: "Artificial Intelligence Club", detail: "Ohio State", role: "Member", dates: "2026 – Present" },
    { org: "Jewish Buckeyes in Business", detail: "Ohio State", role: "Member", dates: "2026 – Present" },
    { org: "Entrepreneurship Club", detail: "Syosset High School", role: "Treasurer", dates: "2025 – 2026" },
    { org: "DECA", detail: "Business & marketing competition", role: "Competitor", dates: "2024 – 2026" },
  ],

  honors: [
    { name: "Business Honors Society", issuer: "Syosset High School" },
    { name: "Claude Code 101", issuer: "Anthropic" },
    { name: "Business Management Certification", issuer: "YouScience" },
  ],

  beyond: {
    music: {
      title: "Music",
      body: "I produce music and play guitar. It's how I unwind and stay creative.",
      // Paste a Spotify or SoundCloud *embed* URL here to show a player, e.g.
      // "https://open.spotify.com/embed/track/XXXXXXXX" or
      // "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/you/track"
      embedUrl: "",
    },
    fitness: {
      title: "Fitness",
      body: "The gym keeps me disciplined. Same mindset I bring to building.",
    },
  },

  contact: {
    heading: "Get in touch.",
    copyright: "© 2026 Brandon Zeller",
  },
};
