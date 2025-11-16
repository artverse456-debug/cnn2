export default function SettingsPage() {
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
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3" defaultValue="contact@creatorpulse.app" />
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
    </div>
  );
}
