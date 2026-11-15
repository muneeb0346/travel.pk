export const revalidate = 3600;

export const metadata = {
  title: "Karachi to Dubai — Flight Route Guide | travel.pk",
  description: "Static route guide for Karachi to Dubai flights: airlines, duration, timezone, and fares in PKR.",
};

export default function KarachiToDubaiGuide() {
  return (
    <article>
      <h1>Karachi to Dubai Flight Route Guide</h1>
      <p>
        Direct flights from Karachi (KHI) to Dubai (DXB) typically take about 2 hours 15 minutes. Pakistan is
        PKT (UTC+5) and the UAE is GST (UTC+4), so Dubai is one hour behind Karachi.
      </p>
      <h2>Airlines on this route</h2>
      <ul>
        <li>Pakistan International Airlines (PIA)</li>
        <li>Emirates (EK)</li>
        <li>FlyDubai (FZ)</li>
        <li>Air Arabia (G9)</li>
        <li>Qatar Airways (QR) via Doha</li>
      </ul>
      <h2>Typical fares</h2>
      <p>Economy fares start around PKR 54,200; business class from roughly PKR 88,000.</p>
      <h2>Live fares</h2>
      <p>
        Live fares are uncached and fetched per search at <code>/air/search?route=karachi-to-dubai</code>.
      </p>
    </article>
  );
}
