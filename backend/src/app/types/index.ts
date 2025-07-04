/* eslint-disable no-undef */
export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export type TSocialLoginPayload = {
  email: string;
  fcmToken: string;
  image?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
};
