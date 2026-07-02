import { authDividerClass, authSocialButtonClass } from "@/components/auth/authStyles";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.2c0-.7-.06-1.4-.18-2.05H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.55c2.08-1.9 3.25-4.74 3.25-7.85Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.95 0 5.43-.98 7.25-2.65l-3.55-2.7c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.13-4.5H2.2v2.8A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.87 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.2a11 11 0 0 0 0 9.8l3.67-2.8Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3.05.55 4.19 1.63l3.13-3.13A11 11 0 0 0 2.2 7.2l3.67 2.8C6.74 7.42 9.15 5.4 12 5.4Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

export function AuthSocialButtons() {
  return (
    <>
      <div className={authDividerClass}>
        <div className="h-px flex-1 bg-line" />
        <Typography variant="caption" color="muted" className="text-[12.5px] tracking-wide">
          or continue with
        </Typography>
        <div className="h-px flex-1 bg-line" />
      </div>
      <div className="flex gap-3">
        <Button variant="ghost-outline" className={authSocialButtonClass} type="button">
          <GoogleIcon />
          Google
        </Button>
        <Button variant="ghost-outline" className={authSocialButtonClass} type="button">
          <FacebookIcon />
          Facebook
        </Button>
      </div>
    </>
  );
}
