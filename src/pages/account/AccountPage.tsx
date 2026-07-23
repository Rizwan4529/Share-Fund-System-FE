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
            title="BMIS profile"
            subtitle="Your participant identity and home base inside the system."
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
              <BmisFields
                goalSummary={data?.profile.bmisProfile.goalSummary ?? ""}
                preferredContact={data?.profile.bmisProfile.preferredContact ?? ""}
                notes={data?.profile.bmisProfile.notes ?? ""}
                onSaveProfile={async (bmis) => {
                  await saveProfile.mutateAsync({
                    ...profileForm.getValues(),
                    bmisProfile: bmis,
                  } as never);
                  toast.success("BMIS profile saved.");
                }}
              />
              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                Status: {data?.profile.membership} · Centers selected:{" "}
                {data?.profile.selectedCenterIds.length ?? 0}/
                {data?.profile.centerLimit ?? 0} · Questionnaire:{" "}
                {data?.profile.questionnaireComplete ? "complete" : "incomplete"}
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

function BmisFields({
  goalSummary,
  preferredContact,
  notes,
  onSaveProfile,
}: {
  goalSummary: string;
  preferredContact: string;
  notes: string;
  onSaveProfile: (bmis: {
    goalSummary: string;
    preferredContact: string;
    notes: string;
  }) => Promise<void>;
}) {
  const [goal, setGoal] = useState(goalSummary);
  const [contact, setContact] = useState(preferredContact);
  const [note, setNote] = useState(notes);

  useEffect(() => {
    setGoal(goalSummary);
    setContact(preferredContact);
    setNote(notes);
  }, [goalSummary, preferredContact, notes]);

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold">BMIS details</p>
      <label className="block text-sm">
        Goal summary
        <input
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Preferred contact
        <input
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Notes
        <textarea
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <GoldButton
        type="button"
        size="sm"
        variant="ghost-outline"
        onClick={() =>
          void onSaveProfile({
            goalSummary: goal,
            preferredContact: contact,
            notes: note,
          })
        }
      >
        Save BMIS details
      </GoldButton>
    </div>
  );
}
