"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { otpSchema, type OTPFormData } from "@/lib/validations/auth";
import Link from "next/link";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { setUser } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function VerifyOTPPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [timer, setTimer] = useState(300); // 5 minutes
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const [verifyOtpFN, { isLoading }] = useVerifyOtpMutation();

  const onSubmit = async (data: OTPFormData) => {
    if (!email) return;

    verifyOtpFN({ email, otp: data?.otp })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          const user = {
            userId: res?.data?._id,
            name: res?.data?.fullName,
            role: res?.data?.role,
            email: res?.data?.email,
          };
          const token = res?.data?.accessToken;
          dispatch(setUser({ user, token }));
          toast.success(res?.message);
          setIsVerified(true);
          form.reset();

          // Redirect after success animation
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong!");
        setTimer(0);
      });
  };

  const [resendFN, { isLoading: isResending }] = useResendOtpMutation();

  const resendOTP = async () => {
    resendFN(email)
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.success) {
          toast.success(res?.message);
          setTimer(300); // Reset timer
          form.reset();
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong!");
      });
  };

  // Handle individual digit input
  const handleOTPChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const currentOTP = form.getValues("otp");
    const otpArray = currentOTP.split("");

    // Update the specific index
    otpArray[index] = value;

    // Fill array to 6 digits
    while (otpArray.length < 6) {
      otpArray.push("");
    }

    const newOTP = otpArray.join("");
    form.setValue("otp", newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOTP.length === 6 && /^\d{6}$/.test(newOTP)) {
      form.handleSubmit(onSubmit)();
    }
  };

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      const currentOTP = form.getValues("otp");
      const otpArray = currentOTP.split("");

      if (!otpArray[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        otpArray[index] = "";
        form.setValue("otp", otpArray.join(""));
      }
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      form.setValue("otp", pastedData);
      // Auto-submit on paste
      setTimeout(() => {
        form.handleSubmit(onSubmit)();
      }, 100);
    }
  };

  const currentOTP = form.watch("otp");
  const otpDigits = Array.from({ length: 6 }, (_, i) => currentOTP[i] || "");

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Verify Your Email
              </CardTitle>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600">
                  Code sent to <span className="font-medium">{email}</span>
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="otp"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="flex justify-between gap-2">
                            {otpDigits.map((digit, index) => (
                              <Input
                                key={index}
                                ref={(el) => {
                                  inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                  handleOTPChange(e.target.value, index)
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                className={`text-center text-xl font-semibold h-12 w-12 ${
                                  error ? "border-red-500" : ""
                                }`}
                                disabled={isLoading}
                              />
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-red-600 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <div className="text-center space-y-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || currentOTP.length !== 6}
                    >
                      {isLoading ? "Verifying..." : "Verify Email"}
                    </Button>

                    <div className="text-sm text-gray-600">
                      {timer > 0 ? (
                        <p>
                          Resend code in{" "}
                          <span className="font-medium">
                            {formatTime(timer)}
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={resendOTP}
                          disabled={isResending}
                          className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                        >
                          {isResending ? (
                            <>
                              <RefreshCw className="h-4 w-4 inline mr-1 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Resend verification code"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Wrong email?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Go back
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
