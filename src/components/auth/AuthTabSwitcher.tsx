import { authTabClass } from "@/components/auth/authStyles";

type AuthTabSwitcherProps = {
  mode: "login" | "signup";
  onChange: (mode: "login" | "signup") => void;
};

export function AuthTabSwitcher({ mode, onChange }: AuthTabSwitcherProps) {
  return (
    <div className="mb-[30px] flex rounded-lg border border-line bg-[#f1f4fa] p-1">
      {(["login", "signup"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={authTabClass(mode === m)}
        >
          {m === "login" ? "Log in" : "Sign up"}
        </button>
      ))}
    </div>
  );
}
