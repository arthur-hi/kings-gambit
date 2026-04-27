window.MutinyPacks = window.MutinyPacks || [];

window.MutinyPacks.push({
  id: 'curses',
  name: 'Curses Pack',
  description: 'Cursed cards that will mess with the group.',
  cards: [
    { text: "Left Hand Only. If the group catches you using your right hand, you drink. If you use it and get away with it, call them out—everyone else drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'physical'] },
    { text: "No Swearing. If the group catches you swearing, you drink. If you swear and get away with it, call them out—everyone else drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'callout'] },
    { text: "Little Green Man. You must remove an imaginary green man from your cup before sipping, and put him back after. Catch {player} forgetting = they drink. {player} gets away with it = group drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'memory'] },
    { text: "Eye Contact. {player} is now Medusa. Anyone who makes eye contact with {player} drinks. But if {player} makes eye contact and someone calls them out first, {player} drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'spicy'] },
  ]
});
