"use client";

import React, { useEffect, useState } from "react";
import {
  FileField,
  InputField,
  TextareaField,
} from "@/components/UI/Inputs";
import { validation } from "./validate";
import { isEmpty } from "@/lib/isEmpty";
import {
  GetSettingApi,
  UpdateSettingApi,
  GetFeatureControlApi,
  UpdateFeatureControlApi,
  FeatureControl,
  FeatureStatus,
} from "@/Api/setting";
import { toastMessage } from "@/lib/toast.message";
import CardContainer from "@/components/CardContainer";
import { usePermission } from "@/hooks/usePermission";

// ─── Types ───────────────────────────────────────────────────────────────────
type SettingsTab = "app" | "feature";
type FeatureTab = "chat" | "video" | "community";

// ─── Status option config ────────────────────────────────────────────────────
const STATUS_OPTIONS: {
  value: FeatureStatus;
  label: string;
  icon: string;
  description: string;
  gradient: string;
  border: string;
  badge: string;
}[] = [
  {
    value: "live",
    label: "Live",
    icon: "🟢",
    description: "Feature is active and available to all users",
    gradient: "from-emerald-500/10 to-green-500/10",
    border: "border-emerald-400/60",
    badge: "bg-emerald-500",
  },
  {
    value: "coming_soon",
    label: "Coming Soon",
    icon: "🚀",
    description: "Feature is under development and will launch soon",
    gradient: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-400/60",
    badge: "bg-violet-500",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: "🛠️",
    description: "Feature is temporarily down for maintenance",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-400/60",
    badge: "bg-amber-500",
  },
];

const FEATURE_TABS: { key: FeatureTab; label: string; icon: string; color: string }[] = [
  { key: "chat", label: "Chat", icon: "💬", color: "from-blue-500 to-cyan-400" },
  { key: "video", label: "Video", icon: "🎥", color: "from-rose-500 to-pink-400" },
  { key: "community", label: "Community", icon: "👥", color: "from-violet-500 to-purple-400" },
];

