// data_structures/showInteractions.js

// Breaking Bad characters
const nodes = [
  { id: "Walter",    label: "Walter White" },
  { id: "Jesse",     label: "Jesse Pinkman" },
  { id: "Skyler",    label: "Skyler White" },
  { id: "Hank",      label: "Hank Schrader" },
  { id: "Saul",      label: "Saul Goodman" },
  { id: "Gus",       label: "Gus Fring" },
  { id: "Mike",      label: "Mike Ehrmantraut" },
  { id: "Marie",     label: "Marie Schrader" },
  { id: "Todd",      label: "Todd Alquist" },
  { id: "Walter Jr", label: "Walter White, Jr." },
  { id: "Skinny Pete",  label: "Skinny Pete" },
  { id: "Badger",    label: "Brandon Mayhew" },
  { id: "Jane",      label: "Jane Margolis" },
  { id: "Ted",       label: "Ted Beneke" },
  { id: "Lydia",     label: "Lydia Rodarte-Quayle" },
  { id: "Gomez",     label: "Steven Gomez" },
  { id: "Huell",     label: "Huell Babineaux" },
  { id: "Tyrus",     label: "Tyrus Kitt" },
  { id: "Carmen",    label: "Carmen Molina" },
  { id: "Andrea",    label: "Andrea Cantillo" },
  { id: "Francesca", label: "Francesca Liddy" },
  { id: "Tuco",      label: "Tuco Salamanca" },
  { id: "Hector",    label: "Hector Salamanca" },
];

// “Links” with estimated interaction‐counts as `value`
const links = [
  // Walter’s core network
  { source: "Walter", target: "Jesse",    value: 120 },
  { source: "Walter", target: "Skyler",   value: 80  },
  { source: "Walter", target: "Hank",     value: 35  },
  { source: "Walter", target: "Saul",     value: 60  },
  { source: "Walter", target: "Gus",      value: 25  },
  { source: "Walter", target: "Mike",     value: 20  },
  { source: "Walter", target: "Walter Jr",value: 50  },
  { source: "Walter", target: "Tuco",     value: 10  },
  { source: "Walter", target: "Hector",   value: 8   },
  { source: "Walter", target: "Carmen",   value: 15  },

  // Jesse’s circle
  { source: "Jesse",  target: "Badger",      value: 30 },
  { source: "Jesse",  target: "Skinny Pete", value: 28 },
  { source: "Jesse",  target: "Jane",        value: 22 },
  { source: "Jesse",  target: "Andrea",      value: 18 },

  // Saul’s legal/criminal network
  { source: "Saul",   target: "Francesca", value: 12 },
  { source: "Saul",   target: "Huell",     value: 14 },
  { source: "Saul",   target: "Mike",      value: 32 },
  { source: "Saul",   target: "Gus",       value: 28 },
  { source: "Saul",   target: "Lydia",     value: 16 },
  { source: "Saul",   target: "Ted",       value: 10 },

  // Gus / Mike enforcers
  { source: "Gus",    target: "Mike",      value: 40 },
  { source: "Gus",    target: "Tyrus",     value: 20 },
  { source: "Mike",   target: "Tyrus",     value: 18 },

  // Hank / Marie / Gomez family
  { source: "Hank",   target: "Marie",     value: 25 },
  { source: "Hank",   target: "Gomez",     value: 22 },

  // Salamanca cartel
  { source: "Tuco",   target: "Hector",    value: 15 },
  { source: "Tuco",   target: "Saul",      value: 5  },
  { source: "Hector", target: "Saul",      value: 6  },

  // Minor but memorable
  { source: "Marie",  target: "Skyler",    value: 20 },
  { source: "Carmen", target: "Skyler",    value: 12 },
  { source: "Ted",    target: "Skyler",    value: 14 },
];

export default {
  nodes,
  links
};
