import type { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";
import type { SocialLinks } from "./types";

export type SocialLink = { label: string; href: string; icon: IconType };

export function socialLinksFrom(links: SocialLinks): SocialLink[] {
  return [
    { label: "LinkedIn", href: links.linkedinUrl, icon: FaLinkedinIn },
    { label: "GitHub", href: links.githubUrl, icon: FiGithub },
    { label: "X", href: links.xUrl, icon: FaXTwitter },
    { label: "Instagram", href: links.instagramUrl, icon: FaInstagram },
  ];
}

/** Opens real profiles in a new tab; "#" placeholders stay on the page. */
export function externalProps(href: string) {
  return href && href !== "#" ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
