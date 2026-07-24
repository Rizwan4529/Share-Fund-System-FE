import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/common/TabsCommon";

type AuthTabSwitcherProps = {
  mode: "login" | "signup";
  onChange: (mode: "login" | "signup") => void;
};

export function AuthTabSwitcher({ mode, onChange }: AuthTabSwitcherProps) {
  return (
    <Tabs
      value={mode}
      onValueChange={(value) => onChange(value as "login" | "signup")}
      className="mb-[30px] gap-0"
    >
      <TabsList>
        <TabsTrigger value="login">Log in</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
