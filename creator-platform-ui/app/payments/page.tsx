import { paymentMethods } from "@/lib/data";

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      <h1 className="text-4xl font-semibold text-white">Zahlungen</h1>
      <p className="text-sm text-white/70">Verwalte PayPal, Kreditkarte und Payout-Ziele. Alles Frontend-only.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {paymentMethods.map((method) => (
          <div key={method.id} className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <p className="text-lg font-semibold text-white">{method.label}</p>
            <p className="text-sm text-white/60">{method.description}</p>
            <button className="mt-6 w-full rounded-full border border-white/20 py-3 text-sm">Verbinden</button>
          </div>
        ))}
      </div>
    </div>
  );
}
