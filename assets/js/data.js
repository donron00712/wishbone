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
    { meta: 'The wrapper', title: 'A cookie in your colours',
      body: 'The sleeve every cookie arrives in is fully printable. Brand colours, a mark, a texture \u2014 the object in their hands is yours before it is even opened.' },
    { meta: 'The code',    title: 'A prize on the back of the slip',
      body: 'A QR or promo code printed on the reverse, so the fortune has something to redeem and you have something to measure.' },
    { meta: 'Targeting',   title: 'City, cuisine, daypart',
      body: 'Choose where the cookies land: a neighbourhood, a cuisine, a dinner rush, a single street. Placement is a media buy, not a mailing list.' },
    { meta: 'The drop',    title: 'Limited runs for a moment',
      body: 'Short, dated runs built around a launch, a holiday, a fixture, a Lunar New Year service. Scarcity the table can feel.' },
    { meta: 'Co-branding', title: 'Two brands, one table',
      body: 'A run can carry two marks \u2014 the wrapper and the fortune \u2014 which makes it a natural format for a collaboration where both sides get their own surface.' }
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

  return { email, nav, wishes, reasons, formats, targets, posts };
})();
