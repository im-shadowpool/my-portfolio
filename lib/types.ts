export type SectionName =
  | "Home"
  | "About"
  | "Projects"
  | "Skills"
  | "Experience"
  | "Contact";


export interface SocialLinks {
  linkedinUrl: string;
  githubUrl: string;
  codepenUrl: string;
  /** "#" until the profile exists. */
  xUrl: string;
  instagramUrl: string;
  resumeUrl: string;
}

export interface IntroData {
  name: string;
  avatar: string;
  /** Illustrated version the portrait switches to on click. */
  avatarTwin: string;
  tagline: string;
  roles: string[];
  location: string;
  website: string;
  githubUsername: string;
  socialLinks: SocialLinks;
}

export interface AboutData {
  title: string;
  headline: string;
  paragraphs: string[];
  location: string;
  currently: { role: string; company: string; since: string };
  stat: { from: number; to: number; unit: string; label: string };
  learning: string[];
  offscreen: { hobbies: string[]; reading: string; favourite: string };
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string[] | readonly string[];
  imageUrl: string;
  imageAlt?: string;
  url: string;
  repo?: string;
  year: string;
  featured?: boolean;
  badge?: string;
}

export interface SkillGroup {
  group: string;
  note: string;
  items: string[];
}

export interface ExperienceItem {
  title: string;
  location: string;
  description: string;
  points?: string[];
  icon: string;
  logo?: string;
  date: string;
}

export interface ContactData {
  contactEmail: string;
}

export interface NowData {
  /** ISO date the page was last brought up to date. */
  updated: string;
  items: { label: string; glyph: string; text: string }[];
}
