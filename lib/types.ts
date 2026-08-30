export type SectionName =
  | "Home"
  | "About"
  | "Projects"
  | "Skills"
  | "Experience"
  | "Contact";

export interface NavLink {
  name: string;
  hash: string;
}

export interface SocialLinks {
  linkedinUrl: string;
  githubUrl: string;
  resumeUrl: string;
}

export interface IntroData {
  name: string;
  avatar: string;
  socialLinks: SocialLinks;
}

export interface AboutData {
  title: string;
  paragraphs: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string[] | readonly string[];
  imageUrl: string;
  imageAlt?: string;
  url: string;
  repo: string;
  year: string;
}

export interface ExperienceItem {
  title: string;
  location: string;
  description: string;
  icon: string;
  date: string;
}

export interface ContactData {
  contactEmail: string;
}
