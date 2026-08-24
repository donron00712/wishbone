/* Kismat Cookies — all site content lives here. Edit this file, not the markup. */
window.WB = (function () {

  /* TODO: swap for your real address before this goes anywhere public. */
  const email = 'hello@kismatcookies.com';

  const nav = [
    { label: 'The formats', href: 'formats.html' },
    { label: 'Why it works', href: 'why-it-works.html' },
    { label: 'Case studies', href: 'cases.html' }
  ];

  /* Lines that could plausibly be printed on a slip. Used in the hero
     marquee and the drifting wall behind stage two. */
  const wishes = [
    'You will be seated immediately.',
    'Someone is about to text you back.',
    'The second half of this year is yours.',
    'Order the thing you almost ordered.',
    'A door you assumed was locked is not.',
    'Your next idea arrives on a Tuesday.',
    'Split the bill. Keep the friend.',
    'The wait was the point.',
    'You are closer than the map suggests.',
    'Say yes to the small detour.',
    'Good news travels at dinner speed.',
    'Dessert was the right call.',
    'Luck is mostly showing up hungry.',
    'Something you posted is aging well.',
    'Tomorrow starts earlier than you think.',
    'You will win the next one.',
    'Keep this one. You will want it later.',
    'The table remembers this.',
    'Ask for the corner booth.',
    'Your timing is not late. It is exact.',
    'Everyone at this table is on your side.',
    'A small bet pays out this month.',
    'The recipe was never the secret.',
    'You are allowed to want it.'
  ];

  /* Sample slips. Each is the two-piece unit: the fortune with its lucky
     numbers, and the sponsor strip underneath that finishes the line.
     Illustrative only — the brands are real, the taglines, offers and /luck
     URLs are invented, and none of it represents an actual campaign. The page
     labels them as examples. Replace wholesale once there is real work. */
  const sampleFortunes = [
    { line: 'Unlock your beauty secret, below this line.', nums: '3, 8, 17, 24, 31, 45',    brand: 'Nykaa',      tag: '…starting with your skin.',     url: 'nykaa.com/luck',            bg: '#E80071', fg: '#fff', qr: true },
    { line: 'Your ride home is closer than you think.',    nums: '5, 11, 19, 27, 38, 42',   brand: 'Uber',       tag: '…and it\'s two minutes away.',  url: 'uber.com/luck',             bg: '#0D0D0D', fg: '#fff', qr: true },
    { line: 'Never settle for the slower one.',            nums: '2, 9, 14, 23, 36, 48',    brand: 'OnePlus',    tag: '…at 120 hertz.',                url: 'oneplus.in/luck',           bg: '#EB0028', fg: '#fff' },
    { line: 'Time is on your side tonight.',               nums: '6, 13, 21, 29, 34, 41',   brand: 'Casio',      tag: '…right on time.',               url: 'casio.com/luck',            bg: '#001E62', fg: '#fff' },
    { line: 'Tomorrow\'s craving is already decided.',     nums: '4, 15, 22, 30, 37, 44',   brand: 'Zomato',     tag: '…order it anyway.',             url: 'zomato.com/luck',           bg: '#E23744', fg: '#fff', qr: true },
    { line: 'The next meal finds you faster.',             nums: '1, 10, 18, 26, 33, 47',   brand: 'Swiggy',     tag: '…in twenty minutes.',           url: 'swiggy.com/luck',           bg: '#FC8019', fg: '#3A1B00' },
    { line: 'You will be overdressed. Enjoy it.',          nums: '7, 12, 20, 28, 39, 46',   brand: 'Myntra',     tag: '…and it\'s on sale.',           url: 'myntra.com/luck',           bg: '#FF3F6C', fg: '#fff' },
    { line: 'Turn it up on the way home.',                 nums: '3, 16, 25, 32, 40, 49',   brand: 'boAt',       tag: '…turn it up.',                  url: 'boat-lifestyle.com/luck',   bg: '#E52D27', fg: '#fff' },
    { line: 'Good habits pay you back.',                   nums: '8, 14, 19, 27, 35, 43',   brand: 'CRED',       tag: '…pay the bill first.',          url: 'cred.club/luck',            bg: '#0B0B0B', fg: '#fff', qr: true },
    { line: 'It arrives before you finish reading this.',  nums: '2, 11, 23, 31, 38, 50',   brand: 'Zepto',      tag: '…in ten minutes.',              url: 'zepto.com/luck',            bg: '#6C2BD9', fg: '#fff' },
    { line: 'You will see this year clearly.',             nums: '5, 17, 24, 29, 36, 45',   brand: 'Lenskart',   tag: '…once you can see it.',         url: 'lenskart.com/luck',         bg: '#00A9E0', fg: '#fff', qr: true },
    { line: 'The right moment is already on your wrist.',  nums: '6, 13, 22, 30, 41, 48',   brand: 'Titan',      tag: '…give it time.',                url: 'titan.co.in/luck',          bg: '#1B2A47', fg: '#fff' },
    { line: 'Your wallet is heavier than it looks.',       nums: '1, 9, 18, 26, 34, 42',    brand: 'Paytm',      tag: '…scan to find out.',            url: 'paytm.com/luck',            bg: '#00BAF2', fg: '#04263A' },
    { line: 'One more episode is the correct answer.',     nums: '4, 12, 21, 28, 37, 46',   brand: 'Netflix',    tag: '…after one more episode.',      url: 'netflix.com/luck',          bg: '#E50914', fg: '#fff' },
    { line: 'The song you needed is next.',                nums: '7, 15, 20, 33, 39, 44',   brand: 'Spotify',    tag: '…press play.',                  url: 'spotify.com/luck',          bg: '#1DB954', fg: '#06301A', qr: true },
    { line: 'The bigger picture is worth it.',             nums: '3, 10, 25, 32, 40, 47',   brand: 'Samsung',    tag: '…on a bigger screen.',          url: 'samsung.com/luck',          bg: '#1428A0', fg: '#fff' },
    { line: 'Hear what you have been missing.',            nums: '2, 14, 19, 27, 35, 49',   brand: 'Sony',       tag: '…hear it properly.',            url: 'sony.com/luck',             bg: '#0A0A0A', fg: '#fff' },
    { line: 'The run you skipped is still waiting.',       nums: '8, 16, 23, 31, 38, 43',   brand: 'Nike',       tag: '…so go for a run.',             url: 'nike.com/luck',             bg: '#111111', fg: '#fff', qr: true },
    { line: 'Be kind to your skin this week.',             nums: '5, 11, 22, 29, 36, 45',   brand: 'Mamaearth',  tag: '…be gentle about it.',          url: 'mamaearth.in/luck',         bg: '#4CA83D', fg: '#0C2A06' },
    { line: 'What you wanted just went on sale.',          nums: '1, 13, 20, 28, 34, 48',   brand: 'Flipkart',   tag: '…it\'s already in your cart.',  url: 'flipkart.com/luck',         bg: '#2874F0', fg: '#fff' },
    { line: 'Your streak survives the weekend.',           nums: '6, 12, 24, 30, 41, 46',   brand: 'Duolingo',   tag: '…don\'t break the streak.',     url: 'duolingo.com/luck',         bg: '#58CC02', fg: '#0C3D00', qr: true },
    { line: 'The second half of tonight is yours.',        nums: '4, 17, 21, 33, 39, 42',   brand: 'Red Bull',   tag: '…the night is young.',          url: 'redbull.com/luck',          bg: '#001489', fg: '#fff' },
    { line: 'Bold looks better on you.',                   nums: '7, 10, 26, 32, 37, 50',   brand: 'Sugar',      tag: '…wear the bold one.',           url: 'sugarcosmetics.com/luck',   bg: '#0B0B0B', fg: '#fff' },
    { line: 'It is already out for delivery.',             nums: '2, 15, 18, 25, 40, 47',   brand: 'Amazon',     tag: '…it ships tonight.',            url: 'amazon.in/luck',            bg: '#232F3E', fg: '#fff', qr: true },
  ];

  const oohPoints = [
    { n: '01', title: 'It cannot be closed, skipped or blocked',
      body: 'Every digital format competes for a screen its audience is trying to get past. Out-of-home occupies physical space instead, so there is no ad blocker, no skip button and no auction for the attention.' },
    { n: '02', title: 'It works on memory rather than clicks',
      body: 'Out-of-home is bought to shape how a brand is remembered, not to drive an action in the next ten seconds. That is a different job from performance media, and a different thing to measure.' },
    { n: '03', title: 'Taking up space is a signal in itself',
      body: 'Putting something physical into the world is a visible commitment. It is a quality an impression bought at auction does not carry, whatever the targeting.' },
    { n: '04', title: 'It addresses a place, not a profile',
      body: 'Out-of-home speaks to everyone present rather than to a segment. At a dinner table that means a brand can arrive with a group rather than an individual.' }
  ];

  const reasons = [
    { n: '01', title: 'It arrives as part of the meal',
      body: 'The cookie comes with the check the way it always has. Your message is inside something the restaurant is already handing over, rather than an interruption bought against someone\u2019s attention.' },
    { n: '02', title: 'It lands at the calmest point of the evening',
      body: 'The end of a meal is unhurried in a way almost no other advertising moment is. Nothing else is bidding for the table at that point.' },
    { n: '03', title: 'It reaches a table, not a screen',
      body: 'A cookie goes to each person present, so a brand can arrive with a group in the same moment rather than one device at a time.' },
    { n: '04', title: 'It is a physical thing, not an impression',
      body: 'The slip is small enough to pocket and leaves the restaurant with whoever takes it. It does not disappear when a feed refreshes.' }
  ];

  const formats = [
    { meta: 'The fortune', title: 'Eleven words on the slip',
      body: 'The line inside the cookie, written with you or by you. Eleven words is the whole creative brief \u2014 short enough to take in at a glance, long enough to carry a voice.' },
    { meta: 'The numbers', title: 'Lucky numbers that actually do something',
      body: 'Every fortune carries its six numbers. They can be a discount code, a draw entry or a store number instead of decoration.' },
    { meta: 'The code',    title: 'A prize on the back of the slip',
      body: 'A QR or promo code on the reverse, so the fortune has something to redeem and you have something to measure.' },
    { meta: 'Targeting',   title: 'City, cuisine, daypart',
      body: 'Choose where the cookies land: a neighbourhood, a cuisine, a dinner rush, a single street. Placement is a media buy, not a mailing list.' },
    { meta: 'The drop',    title: 'Limited runs for a moment',
      body: 'Short, dated runs built around a launch, a holiday, a fixture, a Lunar New Year service. Scarcity the table can feel.' },
    { meta: 'Co-branding', title: 'Two brands, two sides',
      body: 'The slip has a front and a back. A line each, or a line and a code \u2014 a natural format for a collaboration where both sides get their own surface.' }
  ];

  /* Three different things, not three ways of saying one thing: the
     constraint, the second surface, and what the medium gets you. */
  const targets = [
    { num: '11', label: 'Words on the slip. The entire creative brief.' },
    { num: '6',  label: 'Lucky numbers underneath, yours to make mean something.' },
    { num: '0',  label: 'Ways to skip it, block it or scroll past it.' }
  ];

  /* Photographs of real cookies, mixed into the wall alongside the printed
     slips. Empty by default, and it must stay that way until each file is one
     you are allowed to publish: your own photograph, a licensed stock image, or
     one whose creator has given permission in writing. Screenshots from social
     media are none of those — they are someone else's copyrighted work, and
     using them also implies that account endorses us.

     Drop files in assets/media/ and add an entry:
       { src: 'assets/media/cookie-01.jpg', alt: 'A cracked fortune cookie on a
         white plate, the slip half out.', credit: 'Photo: your name' }  */
  const photos = [
    { src: 'assets/media/cookie-tray.jpg',
      alt: 'Three freshly folded fortune cookies cooling on a metal tray.' },
    { src: 'assets/media/cookie-slip.jpg',
      alt: 'A fortune cookie snapped in two, the printed slip stretched between the halves.' },
    { src: 'assets/media/cookie-open.jpg',
      alt: 'An opened fortune cookie with its slip held between the two halves.' }
  ];

  /* Real campaigns, run by other people. Every figure here comes from the
     published case study named in `source`, and `runBy` credits whoever
     actually ran it. Kismat Cookies has not worked with these brands — this
     section is evidence that the medium performs, not a client list, and the
     page says so in as many words. Do not restate any of this as our own. */
  const cases = [
    {
      brand: 'Duolingo',
      place: 'United States',
      when:  'Lunar New Year',
      title: 'Half a million cookies, and a language lesson on the back',
      body:  'A cryptic fortune on the front, and on the reverse a lesson reminder in Duo\u2019s voice alongside real Mandarin characters \u2014 a language lesson small enough to finish at the table.',
      stats: [
        { n: '500,000', l: 'cookies, nationally' },
        { n: '40M+',    l: 'social impressions' },
        { n: '15.5%',   l: 'lift in likelihood to use Duolingo' }
      ],
      runBy: 'OpenFortune',
      source: 'openfortune.com'
    },
    {
      brand: 'Dude Wipes',
      place: 'United States',
      when:  'Takeaway orders',
      title: 'A million slips, dropped where the product makes sense',
      body:  'Bathroom humour on the fortune, the product on the reverse. The placement did the argument: people eating takeaway are people who will shortly be somewhere else.',
      stats: [
        { n: '1M',    l: 'slips in takeaway orders' },
        { n: '74%',   l: 'unaided recall' },
        { n: '22%',   l: 'kept the slip' }
      ],
      runBy: 'OpenFortune',
      source: 'openfortune.com'
    },
    {
      brand: 'Warner Bros.',
      place: 'Manhattan',
      when:  'Dinner service',
      title: 'A rom-com promoted where the date night already is',
      body:  'Love-themed fortunes for \u201cIsn\u2019t It Romantic\u201d, placed in Manhattan restaurants at dinnertime \u2014 the film\u2019s subject and the diner\u2019s evening being the same thing.',
      stats: [
        { n: '80%',      l: 'unaided film recall' },
        { n: '81%',      l: 'lift in likelihood to see it' },
        { n: '500,000+', l: 'social impressions' }
      ],
      runBy: 'OpenFortune',
      source: 'openfortune.com'
    },
    {
      brand: 'Liquid Death',
      place: 'New York and Los Angeles',
      when:  'Halloween',
      title: 'Misfortunes, for a brand that trades on the opposite',
      body:  'Grim fortunes instead of lucky ones, with a QR code to the brand\u2019s HorrorScope SMS list. The format was inverted rather than borrowed, which is why it travelled.',
      stats: [
        { n: 'AdAge',   l: 'press pickup' },
        { n: 'SMS',     l: 'list sign-ups driven' },
        { n: 'NYC / LA', l: 'Chinese restaurants' }
      ],
      runBy: 'OpenFortune',
      source: 'openfortune.com'
    }
  ];

  return { email, nav, wishes, sampleFortunes, oohPoints, reasons, formats, targets, cases, photos };
})();
