export type TNavItems = { name: string; href: string }[];

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  meta: TMeta | null;
  success: boolean;
};

export type TProfile = {
  _id: string;
  fullName: string;
  email: string;
  image: string | null;
  isSocialLogin: boolean;
  provider: string | null;
  role: string;
  lastActiveAt: Date;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TCategory = {
  _id: string;
  name: string;
  color: string;
};

export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type TPriority = (typeof PRIORITIES)[number];

export type TTask = {
  _id: string;
  user: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  priority: TPriority;
  category: TCategory | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TSearchParams = {
  searchTerm: string;
  page: string;
  limit: string;
  [val: string]: string;
};
