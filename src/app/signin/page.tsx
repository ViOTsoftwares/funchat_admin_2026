"use client";

import { useState } from "react";
import { Validation } from "./validation";
import { LoginApi } from "@/Api/auth";
import { GetMeApi } from "@/Api/admin";
import { menuList } from "@/Router";
import { toastMessage } from "@/lib/toast.message";
import { useRouter } from "next/navigation";
import { isEmpty } from "@/lib/isEmpty";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const { email, password } = formValues;
  const navigate = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormValues((pre) => ({ ...pre, [name]: value }));
    if (value) setErrors((pre) => ({ ...pre, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const err = Validation(formValues);
      if (!isEmpty(err)) {
        setErrors(err);
        return;
      }
      const response = await LoginApi(formValues);
      if (response.success) {
        toastMessage(response.message, "success");
        localStorage.setItem("adminToken", response.token);
        document.cookie = `adminToken=${response.token}; path=/; max-age=${60 * 60 * 24}`;
        try {
          const me = await GetMeApi();
          if (me?.success) {
            const restrictions = encodeURIComponent(JSON.stringify(me.result?.restriction || []));
            const role = encodeURIComponent(me.result?.role || "");
            document.cookie = `adminRestriction=${restrictions}; path=/; max-age=${60 * 60 * 24}`;
            document.cookie = `adminRole=${role}; path=/; max-age=${60 * 60 * 24}`;
            const restrictionList = Array.isArray(me.result?.restriction) ? me.result.restriction : [];
            const getPerm = (label: string) => restrictionList.find((r: any) => r?.module === label) || {};
            const permPaths = menuList.flatMap((menu) => {
              if (menu.subMenu && menu.subMenu.length > 0) {
                return menu.subMenu.filter((sub) => Boolean(sub.path)).map((sub) => {
                  const perm = getPerm(sub.label);
                  return { path: sub.path, view: Boolean(perm.view), add: Boolean(perm.add), edit: Boolean(perm.edit) };
                });
              }
              if (menu.path) {
                const perm = getPerm(menu.label);
                return [{ path: menu.path, view: Boolean(perm.view), add: Boolean(perm.add), edit: Boolean(perm.edit) }];
              }
              return [];
            });
            document.cookie = `adminPermPaths=${encodeURIComponent(JSON.stringify(permPaths))}; path=/; max-age=${60 * 60 * 24}`;
          }
        } catch (err) {
          console.log(err);
        }
        window.location.href = "/";
      } else {
        toastMessage(response.message, "error");
        setLoading(false);
        setErrors((prev) => ({ ...prev, ...response.errors }));
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="si-root">
      {/* Animated background */}
      <div className="si-bg">
        <div className="si-orb si-orb-1" />
        <div className="si-orb si-orb-2" />
        <div className="si-orb si-orb-3" />
        <div className="si-grid" />
      </div>

      <div className="si-card">
        {/* Brand */}
        <div className="si-brand">
          <div className="si-brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L22 7.5V20.5L14 26L6 20.5V7.5L14 2Z" fill="url(#bolt)" />
              <path d="M16 8L11 15H14L12 20L17 13H14L16 8Z" fill="white" />
              <defs>
                <linearGradient id="bolt" x1="6" y1="2" x2="22" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="si-brand-name">FunChat Admin</span>
        </div>

        {/* Header */}
        <div className="si-header">
          <div className="si-lock-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="si-title">Welcome back</h1>
          <p className="si-subtitle">Sign in to your admin dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="si-form">
          {/* Email */}
          <div className="si-field">
            <label className="si-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email Address
            </label>
            <div className="si-input-wrap">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="admin@funchat.live"
                className={`si-input ${errors.email ? "si-input-err" : ""}`}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="si-err">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="si-field">
            <label className="si-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Password
            </label>
            <div className="si-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`si-input si-input-pw ${errors.password ? "si-input-err" : ""}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="si-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="si-err">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="si-btn">
            {loading ? (
              <>
                <span className="si-spinner" />
                Signing in...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <p className="si-footer-note">
          Secured by FunChat Admin Platform · v2026
        </p>
      </div>
    </div>
  );
}
