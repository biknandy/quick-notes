export const colors = [
  {
    name: "red",
    value: "0",
    tintColor: "hsl(0, 100%, 68%)",
  },
  {
    name: "orange",
    value: "18",
    tintColor: "hsl(18, 94%, 68%)",
  },
  {
    name: "amber",
    value: "42",
    tintColor: "hsl(42, 82%, 57%)",
  },
  {
    name: "yellow",
    value: "56",
    tintColor: "hsl(56, 73%, 45%)",
  },
  {
    name: "lime",
    value: "80",
    tintColor: "hsl(80, 79%, 43%)",
  },
  {
    name: "green",
    value: "152",
    tintColor: "hsl(152, 96%, 38%)",
  },
  {
    name: "turquoise",
    value: "180",
    tintColor: "hsl(180, 100%, 39%)",
  },
  {
    name: "sky",
    value: "198",
    tintColor: "hsl(198, 100%, 50%)",
  },
  {
    name: "blue",
    value: "220",
    tintColor: "hsl(220, 100%, 64%)",
  },
  {
    name: "indigo",
    value: "252",
    tintColor: "hsl(252, 100%, 67%)",
  },
  {
    name: "purple",
    value: "270",
    tintColor: "hsl(270, 100%, 65%)",
  },
  {
    name: "pink",
    value: "320",
    tintColor: "hsl(320, 100%, 59%)",
  },
];

export const getRandomColor = () => {
  const tintColors = colors.map((c) => c.tintColor);
  return colors[Math.floor(Math.random() * colors.length)];
};
