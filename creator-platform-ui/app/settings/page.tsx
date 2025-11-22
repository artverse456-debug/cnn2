"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";

const deviceSessions = [
  { id: "1", name: "MacBook Pro", location: "Berlin, DE", lastActive: "Vor 2 Stunden" },
  { id: "2", name: "iPhone 15", location: "Hamburg, DE", lastActive: "Heute, 08:15" },
  { id: "3", name: "iPad Air", location: "Remote", lastActive: "Gestern" },
];

const memberGroups = [
  { id: "group-1", name: "Neon Render Lab", creator: "Mila Ray", totalPoints: 4820, plan: "Premium" },
  { id: "group-2", name: "Analog Cine Guild", creator: "Leo Stone", totalPoints: 4510, plan: "Free" },
  { id: "group-3", name: "Loop Society", creator: "Ava Kai", totalPoints: 4395, plan: "Premium" },
];

const redeemedRewards = [
  { id: "redeemed-1", action: "Backstage Badge", timestamp: "12. Mai 2025", delta: -260 },
  { id: "redeemed-2", action: "Limited Merch Capsule", timestamp: "04. Mai 2025", delta: -180 },
  { id: "redeemed-3", action: "1:1 Mentor Session", timestamp: "20. April 2025", delta: -420 },
];

const creatorRewards = [
  { id: "r1", title: "Exklusiver Livestream", points: 750 },
  { id: "r2", title: "Signiertes Poster", points: 1200 },
  { id: "r3", title: "Behind-the-scenes Pack", points: 950 },
];

