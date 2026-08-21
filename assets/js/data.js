/* Wishbone — all site content lives here. Edit this file, not the markup. */
window.WB = (function () {

  /* TODO: swap for your real address before this goes anywhere public. */
  const email = 'hello@wishbone.co';

  const nav = [
    { label: 'The formats', href: 'formats.html' },
    { label: 'Why it works', href: 'why-it-works.html' },
    { label: 'Journal',      href: 'journal.html' }
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

  /* Sample fortunes: what a real slip would read like for a given brand.
     These are MOCK-UPS — Wishbone has not launched, none of these brands are
     clients, and none of these offers exist. The hero says so on the page.
     Replace wholesale the moment a real campaign runs. */
  const sampleFortunes = [
    { line: 'Unlock your beauty secret, below this line.',   brand: 'Nykaa', qr: true,     offer: '10% off' },
    { line: 'Your ride home is closer than you think.',      brand: 'Uber', qr: true,      offer: '\u20B9100 off' },
    { line: 'Never settle for the slower one.',              brand: 'OnePlus',   offer: '\u20B92,000 off' },
    { line: 'Time is on your side tonight.',                 brand: 'Casio',     offer: '15% off' },
    { line: "Tomorrow's craving is already decided.",        brand: 'Zomato', qr: true,    offer: 'Free delivery' },
    { line: 'The next meal finds you faster.',               brand: 'Swiggy',    offer: '50% off' },
    { line: 'You will be overdressed. Enjoy it.',            brand: 'Myntra',    offer: '20% off' },
    { line: 'Turn it up on the way home.',                   brand: 'boAt',      offer: '30% off' },
    { line: 'Good habits pay you back.',                     brand: 'CRED', qr: true,      offer: '500 coins' },
    { line: 'It arrives before you finish reading this.',    brand: 'Zepto',     offer: '\u20B975 off' },
    { line: 'You will see this year clearly.',               brand: 'Lenskart', qr: true,  offer: 'Buy 1 get 1' },
    { line: 'The right moment is already on your wrist.',    brand: 'Titan',     offer: '25% off' },
    { line: 'Your wallet is heavier than it looks.',         brand: 'Paytm',     offer: '\u20B950 cashback' },
    { line: 'One more episode is the correct answer.',       brand: 'Netflix',   offer: '1 month free' },
    { line: 'The song you needed is next.',                  brand: 'Spotify', qr: true,   offer: '3 months free' },
    { line: 'The bigger picture is worth it.',               brand: 'Samsung',   offer: '\u20B95,000 off' },
    { line: 'Hear what you have been missing.',              brand: 'Sony',      offer: '20% off' },
    { line: 'The run you skipped is still waiting.',         brand: 'Nike', qr: true,      offer: '25% off' },
    { line: 'Be kind to your skin this week.',               brand: 'Mamaearth', offer: '15% off' },
    { line: 'What you wanted just went on sale.',            brand: 'Flipkart',  offer: '\u20B9300 off' },
    { line: 'Your streak survives the weekend.',             brand: 'Duolingo', qr: true,  offer: '14 days free' },
    { line: 'The second half of tonight is yours.',          brand: 'Red Bull',  offer: 'Buy 2 get 1' },
    { line: 'Bold looks better on you.',                     brand: 'Sugar',     offer: '20% off' },
    { line: 'It is already out for delivery.',               brand: 'Amazon', qr: true,    offer: '\u20B9200 off' }
  ];

  /* The case for out-of-home as a category. Deliberately no figures: any
     recall or reach number here would need a real source (OAAA, WARC,
     Nielsen), and an invented one is worse than none. */
  const oohPoints = [
    { n: '01', title: 'It cannot be closed, skipped or blocked',
      body: 'Every digital format competes for a screen its audience is actively trying to get past. Out-of-home never asks for that permission. It occupies the same physical space as the person, and the only way around it is to look away.' },
    { n: '02', title: 'It builds the memory that gets used later',
      body: 'Brands are chosen from memory at the moment of purchase, not from the last impression served. Physical placement is unusually good at building that memory, because it is met in a real place, in a real mood, with no skip button in the corner.' },
    { n: '03', title: 'Taking up space is itself the signal',
      body: 'A brand that has put something physical in the world has visibly committed to being there. Audiences read that as substance without being told, and it is work that an impression bought at auction simply cannot do.' },
    { n: '04', title: 'It reaches the room, not a segment',
      body: 'Out-of-home speaks to everyone present rather than to a profile. At a dinner table that means it lands on a group at once, in front of each other — which is where recommendations actually get made.' }
  ];

  const reasons = [
    { n: '01', title: 'It is the one ad people open on purpose',
      body: 'Nobody throws away a fortune cookie unopened. It gets cracked, the paper comes out, and the line gets read. There is no scroll past, no skip button, and no way to block it.' },
    { n: '02', title: 'It lands at the best moment of the meal',
      body: 'The cookie arrives with the check: plates cleared, conversation loose, phones already out of pockets. It is the one moment at dinner where a brand is welcome rather than tolerated.' },
    { n: '03', title: 'Fortunes get read out loud',
      body: 'Somebody always reads theirs to the table, and then everyone opens theirs. Your line arrives with a narrator and an audience already sitting down.' },
    { n: '04', title: 'It is small enough to keep',
      body: 'Fortunes end up in wallets, on fridges and in photographs. A message someone chooses to keep is worth more than one they were merely served.' }
  ];

  const formats = [
    { meta: 'The fortune', title: 'Eleven words, read out loud',
      body: 'The line inside the cookie. Written by us or by you, in your voice. It gets read aloud to the whole table \u2014 the only ad unit that comes with a narrator.' },
    { meta: 'The numbers', title: 'Lucky numbers that actually do something',
      body: 'Every fortune carries its six numbers. Make them a discount code, a draw entry or a store number \u2014 the one part of the slip people already read twice.' },
    { meta: 'The code',    title: 'A prize on the back of the slip',
      body: 'A QR or promo code on the reverse, so the fortune has something to redeem and you have something to measure.' },
    { meta: 'Targeting',   title: 'City, cuisine, daypart',
      body: 'Choose where the cookies land: a neighbourhood, a cuisine, a dinner rush, a single street. Placement is a media buy, not a mailing list.' },
    { meta: 'The drop',    title: 'Limited runs for a moment',
      body: 'Short, dated runs built around a launch, a holiday, a fixture, a Lunar New Year service. Scarcity the table can feel.' },
    { meta: 'Co-branding', title: 'Two brands, two sides',
      body: 'The slip has a front and a back. A line each, or a line and a code \u2014 a natural format for a collaboration where both sides get their own surface.' }
  ];

  const targets = [
    { num: '11', label: 'Words on the fortune \u2014 the whole creative brief' },
    { num: '0',  label: 'Ad blockers at the dinner table' },
    { num: '1',  label: 'Message, read aloud, to a table that is already listening' }
  ];

  const posts = [
    { tag: 'Craft',     title: 'Writing for eleven words or fewer', dek: 'The constraint is the format. What survives when there is no room to explain.' },
    { tag: 'Ritual',    title: 'Why the good ad units are objects',  dek: 'Things people hold outlast things people scroll past. A short argument for physical media.' },
    { tag: 'Media',     title: 'Out of home, in the restaurant',     dek: 'Rethinking the category from the table up, where attention is already pointed somewhere.' },
    { tag: 'Building',  title: 'What we are getting wrong so far',   dek: 'Notes from a brand that has not launched yet, written while it is still true.' }
  ];

  return { email, nav, wishes, sampleFortunes, oohPoints, reasons, formats, targets, posts };
})();
