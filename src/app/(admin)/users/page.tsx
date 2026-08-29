"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Copy, Check } from "lucide-react";
import { toastMessage } from "@/lib/toast.message";
import ServerSIdeTable from "@/components/GlobalTable/ServerSIdeTable";
import Swal from "sweetalert2";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AppUserListApi, ToggleUserStatusApi, DeleteUserApi } from "@/Api/users";
import { usePermission } from "@/hooks/usePermission";

export default function UserList() {
  const tableRef = useRef<{ reload: () => void }>(null);
  const userPermission = usePermission("User Management");
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  // Summary Metrics State
  const [metrics, setMetrics] = useState({
    total: 0,
    activeOtp: 0,
    banned: 0,
  });

  const handleCopyOtp = (otp: string, id: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtpId(id);
    toastMessage(`OTP ${otp} copied to clipboard!`, "success");
    setTimeout(() => setCopiedOtpId(null), 2000);
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    toastMessage(`Email ${email} copied!`, "info");
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const nextStatus = user.status === "banned" ? "active" : "banned";
      const isBanning = nextStatus === "banned";

      const result = await Swal.fire({
        title: isBanning ? "Ban Account?" : "Activate Account?",
        text: `Are you sure you want to ${isBanning ? "suspend" : "reactivate"} @${user.username || user.email}?`,
        icon: isBanning ? "warning" : "question",
        showCancelButton: true,
        confirmButtonColor: isBanning ? "#ef4444" : "#10b981",
        cancelButtonColor: "#64748b",
        confirmButtonText: isBanning ? "Yes, Suspend Account" : "Yes, Activate Account",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-gray-100",
        },
      });

      if (result.isConfirmed) {
        const res = await ToggleUserStatusApi({ id: user._id, status: nextStatus });
        if (res.success) {
          toastMessage(res.message, "success");
          tableRef.current?.reload();
        } else {
          toastMessage(res.message || "Failed to update status", "error");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete Account Permanently?",
        text: `Are you sure you want to delete @${username}? This action cannot be reversed!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, Delete Permanently",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-gray-100",
        },
      });

      if (result.isConfirmed) {
        const res = await DeleteUserApi({ id });
        if (res.success) {
          toastMessage("User deleted successfully", "success");
          tableRef.current?.reload();
        } else {
          toastMessage(res.message || "Failed to delete user", "error");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return [
      {
        id: "user",
        header: "User Handle & Details",
        meta: { filterType: "text" },
        accessorKey: "username",
        cell: ({ row }) => {
          const user = row.original;
          const initial = (user.username || user.email || "U").charAt(0).toUpperCase();

          return (
            <div className="flex items-center gap-3 py-1.5 min-w-[200px]">
              <div className="relative flex-shrink-0">
                {user.avatar && user.avatar.startsWith("http") ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-11 w-11 rounded-full object-cover border-2 border-indigo-500/30 shadow-md"
                  />
                ) : (
                  <div
                    className="h-11 w-11 rounded-full text-white flex items-center justify-center font-bold text-base shadow-md border-2 border-white/20"
                    style={{
                      background:
                        user.avatar && user.avatar.startsWith("linear-gradient")
                          ? user.avatar
                          : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    }}
                  >
                    {initial}
                  </div>
                )}
                {user.status === "banned" && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"
                    title="Banned Account"
                  />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 text-sm tracking-tight truncate">
                    @{user.username || "unnamed"}
                  </span>
                  {user.isVerified && (
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px]"
                      title="Verified User"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <span className="truncate max-w-[160px] font-mono text-[11.5px]" title={user.email}>
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(user.email, user._id)}
                    className="text-gray-400 hover:text-indigo-600 transition p-0.5 rounded"
                    title="Copy Email"
                  >
                    {copiedEmailId === user._id ? (
                      <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "otp",
        header: "Live Verification OTP",
        cell: ({ row }) => {
          const user = row.original;
          const hasOtp = Boolean(user.otp);
          const isExpired = user.otpExpiresAt ? new Date() > new Date(user.otpExpiresAt) : true;

          if (!hasOtp) {
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200/60">
                No Active OTP
              </span>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border shadow-sm transition-all ${
                  isExpired
                    ? "bg-amber-50/80 text-amber-700 border-amber-200/80"
                    : "bg-emerald-50/90 text-emerald-800 border-emerald-300/80 ring-2 ring-emerald-500/10"
                }`}
              >
                <span className="text-base">{isExpired ? "⏳" : "⚡"}</span>
                <span className="tracking-widest">{user.otp}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyOtp(user.otp, user._id)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-xs flex items-center gap-1 ${
                  copiedOtpId === user._id
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-indigo-600"
                }`}
                title="Copy OTP to Clipboard"
              >
                {copiedOtpId === user._id ? (
                  <>
                    <span>✓</span>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          );
        },
      },
      {
        id: "otpExpiresAt",
        header: "OTP Expiry Countdown",
        cell: ({ row }) => {
          const user = row.original;
          if (!user.otp || !user.otpExpiresAt) {
            return <span className="text-xs text-gray-400 font-mono">-</span>;
          }

          const expiryDate = new Date(user.otpExpiresAt);
          const now = new Date();
          const isExpired = now > expiryDate;

          if (isExpired) {
            return (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Expired ({expiryDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})
              </span>
            );
          }

          const diffMinutes = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / 60000));
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Valid for {diffMinutes} min
            </span>
          );
        },
      },
      {
        accessorKey: "authProvider",
        header: "Auth Provider",
        meta: { filterType: "text" },
        cell: ({ row }) => {
          const provider = row.original.authProvider || "email";
          const isGoogle = provider === "google";
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isGoogle
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}
            >
              <span>{isGoogle ? "🌐" : "✉️"}</span>
              <span>{isGoogle ? "Google OAuth" : "Email OTP"}</span>
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Account Status",
        cell: ({ row }) => {
          const user = row.original;
          const isBanned = user.status === "banned";
          return (
            <button
              type="button"
              onClick={() => handleToggleStatus(user)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-2xs hover:scale-105 ${
                isBanned
                  ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              }`}
              title="Click to toggle status"
            >
              <span className={`w-2 h-2 rounded-full ${isBanned ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
              <span>{isBanned ? "Suspended" : "Active"}</span>
            </button>
          );
        },
      },
      {
        id: "createdAt",
        header: "Registered Date",
        cell: ({ row }) => {
          const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
          return (
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-gray-800">
                {date ? date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}
              </span>
              {date && (
                <span className="text-[11px] text-gray-400">
                  {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const user = row.original;
          const isBanned = user.status === "banned";
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleStatus(user)}
                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isBanned
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                }`}
                title={isBanned ? "Reactivate User Account" : "Suspend User Account"}
              >
                {isBanned ? "Unban" : "Ban"}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteUser(user._id, user.username || user.email)}
                className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-200/80 hover:border-red-600 shadow-2xs hover:shadow-md"
                title="Delete User Account"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ];
  }, [copiedOtpId, copiedEmailId]);

  const fetchData = useCallback(
    async ({
      pageIndex,
      pageSize,
      filter,
    }: {
      pageIndex: number;
      pageSize: number;
      filter: any;
    }) => {
      const body = {
        page: pageIndex + 1,
        limit: pageSize,
        filter,
      };

      const res = await AppUserListApi(body);
      const list = res?.result?.list || [];
      const count = res?.result?.count || 0;

      // Update Live Metrics safely without causing state loops
      const now = new Date();
      const activeOtps = list.filter(
        (u: any) => u.otp && u.otpExpiresAt && new Date(u.otpExpiresAt) > now
      ).length;
      const bannedCount = list.filter((u: any) => u.status === "banned").length;

      setMetrics((prev) => {
        if (
          prev.total === count &&
          prev.activeOtp === activeOtps &&
          prev.banned === bannedCount
        ) {
          return prev;
        }
        return { total: count, activeOtp: activeOtps, banned: bannedCount };
      });

      return {
        data: list,
        total: count,
      };
    },
    []
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumbs */}
      <Breadcrumbs path="App Users" />

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/20">
        {/* Ambient Decorative Glow */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3 backdrop-blur-md">
              <span>👥 User Directory & Live Security</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              App Users Directory
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              View and manage registered user handles, inspect real-time login OTP codes, track expiration status, and moderate user accounts.
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-lg">
                👥
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Total Users</div>
                <div className="text-lg font-bold text-white">{metrics.total}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/30 flex items-center justify-center text-lg">
                ⚡
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Active OTPs</div>
                <div className="text-lg font-bold text-emerald-400">{metrics.activeOtp}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-red-500/30 border border-red-400/30 flex items-center justify-center text-lg">
                🚫
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Suspended</div>
                <div className="text-lg font-bold text-red-400">{metrics.banned}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden p-4 sm:p-6">
        <ServerSIdeTable ref={tableRef} columns={columns} fetchApi={fetchData} />
      </div>
    </div>
  );
}
