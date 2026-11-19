"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Check, Loader2, MailCheck } from "lucide-react";
import { signupSchema, SignupFormData } from "@/schemas/signup";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || "terms"; // "terms" | "setup" | "otp" | "details"

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+977",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch("agreeToTerms");

  // --- Step 1: Handle Initial Terms Confirmation ---
  const handleTermsContinue = () => {
    if (agreeToTerms) {
      router.push("/register?step=setup");
    }
  };

  // --- Step 2: Handle Personal Details Submission ---
  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // Example API call to send verification OTP:
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Navigate to OTP verification step
      router.push("/register?step=otp");
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 3: Handle 6-Digit OTP Verification ---
  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join("");
    if (fullCode.length < 6) {
      setOtpError("Please enter all 6 digits of the code");
      return;
    }
    setOtpError(null);
    setIsLoading(true);

    try {
      // Example API call to verify OTP:
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: watch("email"), otp: fullCode }),
      });

      // Proceed to agency details or dashboard
      router.push("/register?step=details");
    } catch (err) {
      setOtpError("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {/* Header / Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-3">
            <span className="text-2xl font-bold text-indigo-600 tracking-tight">
              Authorized Partner
            </span>
          </Link>
          <div className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
              Go to Login
            </Link>
          </div>
        </div>

        {/* ================= STEP 1: TERMS & CONDITIONS ================= */}
        {currentStep === "terms" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Register Your Agency</h2>
              <p className="text-sm text-slate-500 mt-1">
                Before you get started, please review our terms and conditions to ensure a smooth onboarding process.
              </p>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input
                id="remember"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setValue("agreeToTerms", e.target.checked)}
                className="mt-1 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="text-indigo-600 underline font-medium" target="_blank">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-indigo-600 underline font-medium" target="_blank">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button
              type="button"
              disabled={!agreeToTerms}
              onClick={handleTermsContinue}
              className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition ${
                agreeToTerms
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-300 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* ================= STEP 2: ACCOUNT SETUP ================= */}
        {currentStep === "setup" && (
          <form onSubmit={handleSubmit(onSignupSubmit)} className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Step 1 of 3
              </span>
              <h2 className="text-xl font-bold text-slate-900">Set up your Account</h2>
              <p className="text-sm text-slate-500">Provide your personal details.</p>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  placeholder="Enter Your First Name"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
                {errors.firstName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  placeholder="Enter Your Last Name"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
                {errors.lastName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter Your Email Address"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
              />
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="flex space-x-2">
                <select
                  {...register("countryCode")}
                  className="px-2 py-2 border rounded-lg text-sm bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="+977">🇳🇵 +977</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="00-00000000"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-rose-500 mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 border rounded-lg text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 border rounded-lg text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex justify-center items-center space-x-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              <span>Next</span>
            </button>
          </form>
        )}

        {/* ================= STEP 3: 6-DIGIT EMAIL OTP ================= */}
        {currentStep === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MailCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Email Verification Code</h2>
              <p className="text-sm text-slate-500 mt-1">
                We sent a 6-digit email verification code to your email. Enter the code to proceed.
              </p>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ))}
            </div>

            {otpError && <p className="text-xs text-rose-500 font-medium">{otpError}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex justify-center items-center space-x-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              <span>Verify Code</span>
            </button>

            <div className="text-xs text-slate-500">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={() => setResendTimer(60)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Resend Code {resendTimer > 0 ? `in ${resendTimer}s` : ""}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
