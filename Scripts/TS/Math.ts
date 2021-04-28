// clamps a number between a and b
const clampNumber = (num: number, a: number, b: number): number => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