const creatorGroups = [
  { id: "cg1", name: "CreatorPulse Alpha", members: 320, price: "€24 / Monat" },
  { id: "cg2", name: "Studio Sessions", members: 185, price: "€18 / Monat" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { fanPoints } = useDashboardStore();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoRewardNotification, setAutoRewardNotification] = useState(true);
  const [monthlyPointsEmail, setMonthlyPointsEmail] = useState(false);
  const [showProfileInSearch, setShowProfileInSearch] = useState(true);
  const [defaultPayment, setDefaultPayment] = useState("Visa **** 4242");
  const [groupVisibility, setGroupVisibility] = useState("Öffentlich");
  const [profileVisibility, setProfileVisibility] = useState("Nur Premium-Fans");
  const [language, setLanguage] = useState("de");
  const [emailConfirmations, setEmailConfirmations] = useState(true);

  const role = useAuthStore((state) => state.role);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const session = useAuthStore((state) => state.session);
  const clearAuth = useAuthStore((state) => state.clear);
  const setRole = useAuthStore((state) => state.setRole);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const initializeAuth = useAuthStore((state) => state.initialize);

  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile]);

  const roleLabel = useMemo(() => {
    if (profile?.role === "creator" || role === "creator") return "Creator";
    if (profile?.role === "fan" || role === "fan") return "Fan";
    return "Unbekannt";
  }, [profile?.role, role]);

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full border border-white/15 transition ${checked ? "bg-white" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 transform rounded-full bg-black transition ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    clearAuth();
    router.push("/");
  };

  const handleSwitchToCreator = async () => {
    if (!session?.user?.id) return;

    const updatedProfile = await setRole("creator");
    if (updatedProfile) {
      await initializeAuth(session, "creator");
      router.refresh();
    }
  };

  const handleUsernameSave = async () => {
    if (!session?.user?.id || !username.trim()) return;

    const nextProfile = await updateProfile({ username: username.trim() });
    setProfileMessage(nextProfile ? "Profil aktualisiert." : "Profil konnte nicht gespeichert werden.");
  };

  const handleAvatarChange = async () => {
    if (!session?.user?.id) return;

    const nextUrl = window.prompt("Neuen Avatar-URL eingeben", avatarUrl || "https://");
    if (!nextUrl) return;

    setAvatarUrl(nextUrl);
    const nextProfile = await updateProfile({ avatar_url: nextUrl });
    setProfileMessage(nextProfile ? "Avatar aktualisiert." : "Avatar konnte nicht gespeichert werden.");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-white/70">
        Rolle wird geladen...
      </div>
    );
  }

  if (!role) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-white/70">
        Profilrolle konnte nicht geladen werden.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <h1 className="text-4xl font-semibold text-white">Settings</h1>

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Profil</h2>
            <p className="text-sm text-white/60">Anzeigename, E-Mail und Avatar verwalten.</p>
          </div>
          <button
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white"
            onClick={handleAvatarChange}
            type="button"
          >
            Avatar ändern
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Anzeigename
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              onBlur={handleUsernameSave}
              placeholder="Dein Anzeigename"
            />
          </label>
          <label className="text-sm text-white/70">
            E-Mail
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
              value={session?.user?.email ?? ""}
              readOnly
            />
          </label>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">Rolle</span>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{roleLabel}</span>
        </div>
        {profileMessage ? <p className="text-xs text-white/60">{profileMessage}</p> : null}
      </section>

      {role === "creator" ? (
        <>
          <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Zahlungsinformationen</h2>
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                Creator Hub
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-white/70">
                Standard-Zahlungsmethode
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white"
                  value={defaultPayment}
                  onChange={(event) => setDefaultPayment(event.target.value)}
                >
                  {["Visa **** 4242", "Mastercard **** 8899", "PayPal", "Apple Pay"].map((method) => (
                    <option key={method} value={method} className="bg-[#05050a] text-white">
                      {method}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Automatische Reward-Benachrichtigung</p>
                    <p className="text-xs text-white/60">Informiert dich, sobald Fans Rewards einlösen.</p>
                  </div>
                  <Toggle checked={autoRewardNotification} onChange={() => setAutoRewardNotification((prev) => !prev)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Monatliche Payout-Übersicht</p>
                    <p className="text-xs text-white/60">Zusammenfassung deiner Einnahmen per E-Mail.</p>
                  </div>
                  <Toggle checked={monthlyPointsEmail} onChange={() => setMonthlyPointsEmail((prev) => !prev)} />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Gruppen & Rewards verwalten</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Gruppen verwalten</p>
                {creatorGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70">
                    <div>
                      <p className="text-white">{group.name}</p>
                      <p className="text-xs text-white/60">{group.members} Mitglieder · {group.price}</p>
                    </div>
                    <button className="text-sm text-primary-light">Details</button>
                  </div>
                ))}
                <button className="w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/50">
                  Neue Gruppe anlegen
                </button>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Rewards verwalten</p>
                {creatorRewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70">
                    <div>
                      <p className="text-white">{reward.title}</p>
                      <p className="text-xs text-white/60">{reward.points} Punkte</p>
                    </div>
                    <button className="text-sm text-primary-light">Bearbeiten</button>
                  </div>
                ))}
                <button className="w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/50">
                  Neuen Reward hinzufügen
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Rewards eingelöst", value: "1.2K" },
                { label: "Premium-Gruppen", value: "5" },
                { label: "Insight-Views", value: "18.4K" },
              ].map((insight) => (
                <div key={insight.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{insight.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{insight.value}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Fan-Einstellungen</h2>
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                Fan Hub
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Punktestand</p>
                <p className="mt-3 text-4xl font-semibold">{profile?.points ?? fanPoints} Punkte</p>
                <p className="mt-2 text-sm text-white/70">Basierend auf Challenges, Gruppen und Rewards.</p>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Punktverlauf</p>
                {redeemedRewards.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70">
                    <div>
                      <p className="text-white">{item.action}</p>
                      <p className="text-xs text-white/60">{item.timestamp}</p>
                    </div>
                    <span className="text-rose-300">{item.delta} Punkte</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">Abos (Bezahl-Gruppen)</p>
              {memberGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm text-white/70">
                  <div>
                    <p className="text-white">{group.name}</p>
                    <p className="text-xs text-white/60">Creator: {group.creator} · {group.plan} · {group.totalPoints} Punkte</p>
                  </div>
                  <button className="text-sm text-primary-light">Zur Gruppe</button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Benachrichtigungen</h2>
        <div className="space-y-3 text-sm text-white/70">
          {["Neue Challenge", "Reward eingelöst", "Fan Mention"].map((item) => (
            <label key={item} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3">
              <span>{item}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          ))}
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3">
            <span>E-Mail Bestätigungen</span>
            <Toggle checked={emailConfirmations} onChange={() => setEmailConfirmations((prev) => !prev)} />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Sicherheit & Passwort</h2>
          <button
            type="button"
            onClick={() => setShowChangePassword(true)}
            className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
          >
            Passwort ändern
          </button>
        </div>
        <div className="space-y-4 text-white/80">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Zwei-Faktor-Authentifizierung</p>
              <p className="text-sm text-white/70">Schützt dein Konto zusätzlich bei Logins.</p>
            </div>
            <Toggle checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled((prev) => !prev)} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Angemeldete Geräte</p>
            <div className="mt-3 space-y-3 text-sm text-white/70">
              {deviceSessions.map((device) => (
                <div key={device.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-3">
                  <div>
                    <p className="font-semibold text-white">{device.name}</p>
                    <p className="text-white/60">{device.location}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                    {device.lastActive}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Allgemein</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Sprache
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="de" className="bg-[#05050a] text-white">
                Deutsch
              </option>
              <option value="en" className="bg-[#05050a] text-white">
                Englisch
              </option>
            </select>
          </label>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">E-Mail Updates</p>
                <p className="text-xs text-white/60">Regelmäßige Zusammenfassungen und Bestätigungen.</p>
              </div>
              <Toggle checked={monthlyPointsEmail} onChange={() => setMonthlyPointsEmail((prev) => !prev)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Profil in Suchergebnissen anzeigen</p>
                <p className="text-xs text-white/60">Dein Profil kann von neuen Fans gefunden werden.</p>
              </div>
              <Toggle checked={showProfileInSearch} onChange={() => setShowProfileInSearch((prev) => !prev)} />
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Sichtbarkeit der Gruppenaktivität
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white"
              value={groupVisibility}
              onChange={(event) => setGroupVisibility(event.target.value)}
            >
              {["Öffentlich", "Nur Follower", "Privat"].map((option) => (
                <option key={option} value={option} className="bg-[#05050a] text-white">
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-white/70">
            Sichtbarkeit des Profils
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white"
              value={profileVisibility}
              onChange={(event) => setProfileVisibility(event.target.value)}
            >
              {["Öffentlich", "Nur Premium-Fans", "Privat"].map((option) => (
                <option key={option} value={option} className="bg-[#05050a] text-white">
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {role === "fan" ? (
            <button
              type="button"
              onClick={handleSwitchToCreator}
              className="flex-1 rounded-2xl border border-primary/50 bg-primary/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-primary"
            >
              Jetzt Creator werden
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/50"
          >
            Logout
          </button>
          <button className="flex-1 rounded-2xl border border-red-400/60 bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-50 transition hover:border-red-300/80">
            Konto dauerhaft löschen
          </button>
        </div>
      </section>

      {showChangePassword ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#05050a] p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Sicherheit</p>
                <h3 className="text-2xl font-semibold text-white">Passwort ändern</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/50"
              >
                Schließen
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <label className="text-sm text-white/70">
                Aktuelles Passwort
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
                  placeholder="••••••••"
                />
              </label>
              <label className="text-sm text-white/70">
                Neues Passwort
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
                  placeholder="Mindestens 12 Zeichen"
                />
              </label>
              <label className="text-sm text-white/70">
                Passwort bestätigen
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
                  placeholder="Wiederhole dein neues Passwort"
                />
              </label>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/50"
                >
                  Abbrechen
                </button>
                <button className="rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
                  Passwort speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
