export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type TPriority = (typeof PRIORITIES)[number];
