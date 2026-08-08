"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { OneAdApi, UpdateAdApi } from "@/Api/advertisement";
import { toastMessage } from "@/lib/toast.message";
import Breadcrumbs from "@/components/Breadcrumbs";
import Spinner from "@/components/Spinner";
import { ENV } from "@/config";

export default function UpdateAdvertisement() {
  const navigate = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    placement: "popup_interstitial",
    adType: "custom_banner",
    thirdPartyNetwork: "Direct Advertiser",
    googleClientId: "",
    googleSlotId: "",
    googleAdFormat: "auto",
    iframeUrl: "",
    image: "",
    targetUrl: "",
    ctaText: "Claim Special Deal",
    badgeText: "LIMITED OFFER",
    description: "",
    scriptCode: "",
    priority: 10,
    isActive: true,
    // Popup Controls
    popupEnabled: true,
    popupDelaySeconds: 3,
    popupFrequency: "once_per_session",
    popupAutoCloseSeconds: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response: any = await OneAdApi(id);
        if (response.ok && response.data) {
          const ad = response.data;
          setFormData({
            _id: ad._id,
            title: ad.title || "",
            placement: ad.placement || "popup_interstitial",
            adType: ad.adType || "custom_banner",
            thirdPartyNetwork: ad.thirdPartyNetwork || "Direct Advertiser",
            googleClientId: ad.googleClientId || "",
            googleSlotId: ad.googleSlotId || "",
            googleAdFormat: ad.googleAdFormat || "auto",
            iframeUrl: ad.iframeUrl || "",
            image: ad.image || "",
            targetUrl: ad.targetUrl || "",
            ctaText: ad.ctaText || "Claim Special Deal",
            badgeText: ad.badgeText || "LIMITED OFFER",
            description: ad.description || "",
            scriptCode: ad.scriptCode || "",
            priority: ad.priority || 0,
            isActive: ad.isActive ?? true,
            popupEnabled: ad.popupEnabled ?? true,
            popupDelaySeconds: ad.popupDelaySeconds ?? 3,
            popupFrequency: ad.popupFrequency || "once_per_session",
            popupAutoCloseSeconds: ad.popupAutoCloseSeconds || 0,
          });
          if (ad.image) {
            setImagePreview(`${ENV.IMAGE_URL}/logos/${ad.image}`);
          }
        } else {
          toastMessage("Advertisement not found", "error");
          navigate.push("/ads");
        }
      } catch (error) {
        toastMessage("Something went wrong", "error");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchAd();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "file") {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("_id", formData._id);
      data.append("title", formData.title);
      data.append("placement", formData.placement);
      data.append("adType", formData.adType);
      data.append("thirdPartyNetwork", formData.thirdPartyNetwork);
      data.append("googleClientId", formData.googleClientId);
      data.append("googleSlotId", formData.googleSlotId);
      data.append("googleAdFormat", formData.googleAdFormat);
      data.append("iframeUrl", formData.iframeUrl);
      data.append("targetUrl", formData.targetUrl);
      data.append("ctaText", formData.ctaText);
      data.append("badgeText", formData.badgeText);
      data.append("description", formData.description);
      data.append("scriptCode", formData.scriptCode);
      data.append("priority", String(formData.priority));
      data.append("isActive", String(formData.isActive));
      // Popup Settings
      data.append("popupEnabled", String(formData.popupEnabled));
      data.append("popupDelaySeconds", String(formData.popupDelaySeconds));
      data.append("popupFrequency", formData.popupFrequency);
      data.append("popupAutoCloseSeconds", String(formData.popupAutoCloseSeconds));

      if (imageFile) {
        data.append("image", imageFile);
      }

      const response: any = await UpdateAdApi(data);
      if (response.ok || response.success) {
        toastMessage(response.message || "Advertisement updated successfully", "success");
        navigate.push("/ads");
      } else {
        toastMessage(response.message || "Failed to update advertisement", "error");
      }
    } catch (error) {
      toastMessage("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumbs path="Advertisements" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Update Advertisement / Popup Dialog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Modify popup trigger delays, frequency, banner graphics, or third-party ad networks
          </p>
        </div>
      </div>
      <div className="h-px bg-gray-200" />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign / Ad Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Placement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frontend Slot / Placement *</label>
            <select
              name="placement"
              value={formData.placement}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white font-medium text-blue-900"
            >
              <option value="popup_interstitial">🔥 Popup Interstitial Dialog (Modal)</option>
              <option value="community_sidebar">Community Sidebar (Left Menu)</option>
              <option value="chat_top_banner">Chat Header Banner</option>
              <option value="chat_bottom_banner">Chat Footer Banner</option>
              <option value="video_call_banner">Video Call Sponsor Card</option>
              <option value="landing_featured">Landing Page Featured Card</option>
            </select>
          </div>

          {/* Ad Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type / Provider *</label>
            <select
              name="adType"
              value={formData.adType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white font-medium"
            >
              <option value="custom_banner">🖼️ Custom Banner & Direct Sponsor Link</option>
              <option value="google_adsense">⚡ Google AdSense (Auto / Slot Code)</option>
              <option value="custom_script">📜 Third-Party Ad Script / HTML Tag</option>
              <option value="iframe_embed">🌐 External Iframe Embed URL</option>
            </select>
          </div>

          {/* --- POPUP SETTINGS & DELAYS SECTION --- */}
          <div className="md:col-span-2 p-4 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 rounded-xl border border-indigo-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <div>
                  <h4 className="font-bold text-indigo-950 text-sm">Popup Settings & Trigger Delays</h4>
                  <p className="text-xs text-indigo-700">Controls when and how often this ad opens in an interactive modal</p>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm">
                <input
                  type="checkbox"
                  name="popupEnabled"
                  checked={formData.popupEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-xs font-bold text-indigo-900">Enable Popup</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Trigger Delay */}
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  Popup Trigger Delay
                </label>
                <select
                  name="popupDelaySeconds"
                  value={formData.popupDelaySeconds}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value={1}>1 Second (Quick)</option>
                  <option value={3}>3 Seconds (Recommended)</option>
                  <option value={5}>5 Seconds (Medium)</option>
                  <option value={10}>10 Seconds (High Engagement)</option>
                  <option value={15}>15 Seconds (Late Prompt)</option>
                  <option value={0}>0s (Instant on Page Load)</option>
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  Display Frequency
                </label>
                <select
                  name="popupFrequency"
                  value={formData.popupFrequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="once_per_session">Once Per Session (Best UX)</option>
                  <option value="every_page_view">Every Page Visit</option>
                  <option value="once_per_day">Once Per Day</option>
                </select>
              </div>

              {/* Auto Close */}
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  Auto-Close Timer
                </label>
                <select
                  name="popupAutoCloseSeconds"
                  value={formData.popupAutoCloseSeconds}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value={0}>Manual Close Only (Default)</option>
                  <option value={5}>Auto Close After 5s</option>
                  <option value={10}>Auto Close After 10s</option>
                  <option value={15}>Auto Close After 15s</option>
                </select>
              </div>
            </div>
          </div>

          {/* Network Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Network / Sponsor Name</label>
            <input
              type="text"
              name="thirdPartyNetwork"
              value={formData.thirdPartyNetwork}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Badge text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
            <input
              type="text"
              name="badgeText"
              value={formData.badgeText}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* --- GOOGLE ADSENSE FIELDS --- */}
          {formData.adType === "google_adsense" && (
            <div className="md:col-span-2 p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <h4 className="font-semibold text-amber-900 text-sm">Google AdSense Configuration</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-950 mb-1">
                    Publisher / Client ID (data-ad-client) *
                  </label>
                  <input
                    type="text"
                    name="googleClientId"
                    required
                    value={formData.googleClientId}
                    onChange={handleChange}
                    placeholder="ca-pub-1234567890123456"
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-950 mb-1">
                    Ad Unit Slot ID (data-ad-slot) *
                  </label>
                  <input
                    type="text"
                    name="googleSlotId"
                    required
                    value={formData.googleSlotId}
                    onChange={handleChange}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- CUSTOM SCRIPT CODE FIELDS --- */}
          {formData.adType === "custom_script" && (
            <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📜</span>
                <h4 className="font-semibold text-slate-800 text-sm">Third-Party Script / HTML Embed Code</h4>
              </div>
              <textarea
                name="scriptCode"
                rows={6}
                required
                value={formData.scriptCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* --- IFRAME EMBED FIELDS --- */}
          {formData.adType === "iframe_embed" && (
            <div className="md:col-span-2 p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <h4 className="font-semibold text-blue-900 text-sm">Iframe Ad URL</h4>
              </div>
              <input
                type="url"
                name="iframeUrl"
                required
                value={formData.iframeUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* --- CUSTOM BANNER GRAPHIC FIELDS --- */}
          {formData.adType === "custom_banner" && (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Banner Graphic</label>
                {imagePreview && (
                  <div className="mb-3 flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="h-20 w-36 rounded-lg object-cover border border-gray-300 bg-white shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {imageFile ? "New Selected Image" : "Current Active Banner"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {imageFile ? imageFile.name : formData.image || "Saved image"}
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination / Affiliate URL</label>
                <input
                  type="url"
                  name="targetUrl"
                  value={formData.targetUrl}
                  onChange={handleChange}
                  placeholder="https://advertiser.com/deal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Short Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </>
          )}

          {/* Priority & Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Priority (Higher = First)</label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center md:pt-7">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-900">
              Active (Serving on Frontend)
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#0f172a] text-white font-medium rounded-lg hover:bg-[#020617] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] transition-all disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Spinner size="w-6 h-6" color="text-white" text="" /> : "Update Advertisement"}
          </button>
          <button
            type="button"
            onClick={() => navigate.push("/ads")}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
