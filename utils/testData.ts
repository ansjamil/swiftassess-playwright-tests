// Generate realistic short names
const syllables = [
  "ja", "mi", "ro", "le", "xi", "an", "no", "va", "ra", "so", "ta",
  "ke", "li", "on", "pa", "mo", "ze", "da", "fi", "ha", "ko", "te"
];

// Realistic account name (7 characters max)
export const realisticAccountName = () => {
  const name =
    syllables[Math.floor(Math.random() * syllables.length)] +
    syllables[Math.floor(Math.random() * syllables.length)] +
    syllables[Math.floor(Math.random() * syllables.length)];
  return name.slice(0, 7).toLowerCase();
};

// Realistic email generator
export const uniqueEmail = (domain = 'gmail.com') => {
  const firstNames = ['alex', 'jamie', 'liam', 'sofia', 'noah', 'mia', 'ethan', 'olivia', 'lucas', 'ava'];
  const lastNames = ['smith', 'jones', 'brown', 'lee', 'davis', 'clark', 'adams', 'lopez', 'young', 'king'];

  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const number = Math.floor(Math.random() * 90 + 10); // two-digit suffix like 24, 83

  return `${first}.${last}${number}@${domain}`;
};

// Strong but realistic password (not timestamp-based)
export const strongPassword = () => {
  const words = ['Qa', 'Auto', 'Test', 'Play', 'Write', 'Secure'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 9000 + 1000);
  return `${word}!${num}aA`;
};
