/**
 * The QR redirect.  sweetslips.co/go  ->  the client's landing page.
 *
 * Why the QR points here and not straight at the client:
 *   - the scan count is the product being sold on a trial run, and pointing
 *     the code at the client's domain hands that number to the client
 *   - the destination can change without reprinting a single slip
 *   - a slip lives for weeks; if the client's URL dies, this is a one-line
 *     fix rather than a dead code in every pocket
 *
 * 302, never 301. A permanent redirect is cached by the browser and by
 * intermediaries, so changing the destination later would not reach anyone who
 * had already scanned. On a printed code that is unrecoverable.
 *
 * Measurement is server-side through the GA4 Measurement Protocol: no cookie
 * is set, nothing is written to the scanner's device, and there is no consent
 * question to answer. It also means the redirect is not waiting on a script in
 * someone's browser before it fires.
 *
 * Config, all through Vercel environment variables:
 *   GO_DESTINATION      where to send the scan
 *   GA_MEASUREMENT_ID   G-XXXXXXXXXX
 *   GA_API_SECRET       from GA4 Admin -> Data Streams -> Measurement Protocol
 *
 * Every one of them is optional by design. With no destination the scan lands
 * on the site rather than an error; with no GA keys the redirect still works
 * and is simply uncounted. A missing variable must never produce a dead QR.
 */

const FALLBACK = 'https://sweetslips.co/';

/* Where the slips actually are. Everything local — the date a scan is filed
   under, the hour it is grouped into — is derived from this, not from the
   server clock or from whatever GA4's property happens to be set to. */
const TZ = 'Asia/Kolkata';

const UTM = {
  utm_source: 'sweetslips',
  utm_medium: 'print',
  utm_campaign: 'slip-trial',
};

/* Appended so the client sees the traffic named in their own analytics —
   which is the proof that matters to them — without overwriting any
   parameters the destination already carries. */
function withUtm(dest) {
  try {
    const u = new URL(dest);
    for (const [k, v] of Object.entries(UTM)) {
      if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return dest;
  }
}

async function recordScan(req) {
  const id = process.env.GA_MEASUREMENT_ID;
  const secret = process.env.GA_API_SECRET;
  if (!id || !secret) return;

  const h = req.headers;
  /* A fresh client_id per scan. Scans are anonymous and we are counting
     events, not people — read the event count in GA4, not the user count,
     which this deliberately inflates. */
  const clientId = `${Date.now()}.${Math.floor(Math.random() * 1e10)}`;

  /* The local date and hour, stamped here rather than inferred from GA4.
     GA4 files an event under its property's reporting time zone, and this
     function runs in UTC — 5h30 behind the restaurant. A property left on the
     US Pacific default is 12h30 behind, which files every Indian lunch under
     the previous day. The property time zone is the real fix; this is the
     copy that stays correct whatever the property is set to, and it survives
     someone changing that setting mid-run. */
  const now = new Date();
  const local = (opts) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: TZ, hour12: false, ...opts }).format(now);
  const scanDate = local({ year: 'numeric', month: '2-digit', day: '2-digit' });
  const scanHour = local({ hour: '2-digit' });

  await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${id}&api_secret=${secret}`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        non_personalized_ads: true,
        events: [{
          name: 'qr_scan',
          params: {
            campaign: UTM.utm_campaign,
            country: h['x-vercel-ip-country'] || '',
            city: h['x-vercel-ip-city'] || '',
            scan_date: scanDate,   // YYYY-MM-DD, restaurant local
            scan_hour: scanHour,   // 00-23, restaurant local
            engagement_time_msec: 1,
          },
        }],
      }),
    }
  );
}

export default async function handler(req, res) {
  const dest = withUtm(process.env.GO_DESTINATION || FALLBACK);

  /* Counting must never cost the scanner a redirect. If GA is slow or down
     the person still lands on the client's page; we lose one data point, not
     the scan. */
  try {
    await Promise.race([
      recordScan(req),
      new Promise(r => setTimeout(r, 800)),
    ]);
  } catch {
    /* swallowed on purpose — see above */
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.redirect(302, dest);
}
