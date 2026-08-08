type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.32C16.3 4.22 15.4 4.15 14.36 4.15c-2.15 0-3.62 1.31-3.62 3.72V10.5H8.25v3h2.49V21h2.76Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.34c0-3.07-1.64-4.5-3.83-4.5-1.77 0-2.56.97-3 1.65V8.5H10.2c.04.86 0 11.5 0 11.5h2.97v-6.43c0-.34.02-.68.12-.93.27-.68.9-1.38 1.94-1.38 1.37 0 1.92 1.04 1.92 2.57V20H20v-6.66Z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.6a2.9 2.9 0 0 0-2.05-2.06C17.8 5.1 12 5.1 12 5.1s-5.8 0-7.55.44A2.9 2.9 0 0 0 2.4 7.6 30.3 30.3 0 0 0 2 12a30.3 30.3 0 0 0 .4 4.4 2.9 2.9 0 0 0 2.05 2.06C6.2 18.9 12 18.9 12 18.9s5.8 0 7.55-.44a2.9 2.9 0 0 0 2.05-2.06A30.3 30.3 0 0 0 22 12a30.3 30.3 0 0 0-.4-4.4ZM10.1 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}
