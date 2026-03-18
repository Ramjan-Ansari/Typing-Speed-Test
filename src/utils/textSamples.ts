export const SAMPLES: string[] = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes progress. Keep typing to improve your speed and accuracy.",
  "Web development combines creativity with logic — build small projects every day.",
  "Typing fast is great, but typing accurately will get you further in the long run."
];

// Optional helper
export const getRandomSample = (): string => {
  return SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
};