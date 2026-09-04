import Link from "next/link";
import { siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, WhatsappIcon, XIcon, YoutubeIcon } from "@/components/icons/social";

const items = [
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: siteConfig.social.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
  { href: siteConfig.social.x, label: "X (Twitter)", Icon: XIcon },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map(({ href, label, Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
        >
          <Icon className="size-5" />
        </Link>
      ))}
    </div>
  );
}
