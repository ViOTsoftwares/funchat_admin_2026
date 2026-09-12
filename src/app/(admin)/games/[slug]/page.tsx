"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { OneGameApi, UpdateGameApi, UpdateGameStatusApi, DeleteGameApi, Game, GameStatus } from "@/Api/game";
import { toastMessage } from "@/lib/toast.message";
import Breadcrumbs from "@/components/Breadcrumbs";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

// Status definitions
const STATUS_OPTIONS: {
  value: GameStatus;
  label: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  gradient: string;
  description: string;
  userImpact: string;
}[] = [
  {
    value: "active",
    label: "Active / Live",
    icon: "🟢",
    badgeBg: "bg-emerald-500",
    badgeText: "text-emerald-700",
    border: "border-emerald-500",
    gradient: "from-emerald-50 to-green-50/50",
    description: "The game is active and playable right now.",
    userImpact: "Players on /game or /game/[slug] can enter the lobby, matchmake, and play live.",
  },
  {
    value: "coming_soon",
    label: "Coming Soon",
    icon: "🚀",
    badgeBg: "bg-indigo-500",
    badgeText: "text-indigo-700",
    border: "border-indigo-500",
    gradient: "from-indigo-50 to-purple-50/50",
    description: "The game is in development or pre-launch.",
    userImpact: "Visiting /game/[slug] displays the Coming Soon preview page and launch teaser.",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: "🛠️",
    badgeBg: "bg-amber-500",
    badgeText: "text-amber-700",
    border: "border-amber-500",
    gradient: "from-amber-50 to-orange-50/50",
    description: "The game is temporarily taken offline for maintenance.",
    userImpact: "Visiting /game/[slug] displays the Maintenance notice with your custom message.",
  },
];

