window.MutinyPacks = window.MutinyPacks || [];

window.MutinyPacks.push({
  id: 'curses',
  name: 'Curses Pack',
  description: 'Cursed cards that will mess with the group.',
  cards: [
    { text: "Left Hand Only. If the group catches {player} using their right hand, {player} drinks. If {player} uses it and get away with it, everyone else drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'physical'] },
    { text: "No Swearing. If the group catches {player} swearing, {player} drinks. If {player} swear and gets away with it, everyone else drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'callout'] },
    { text: "Little Green Man. {player} must remove an imaginary green man from your cup before sipping, and put him back after. Catch {player} forgetting = they drink. {player} gets away with it = group drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'memory'] },
    { text: "Eye Contact. {player} is now Medusa. Anyone who makes eye contact with {player} drinks. But if {player} makes eye contact and someone calls them out first, {player} drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'spicy'] },
    { text: "Pirate Yarr. {player} must end every sentence with 'YARR!'. If the group catches {player} forgetting to say YARR, {player} drinks. If {player} gets away with it, everyone else drinks. Lasts until a new curse overwrites it.", tags: ["persistent", "callout"] },
    { text: "Say my name: {player} must address everyone in the group by name when speaking to them. Catch {player} forgetting = they drink. {player} gets away with it = group drinks. Lasts until a new curse overwrites it.", tags: ["persistent", "callout"] }
  ]
});
