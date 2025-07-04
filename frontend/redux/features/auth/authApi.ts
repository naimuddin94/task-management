import { baseApi } from "@/redux/api/baseApi";
import { TProfile, TResponse } from "@/types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (newUser) => ({
        url: "/auth/signup",
        method: "POST",
        body: newUser,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-signup-otp",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/resend",
        method: "POST",
        body: { email },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/signout",
        method: "POST",
      }),
      invalidatesTags: ["users", "history"],
    }),
    getProfile: builder.query<TResponse<TProfile>, any, null>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;
