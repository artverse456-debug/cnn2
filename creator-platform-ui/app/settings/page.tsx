"use client";

import { useMemo, useState } from "react";

const deviceSessions = [
  { id: "1", name: "MacBook Pro", location: "Berlin, DE", lastActive: "Vor 2 Stunden" },
  { id: "2", name: "iPhone 15", location: "Hamburg, DE", lastActive: "Heute, 08:15" },
  { id: "3", name: "iPad Air", location: "Remote", lastActive: "Gestern" },
];

export default function SettingsPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoRewardNotification, setAutoRewardNotification] = useState(true);
  const [monthlyPointsEmail, setMonthlyPointsEmail] = useState(false);
  const [showProfileInSearch, setShowProfileInSearch] = useState(true);
  const [roles, setRoles] = useState<["Fan"] | ["Creator"] | ["Fan", "Creator"]>(["Creator"]);
  const [defaultPayment, setDefaultPayment] = useState("Visa **** 4242");
  const [groupVisibility, setGroupVisibility] = useState("Öffentlich");
  const [profileVisibility, setProfileVisibility] = useState("Nur Premium-Fans");

  const hasBothRoles = roles.length === 2;
  const roleLabel = useMemo(() => roles.join(" & "), [roles]);

  const toggleRole = () => {
    if (hasBothRoles) return;
    setRoles((current) => (current[0] === "Fan" ? ["Fan", "Creator"] : ["Fan", "Creator"]));
  };

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

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <h1 className="text-4xl font-semibold text-white">Settings</h1>
      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Profil</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Anzeigename
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3" defaultValue="CreatorPulse" />
          </label>
          <label className="text-sm text-white/70">
            E-Mail
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
              defaultValue="contact@creatorpulse.app"
            />
          </label>
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Notifications</h2>
        <div className="space-y-3 text-sm text-white/70">
          {["Neue Challenge", "Reward eingelöst", "Fan Mention"].map((item) => (
            <label key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3">
              <input type="checkbox" defaultChecked className="h-4 w-4" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Account-Sicherheit</h2>
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
        <h2 className="text-2xl font-semibold text-white">Fan & Creator Rollen-Verwaltung</h2>
        <div className="space-y-3 text-white/80">
          <div className="flex flex-wrap items-center gap-3">
            {roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
              >
                {role}
              </span>
            ))}
          </div>
          <p className="text-sm text-white/70">Aktive Rolle: {roleLabel}</p>
          {!hasBothRoles && (
            <button
              type="button"
              onClick={toggleRole}
              className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
            >
              Weitere Rolle aktivieren
            </button>
          )}
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Zahlungs- & Rewards-Einstellungen</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Standard-Zahlungsmethode
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white"
              value={defaultPayment}
              onChange={(event) => setDefaultPayment(event.target.value)}
            >
              {[
                "Visa **** 4242",
                "Mastercard **** 8899",
                "PayPal",
                "Apple Pay",
              ].map((method) => (
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
              <Toggle
                checked={autoRewardNotification}
                onChange={() => setAutoRewardNotification((prev) => !prev)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Monatlichen Punktestand per Mail</p>
                <p className="text-xs text-white/60">Erhalte eine Übersicht direkt in dein Postfach.</p>
              </div>
              <Toggle checked={monthlyPointsEmail} onChange={() => setMonthlyPointsEmail((prev) => !prev)} />
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Datenschutz & Privatsphäre</h2>
        <div className="grid gap-4 md:grid-cols-2">
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
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
          <div>
            <p className="text-sm font-semibold text-white">Profil in Suchergebnissen anzeigen</p>
            <p className="text-xs text-white/60">Dein Profil kann von neuen Fans gefunden werden.</p>
          </div>
          <Toggle checked={showProfileInSearch} onChange={() => setShowProfileInSearch((prev) => !prev)} />
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Kontoverwaltung</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <button className="flex-1 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/50">
            Daten exportieren (JSON)
          </button>
          <button className="flex-1 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/50">
            Konto vorübergehend deaktivieren
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