export default function GameControlPage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = (params?.slug as string) || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [game, setGame] = useState<Game | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    status: "active" as GameStatus,
    subtitle: "",
    description: "",
    badge: "",
    players: "2–8 Players",
    duration: "60s Rounds",
    maintenanceNotice: "",
    comingSoonNotice: "",
    color: "linear-gradient(135deg, #f59e0b, #ec4899)",
    icon: "SportsEsports",
  });

  // Fetch Game Details
  const fetchGame = async () => {
    if (!slugParam) return;
    try {
      setLoading(true);
      const res = await OneGameApi(slugParam);
      if (res.success && res.result) {
        setGame(res.result);
        setFormData({
          title: res.result.title || "",
          slug: res.result.slug || slugParam,
          status: res.result.status || "active",
          subtitle: res.result.subtitle || "",
          description: res.result.description || "",
          badge: res.result.badge || "",
          players: res.result.players || "2–8 Players",
          duration: res.result.duration || "60s Rounds",
          maintenanceNotice:
            res.result.maintenanceNotice ||
            "This game is currently undergoing scheduled maintenance. Please check back shortly!",
          comingSoonNotice:
            res.result.comingSoonNotice ||
            "This game is currently in development and will launch soon. Stay tuned!",
          color: res.result.color || "linear-gradient(135deg, #f59e0b, #ec4899)",
          icon: res.result.icon || "SportsEsports",
        });
      } else {
        toastMessage(res.message || "Game not found", "error");
      }
    } catch (err) {
      console.error(err);
      toastMessage("Failed to load game", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [slugParam]);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Status Switcher Handler
  const handleStatusChange = (newStatus: GameStatus) => {
    let autoBadge = formData.badge;
    if (newStatus === "active") autoBadge = "🟢 LIVE NOW";
    if (newStatus === "coming_soon") autoBadge = "⚡ COMING SOON";
    if (newStatus === "maintenance") autoBadge = "🛠️ IN MAINTENANCE";

    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      badge: autoBadge,
    }));
  };

  // Save Control Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game) return;

    setSaving(true);
    try {
      const payload = {
        id: game._id,
        ...formData,
      };

      const res = await UpdateGameApi(payload);
      if (res.success && res.result) {
        setGame(res.result);
        toastMessage(`Game settings & status saved successfully!`, "success");
      } else {
        toastMessage(res.message || "Failed to update game", "error");
      }
    } catch (err) {
      console.error(err);
      toastMessage("Something went wrong while saving", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete Game
  const handleDelete = async () => {
    if (!game?._id) return;
    const confirm = await Swal.fire({
      title: `Delete "${formData.title}"?`,
      text: "This will remove this game from the platform. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await DeleteGameApi(game._id);
        if (res.success) {
          toastMessage("Game deleted successfully", "success");
          router.push("/games");
        } else {
          toastMessage(res.message || "Failed to delete game", "error");
        }
      } catch {
        toastMessage("Something went wrong", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-24">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-500">Loading game control panel...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <span className="text-5xl">⚠️</span>
        <h2 className="text-xl font-bold text-gray-800">Game Not Found</h2>
        <p className="text-sm text-gray-500">
          No game found with slug: <code className="font-mono text-indigo-600">/{slugParam}</code>
        </p>
        <Link
          href="/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          ← Back to Games Management
        </Link>
      </div>
    );
  }

  const currentStatusMeta =
    STATUS_OPTIONS.find((s) => s.value === formData.status) || STATUS_OPTIONS[0];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* ── Breadcrumbs ── */}
      <Breadcrumbs pageName={`${formData.title || "Game"} Control Form`} />

      {/* ── Header Card ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md text-white"
            style={{
              background: formData.color || "linear-gradient(135deg, #6366f1, #3b82f6)",
            }}
          >
            {formData.slug === "last-runner"
              ? "🏃"
              : formData.slug === "coin-rush"
              ? "🪙"
              : formData.slug === "laser-tag"
              ? "🔫"
              : "🎮"}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {formData.title || "Game"} Control Form
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${currentStatusMeta.badgeBg}`}
              >
                <span>{currentStatusMeta.icon}</span> {currentStatusMeta.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                Route: /game/{formData.slug}
              </span>
              <span>•</span>
              <span>Manage player access, maintenance alerts, and coming soon banners</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={`http://localhost:5173/game/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-2xs"
            title="Preview live in player frontend"
          >
            <span>🌐</span> Preview Public Game
          </a>

          <Link
            href="/games"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            ← All Games
          </Link>
        </div>
      </div>

      {/* ── MAIN FORM ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: STATUS CONTROL (ACTIVE, COMING SOON, MAINTENANCE)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🎛️</span> Availability & Status Control
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Choose the operational status for <strong className="text-gray-700">{formData.title}</strong>. Changes take effect instantly for all users.
            </p>
          </div>

          {/* 3 Interactive Cards for Status Picker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = formData.status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusChange(opt.value)}
                  className={`relative flex flex-col justify-between text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? `${opt.border} bg-gradient-to-br ${opt.gradient} ring-2 ring-offset-2 ring-indigo-500/20 shadow-md`
                      : "border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{opt.icon}</span>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white text-[10px] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{opt.label}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {opt.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200/60">
                    <p className="text-[11px] text-gray-500 font-medium">
                      💡 {opt.userImpact}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Notice Message Input based on status */}
          {formData.status === "maintenance" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛠️</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Custom Maintenance Notice Message
                  </h4>
                  <p className="text-xs text-amber-700">
                    This message is prominently displayed to players visiting <code className="font-mono font-semibold">/game/{formData.slug}</code> while in maintenance mode.
                  </p>
                </div>
              </div>

              <textarea
                name="maintenanceNotice"
                rows={3}
                value={formData.maintenanceNotice}
                onChange={handleChange}
                placeholder="Explain why the game is down and estimated time back online..."
                className="w-full p-3.5 bg-white border border-amber-300 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none leading-relaxed"
              />
              <p className="text-[11px] text-amber-700">
                Default: &ldquo;Coin Rush is temporarily undergoing scheduled maintenance. Please check back shortly!&rdquo;
              </p>
            </div>
          )}

          {formData.status === "coming_soon" && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900">
                    Coming Soon Teaser & Announcement Message
                  </h4>
                  <p className="text-xs text-indigo-700">
                    This teaser message is displayed on the Coming Soon game preview card.
                  </p>
                </div>
              </div>

              <textarea
                name="comingSoonNotice"
                rows={3}
                value={formData.comingSoonNotice}
                onChange={handleChange}
                placeholder="Tease upcoming game features, launch season, or countdown..."
                className="w-full p-3.5 bg-white border border-indigo-300 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed"
              />
              <p className="text-[11px] text-indigo-700">
                Default: &ldquo;This game is currently in development and will launch soon. Stay tuned!&rdquo;
              </p>
            </div>
          )}

          {formData.status === "active" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center gap-3">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Game is Live & Playable
                </p>
                <p className="text-[11px] text-emerald-700">
                  Users can navigate to <code className="font-semibold">/game/{formData.slug}</code> and play multiplayer matches immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: GAME METADATA & PLAYER SPECS
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>📝</span> Game Details & Metadata
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Configure titles, descriptions, player capacity, and round duration displayed on the Games Directory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Game Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Coin Rush Multiplayer"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Game Slug / Gamename *
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. coin-rush"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1">Used in URL: /game/{formData.slug}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. Real-time top-down coin collecting arena"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed gameplay overview, objectives, and mechanics..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Player Capacity Badge
              </label>
              <input
                type="text"
                name="players"
                value={formData.players}
                onChange={handleChange}
                placeholder="e.g. 2–8 Players"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Round Duration Badge
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 60s Rounds"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Card Status Badge Text
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. 🟢 LIVE NOW or ⚡ COMING SOON"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Theme Gradient / Accent
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="linear-gradient(135deg, #f59e0b, #ec4899)">
                  Amber to Rose (Gold Rush)
                </option>
                <option value="linear-gradient(135deg, #6366f1, #3b82f6)">
                  Indigo to Blue (Cyber Laser)
                </option>
                <option value="linear-gradient(135deg, #10b981, #14b8a6)">
                  Emerald to Teal (Tactical Tank)
                </option>
                <option value="linear-gradient(135deg, #8b5cf6, #ec4899)">
                  Purple to Pink (Arcade Neon)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: LIVE PUBLIC SIMULATION PREVIEW
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Public User Preview (/game/{formData.slug})
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                formData.status === "active"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : formData.status === "coming_soon"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              {currentStatusMeta.icon} {currentStatusMeta.label}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ background: formData.color }}
              >
                🎮
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{formData.title}</h3>
                <p className="text-xs text-indigo-400 font-semibold">{formData.subtitle}</p>
                <p className="text-xs text-slate-300 max-w-lg mt-1 line-clamp-2">
                  {formData.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[11px] font-semibold">
                    👥 {formData.players}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[11px] font-semibold">
                    ⏱️ {formData.duration}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                className={`px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${
                  formData.status === "active"
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 hover:scale-105 cursor-pointer"
                    : formData.status === "coming_soon"
                    ? "bg-slate-700 text-slate-400 border border-slate-600 cursor-not-allowed"
                    : "bg-amber-600/80 text-amber-100 border border-amber-500/40 cursor-not-allowed"
                }`}
              >
                {formData.status === "active"
                  ? `Play ${formData.title} Now ▶`
                  : formData.status === "coming_soon"
                  ? "Coming Soon 🚀"
                  : "Under Maintenance 🛠️"}
              </button>
            </div>
          </div>
        </div>

        {/* ── SAVE ACTION BAR ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-4 sticky bottom-4 z-20">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
              title="Delete this game"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Game</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 border-l border-gray-200 pl-4">
              <span>Current:</span>
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <span>{currentStatusMeta.icon}</span> {currentStatusMeta.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/games"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md shadow-indigo-200 hover:shadow-lg disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Changes…
                </>
              ) : (
                <>💾 Save & Apply Status</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
