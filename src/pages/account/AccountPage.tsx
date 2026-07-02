import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AccountDangerCard,
  AccountSectionCard,
} from "@/components/account/AccountSectionCard";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { FormCommon, Input } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { GoldAvatar } from "@/components/member/app";
import { PreferenceToggleRow } from "@/components/member/app";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import {
  useAccount,
  useDeleteAccount,
  useSaveCommunicationPrefs,
  useSaveNotificationPrefs,
  useSaveProfile,
  useSetTwoFA,
} from "@/hooks/queries/useAccount";
import {
  profileSchema,
  securitySchema,
  type ProfileFormValues,
  type SecurityFormValues,
} from "@/lib/schemas/auth";

export default function AccountPage() {
  const { section = "profile" } = useParams();
  const { logout } = useAuth();
  const { data, isLoading } = useAccount();
  const saveProfile = useSaveProfile();
  const saveNotif = useSaveNotificationPrefs();
  const saveComm = useSaveCommunicationPrefs();
  const setTwoFA = useSetTwoFA();
  const deleteAccount = useDeleteAccount();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: data?.profile.name ?? "",
      email: data?.profile.email ?? "",
      phone: data?.profile.phone ?? "",
      location: data?.profile.location ?? "",
    },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = async (values: ProfileFormValues) => {
    await saveProfile.mutateAsync(values);
    toast.success("Profile saved.");
  };

  const onSaveSecurity = async () => {
    toast.success("Security settings updated.");
    securityForm.reset();
  };

  const handleDelete = async () => {
    await deleteAccount.mutateAsync();
    setDeleteOpen(false);
    await logout();
  };

  if (isLoading) return <Skeleton className="h-96 rounded-panel" />;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <AccountSidebar
        section={section}
        name={data?.profile.name ?? ""}
        membership={data?.profile.membership ?? "Free member"}
        avatarInitials={data?.profile.avatarInitials ?? "?"}
      />

      <div className="min-w-0 flex-1">
        {section === "profile" ? (
          <AccountSectionCard
            title="Profile"
            subtitle="Update your personal information and how you appear in SFS."
          >
            <FormCommon form={profileForm} onSubmit={onSaveProfile} className="space-y-4">
              <div className="mb-2 flex flex-wrap items-center gap-4">
                <GoldAvatar
                  initials={data?.profile.avatarInitials ?? "?"}
                  className="size-[72px] text-2xl"
                />
                <GoldButton type="button" variant="ghost-outline" size="sm">
                  Change photo
                </GoldButton>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input control={profileForm.control} name="name" label="Full name" required />
                <Input control={profileForm.control} name="email" label="Email" type="email" required />
                <Input control={profileForm.control} name="phone" label="Phone" />
                <Input control={profileForm.control} name="location" label="Location" />
              </div>
              <div className="flex gap-3 pt-2">
                <GoldButton type="submit" size="app">Save changes</GoldButton>
                <GoldButton type="button" variant="ghost-outline" onClick={() => profileForm.reset()}>
                  Cancel
                </GoldButton>
              </div>
            </FormCommon>
          </AccountSectionCard>
        ) : null}

        {section === "security" ? (
          <AccountSectionCard
            title="Security"
            subtitle="Keep your account safe with a strong password and two-factor authentication."
          >
            <FormCommon form={securityForm} onSubmit={onSaveSecurity} className="max-w-md space-y-4">
              <Input control={securityForm.control} name="currentPassword" label="Current password" type="password" />
              <Input control={securityForm.control} name="newPassword" label="New password" type="password" />
              <Input control={securityForm.control} name="confirmPassword" label="Confirm password" type="password" />
              <GoldButton type="submit" size="app">Update password</GoldButton>
            </FormCommon>
            <div className="mt-8 border-t border-line pt-6">
              <PreferenceToggleRow
                label="Two-factor authentication"
                description="Add an extra layer of security"
                checked={data?.twoFA ?? false}
                onCheckedChange={(v) => {
                  setTwoFA.mutate(v);
                  toast.success(v ? "2FA enabled" : "2FA disabled");
                }}
              />
            </div>
          </AccountSectionCard>
        ) : null}

        {section === "notifications" ? (
          <AccountSectionCard
            title="Notifications"
            subtitle="Choose what updates you want to hear about."
          >
            <ToggleSection
              items={[
                { key: "platform", label: "Platform updates", desc: "Product news and improvements" },
                { key: "campaign", label: "Campaign progress", desc: "Milestones and progress updates" },
                { key: "education", label: "Education & tips", desc: "Guides and learning content" },
                { key: "announce", label: "Announcements", desc: "Major platform announcements" },
              ]}
              prefs={data?.notifPrefs ?? { platform: true, campaign: true, education: true, announce: false }}
              onSave={(prefs) => {
                saveNotif.mutate(prefs);
                toast.success("Notification preferences saved.");
              }}
            />
          </AccountSectionCard>
        ) : null}

        {section === "communication" ? (
          <AccountSectionCard
            title="Communication"
            subtitle="Manage how SFS reaches you by email."
          >
            <ToggleSection
              items={[
                { key: "email", label: "Email notifications", desc: "Important account emails" },
                { key: "product", label: "Product updates", desc: "New features and improvements" },
                { key: "promos", label: "Promotional emails", desc: "Offers and promotions" },
              ]}
              prefs={data?.commPrefs ?? { email: true, product: true, promos: false }}
              onSave={(prefs) => {
                saveComm.mutate(prefs);
                toast.success("Communication preferences saved.");
              }}
            />
          </AccountSectionCard>
        ) : null}

        {section === "management" ? (
          <AccountSectionCard
            title="Account management"
            subtitle="Pause or permanently remove your account."
          >
            <div className="space-y-4">
              <div className="rounded-panel border border-line bg-bg-card p-5">
                <h3 className="font-display text-[16px] font-bold text-ink-heading">Pause account</h3>
                <p className="mt-1 text-[14px] text-muted-soft">
                  Temporarily hide your profile and pause campaign activity.
                </p>
                <GoldButton variant="ghost-outline" className="mt-4" size="sm">
                  Pause account
                </GoldButton>
              </div>
              <AccountDangerCard
                title="Delete account"
                description="Permanently remove your account and all data. This cannot be undone."
                action={
                  <GoldButton
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete account
                  </GoldButton>
                }
              />
            </div>
          </AccountSectionCard>
        ) : null}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-panel">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-soft">
            This will permanently delete your account and all associated data.
          </p>
          <DialogFooter>
            <GoldButton variant="ghost-outline" onClick={() => setDeleteOpen(false)}>Cancel</GoldButton>
            <GoldButton variant="destructive" onClick={() => void handleDelete()}>Delete account</GoldButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToggleSection<T extends Record<string, boolean>>({
  items,
  prefs,
  onSave,
}: {
  items: { key: keyof T & string; label: string; desc: string }[];
  prefs: T;
  onSave: (prefs: T) => void;
}) {
  const [local, setLocal] = useState(prefs);

  useEffect(() => {
    setLocal(prefs);
  }, [prefs]);

  return (
    <div>
      <div className="divide-y divide-line">
        {items.map((item) => (
          <PreferenceToggleRow
            key={item.key}
            label={item.label}
            description={item.desc}
            checked={Boolean(local[item.key])}
            onCheckedChange={(checked) =>
              setLocal({ ...local, [item.key]: checked })
            }
          />
        ))}
      </div>
      <GoldButton size="app" className="mt-6" onClick={() => onSave(local)}>
        Save preferences
      </GoldButton>
    </div>
  );
}
