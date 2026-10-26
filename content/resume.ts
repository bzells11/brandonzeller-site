// ─────────────────────────────────────────────────────────────
// Resume content for the /resume page. Keep it in sync with
// public/resume.pdf (the file people download).
// ─────────────────────────────────────────────────────────────

export type ResumeEntry = {
  org: string;
  title: string;
  location: string;
  dates: string;
  bullets: string[];
};

export const resume = {
  updated: "Fall 2026",

  education: [
    {
      org: "The Ohio State University, Max M. Fisher College of Business",
      title: "Bachelor of Science in Business Administration",
      location: "Columbus, OH",
      dates: "May 2030",
      bullets: [],
    },
    {
      org: "Syosset High School",
      title: "High School Diploma",
      location: "Syosset, NY",
      dates: "June 2026",
      bullets: ["Business Honors Society, recognized for academic excellence in business coursework."],
    },
  ] satisfies ResumeEntry[],

  work: [
    {
      org: "RYCO's Escape Room & Lounge",
      title: "Game Master",
      location: "Westbury, NY",
      dates: "April 2026 – Present",
      bullets: [
        "Welcome and introduce guests to the venue, setting the stage for an immersive escape room experience.",
        "Brief players on game storylines, rules, and objectives to ensure full engagement before each session.",
        "Operate a control room using live camera feeds and a microphone to monitor gameplay and deliver real-time hints.",
      ],
    },
    {
      org: "Syosset High School, IT Department",
      title: "IT Technician",
      location: "Syosset, NY",
      dates: "September 2025 – June 2026",
      bullets: [
        "Troubleshot and repaired student and staff Chromebooks, resolving both hardware and software issues.",
        "Handled a wide range of technology questions daily in a customer-facing support role.",
        "Built practical IT skills including device diagnostics, account management, and network basics.",
      ],
    },
    {
      org: "Temple Or Elohim",
      title: "Video and Audio Technician",
      location: "Jericho, NY",
      dates: "October 2024 – June 2026",
      bullets: [
        "Set up and operated audio/visual equipment to livestream temple services each week.",
        "Managed camera angles, sound levels, and streaming software to ensure high-quality broadcasts.",
        "Made services accessible to community members unable to attend in person.",
      ],
    },
    {
      org: "Kenwal Day Camp",
      title: "Junior Counselor",
      location: "Melville, NY",
      dates: "Summer 2024; Summer 2026",
      bullets: [
        "Supervised and mentored a group of children ages 6–9, creating a safe and engaging environment.",
        "Provided dedicated one-on-one support for a camper with special needs, ensuring inclusion and safety.",
        "Coordinated vehicle traffic at the camp entrance during arrival and dismissal periods.",
      ],
    },
    {
      org: "XZellerate Media",
      title: "Marketing Intern",
      location: "Syosset, NY",
      dates: "June 2024 – August 2024",
      bullets: [
        "Supported digital marketing campaigns, gaining hands-on experience in analytics and content strategy.",
        "Evaluated and compared software applications across multiple devices to inform team decisions.",
      ],
    },
  ] satisfies ResumeEntry[],

  activities: [
    {
      org: "Jewish Buckeyes in Business (JBIB)",
      title: "Member",
      location: "Columbus, OH",
      dates: "August 2026 – Present",
      bullets: ["Networking organization connecting Jewish business students with mentorship and career resources."],
    },
    {
      org: "Artificial Intelligence Club (AIC)",
      title: "Member",
      location: "Columbus, OH",
      dates: "August 2026 – Present",
      bullets: ["Student organization exploring artificial intelligence through workshops, projects, and speaker events."],
    },
    {
      org: "Syosset High School Entrepreneurship Club",
      title: "Treasurer",
      location: "Syosset, NY",
      dates: "September 2025 – June 2026",
      bullets: ["Managed club finances and supported event planning for member programming."],
    },
    {
      org: "DECA",
      title: "Member",
      location: "Syosset, NY",
      dates: "September 2024 – June 2026",
      bullets: ["Competed in a national business and marketing program."],
    },
  ] satisfies ResumeEntry[],

  additional: [
    { label: "Certifications", value: "Claude Code 101 (Anthropic), Business Management (YouScience)" },
    { label: "Technical", value: "Claude Code, IT support, Chromebook repair, A/V and livestream production, marketing tools" },
    { label: "Skills", value: "Communication, leadership, public speaking, problem solving, time management, financial analysis" },
    { label: "Interests", value: "Investing & finance, entrepreneurship, music production, debate, visual design & digital media" },
  ],
};