// ─── Sub-component: Status Picker ────────────────────────────────────────────
function StatusPicker({
  feature,
  value,
  onChange,
}: {
  feature: FeatureTab;
  value: FeatureStatus;
  onChange: (v: FeatureStatus) => void;
}) {
  const info = FEATURE_TABS.find((f) => f.key === feature)!;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{info.icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{info.label} Feature Control</h3>
          <p className="text-sm text-gray-500">Set the current status for the {info.label.toLowerCase()} feature</p>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white ${
              STATUS_OPTIONS.find((s) => s.value === value)?.badge ?? "bg-gray-400"
            }`}
          >
            {STATUS_OPTIONS.find((s) => s.value === value)?.icon}{" "}
            {STATUS_OPTIONS.find((s) => s.value === value)?.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATUS_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                relative flex flex-col items-center gap-3 rounded-2xl border-2 px-5 py-6 cursor-pointer
                transition-all duration-200 hover:scale-[1.02] hover:shadow-md text-left
                bg-gradient-to-br ${opt.gradient}
                ${selected ? `${opt.border} shadow-md ring-2 ring-offset-1 ring-inset` : "border-gray-200 hover:border-gray-300"}
              `}
            >
              {selected && (
                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-white text-xs font-bold">
                  ✓
                </span>
              )}
              <span className="text-3xl">{opt.icon}</span>
              <div className="text-center">
                <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const SettingsPage = () => {
  // ── App Settings State ──
  const [formValues, setFormValues] = useState({
    title: "",
    address: "",
    phone: "",
    email: "",
    project: "",
    client: "",
    id: "",
    linkedinlink: "",
    xlink: "",
    instagramlink: "",
    facebooklink: "",
    logo: null as File | null,
  });
  const {
    address, client, email, logo, phone, project, title, id,
    linkedinlink, xlink, instagramlink, facebooklink,
  } = formValues;
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const permission = usePermission("Site Content");

  // ── Tab State ──
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>("app");
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTab>("chat");

  // ── Feature Control State ──
  const [featureControl, setFeatureControl] = useState<FeatureControl>({
    chat: "live",
    video: "live",
    community: "live",
  });
  const [featureLoading, setFeatureLoading] = useState(false);
  const [featureSaved, setFeatureSaved] = useState(false);

  // ── Helpers ──
  const revokeIfBlobUrl = (url: string | null) => {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    return () => { revokeIfBlobUrl(logoPreview); };
  }, [logoPreview]);

  // ── App Settings handlers ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((pre) => ({ ...pre, [name]: value }));
    if (value) setErrors((pre) => ({ ...pre, [name]: "" }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    revokeIfBlobUrl(logoPreview);
    setFormValues((pre) => ({ ...pre, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permission.edit) {
      toastMessage("You don't have permission to save settings", "error");
      return;
    }
    const err = validation(formValues, Boolean(logoPreview));
    if (!isEmpty(err)) { setErrors(err); return; }
    setLoading(true);
    try {
      const fs = new FormData();
      fs.append("address", address);
      fs.append("client", client);
      fs.append("email", email);
      fs.append("phone", phone);
      fs.append("project", project);
      fs.append("title", title);
      fs.append("id", id);
      fs.append("linkedinlink", linkedinlink);
      fs.append("xlink", xlink);
      fs.append("instagramlink", instagramlink);
      fs.append("facebooklink", facebooklink);
      if (logo instanceof File) fs.append("logo", logo);
      const response = await UpdateSettingApi(fs);
      if (response.success) {
        toastMessage(response.message, "success");
      } else {
        setErrors((prev) => ({ ...prev, ...response.errors }));
      }
    } catch {
      toastMessage("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Feature Control handlers ──
  const handleFeatureStatusChange = (feature: FeatureTab, status: FeatureStatus) => {
    setFeatureControl((prev) => ({ ...prev, [feature]: status }));
    setFeatureSaved(false);
  };

  const handleFeatureControlSave = async () => {
    if (!permission.edit) {
      toastMessage("You don't have permission to update feature control", "error");
      return;
    }
    setFeatureLoading(true);
    try {
      const response = await UpdateFeatureControlApi(featureControl);
      if (response.success) {
        toastMessage("Feature control updated successfully", "success");
        setFeatureSaved(true);
      } else {
        toastMessage(response.message || "Failed to update", "error");
      }
    } catch {
      toastMessage("Something went wrong", "error");
    } finally {
      setFeatureLoading(false);
    }
  };

  // ── Load data ──
  useEffect(() => {
    getsetting();
    getFeatureControl();
  }, []);

  const getsetting = async () => {
    try {
      setLoading(true);
      const response = await GetSettingApi();
      setLogoPreview(response?.result?.logo);
      setFormValues({ ...response?.result, id: response?.result._id, logo: null });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureControl = async () => {
    try {
      const response = await GetFeatureControlApi();
      if (response.success && response.result) {
        setFeatureControl(response.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CardContainer>
      {/* ── Page Header ── */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Application Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage company configuration and feature availability</p>
        </div>

        {/* ── Top-level Tabs ── */}
        <div className="flex border-b bg-gray-50">
          <button
            id="settings-tab-app"
            type="button"
            onClick={() => setActiveSettingsTab("app")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeSettingsTab === "app"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>⚙️</span> App Settings
          </button>
          <button
            id="settings-tab-feature"
            type="button"
            onClick={() => setActiveSettingsTab("feature")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeSettingsTab === "feature"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>🎛️</span> Feature Control
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            APP SETTINGS TAB
        ═══════════════════════════════════════════════════════════════ */}
        {activeSettingsTab === "app" && (
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Title"
                name="title"
                value={title}
                onChange={handleChange}
                error={errors.title}
              />
              <InputField
                label="Project"
                name="project"
                value={project}
                onChange={handleChange}
                error={errors.project}
              />
              <InputField
                label="Client"
                name="client"
                value={client}
                onChange={handleChange}
                error={errors.client}
              />
              <InputField
                label="Phone"
                name="phone"
                value={phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            <TextareaField
              label="Address"
              name="address"
              rows={3}
              value={address}
              onChange={handleChange}
              error={errors.address}
            />
            <FileField
              label="Company Logo"
              preview={logoPreview}
              error={errors.logo}
              onChange={handleLogoChange}
            />
            <InputField
              label="X link"
              name="xlink"
              value={xlink}
              onChange={handleChange}
              error={errors.xlink}
            />{" "}
            <InputField
              label="linkedinlink"
              name="linkedinlink"
              value={linkedinlink}
              onChange={handleChange}
              error={errors.linkedinlink}
            />{" "}
            <InputField
              label="facebooklink"
              name="facebooklink"
              value={facebooklink}
              onChange={handleChange}
              error={errors.facebooklink}
            />{" "}
            <InputField
              label="Instagramlink"
              name="instagramlink"
              value={instagramlink}
              onChange={handleChange}
              error={errors.instagramlink}
            />
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              {permission.edit && (
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Settings
                </button>
              )}
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            FEATURE CONTROL TAB
        ═══════════════════════════════════════════════════════════════ */}
        {activeSettingsTab === "feature" && (
          <div className="px-8 py-6">
            {/* Info Banner */}
            <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-5 py-4 flex items-start gap-3">
              <span className="text-xl mt-0.5">ℹ️</span>
              <div>
                <p className="text-sm font-medium text-blue-800">Feature Visibility Control</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Control the availability of Chat, Video, and Community features for end users.
                  Changes apply immediately once saved.
                </p>
              </div>
            </div>

            {/* Feature Sub-Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
              {FEATURE_TABS.map((tab) => {
                const currentStatus = featureControl[tab.key];
                const statusInfo = STATUS_OPTIONS.find((s) => s.value === currentStatus);
                return (
                  <button
                    key={tab.key}
                    id={`feature-tab-${tab.key}`}
                    type="button"
                    onClick={() => setActiveFeatureTab(tab.key)}
                    className={`
                      relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${activeFeatureTab === tab.key
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {/* Status dot indicator on tab */}
                    <span
                      className={`ml-1 inline-block w-2 h-2 rounded-full ${statusInfo?.badge ?? "bg-gray-300"}`}
                      title={statusInfo?.label}
                    />
                  </button>
                );
              })}
            </div>

            {/* Status Picker for active feature tab */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 transition-all duration-200">
              <StatusPicker
                feature={activeFeatureTab}
                value={featureControl[activeFeatureTab]}
                onChange={(v) => handleFeatureStatusChange(activeFeatureTab, v)}
              />
            </div>

            {/* Summary strip */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {FEATURE_TABS.map((tab) => {
                const statusInfo = STATUS_OPTIONS.find((s) => s.value === featureControl[tab.key])!;
                return (
                  <div
                    key={tab.key}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 bg-gradient-to-br ${statusInfo.gradient} ${statusInfo.border}`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{tab.label}</p>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                        <span>{statusInfo.icon}</span> {statusInfo.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={() => {
                  setFeatureControl({ chat: "live", video: "live", community: "live" });
                  setFeatureSaved(false);
                }}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Reset to Live
              </button>
              {permission.edit && (
                <button
                  id="feature-control-save-btn"
                  type="button"
                  onClick={handleFeatureControlSave}
                  disabled={featureLoading}
                  className={`
                    flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-200
                    ${featureSaved
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-blue-600 hover:bg-blue-700"
                    }
                    disabled:opacity-60 disabled:cursor-not-allowed
                  `}
                >
                  {featureLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving…
                    </>
                  ) : featureSaved ? (
                    <>✓ Saved</>
                  ) : (
                    <>Save Feature Control</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </CardContainer>
  );
};

export default SettingsPage;
