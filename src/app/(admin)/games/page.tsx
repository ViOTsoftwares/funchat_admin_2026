"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GetGameApi,
  UpdateGameStatusApi,
  DeleteGameApi,
  SeedGamesApi,
  Game,
  GameStatus,
} from "@/Api/game";
import { toastMessage } from "@/lib/toast.message";
import Swal from "sweetalert2";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Trash2,
  Plus,
  RotateCcw,
  Search,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

// Status configuration
const STATUS_META: Record<
  GameStatus,
  {
    label: string;
    icon: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    dot: string;
    description: string;
  }
> = {
  active: {
    label: "Active / Live",
    icon: "🟢",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badgeText: "text-emerald-700",
    border: "border-emerald-500/40",
    dot: "bg-emerald-500",
    description: "Playable by all users in public lobby",
  },
  coming_soon: {
    label: "Coming Soon",
    icon: "🚀",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    badgeText: "text-indigo-700",
    border: "border-indigo-500/40",
    dot: "bg-indigo-500",
    description: "Preview mode with launch countdown teaser",
  },
  maintenance: {
    label: "Maintenance",
    icon: "🛠️",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    badgeText: "text-amber-700",
    border: "border-amber-500/40",
    dot: "bg-amber-500",
    description: "Temporarily offline for maintenance & updates",
  },
};

export default function GamesManagementPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | GameStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});

  // Fetch games
  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await GetGameApi({ limit: 100 });
      if (res.success && res.result?.list) {
        setGames(res.result.list);
      } else {
        toastMessage(res.message || "Failed to load games", "error");
      }
    } catch (err) {
      console.error(err);
      toastMessage("Something went wrong while fetching games", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Quick switch status
  const handleQuickStatusChange = async (game: Game, nextStatus: GameStatus) => {
    if (game.status === nextStatus) return;

    setStatusUpdating((prev) => ({ ...prev, [game._id]: true }));
    try {
      const res = await UpdateGameStatusApi(game._id, nextStatus);
      if (res.success && res.result) {
        setGames((prev) =>
          prev.map((g) => (g._id === game._id ? { ...g, ...res.result } : g))
        );
        const gameName = game?.title || (game as any)?.name || "Game";
        toastMessage(`${gameName} status changed to ${STATUS_META[nextStatus]?.label || nextStatus}`, "success");
      } else {
        toastMessage(res.message || "Failed to update status", "error");
      }
    } catch (err) {
      console.error(err);
      toastMessage("Failed to update status", "error");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [game._id]: false }));
    }
  };

  // Re-seed games
  const handleSeedDefaults = async () => {
    const confirm = await Swal.fire({
      title: "Sync & Seed Default Games?",
      text: "This will ensure all standard games (Coin Rush, Laser Tag, Pixel Tanks) exist with default configs.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Sync Games",
      confirmButtonColor: "#4f46e5",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const res = await SeedGamesApi();
        if (res.success) {
          toastMessage("Default games synced successfully", "success");
          fetchGames();
        } else {
          toastMessage(res.message || "Failed to sync", "error");
        }
      } catch (err) {
        toastMessage("Failed to sync games", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Delete game
  const handleDelete = async (game: Game) => {
    const gameName = game?.title || (game as any)?.name || "Game";
    const confirm = await Swal.fire({
      title: `Delete "${gameName}"?`,
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
          setGames((prev) => prev.filter((g) => g._id !== game._id));
        } else {
          toastMessage(res.message || "Failed to delete game", "error");
        }
      } catch (err) {
        toastMessage("Something went wrong", "error");
      }
    }
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const gameStatus = game?.status || "active";
      const matchesFilter = activeFilter === "all" || gameStatus === activeFilter;
      const title = game?.title || (game as any)?.name || "";
      const slug = game?.slug || "";
      const desc = game?.description || "";
      const q = (searchQuery || "").toLowerCase();
      const matchesSearch =
        title.toLowerCase().includes(q) ||
        slug.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [games, activeFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: games.length,
      active: games.filter((g) => g.status === "active").length,
      coming_soon: games.filter((g) => g.status === "coming_soon").length,
      maintenance: games.filter((g) => g.status === "maintenance").length,
    };
  }, [games]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Breadcrumbs ── */}
      <Breadcrumbs pageName="Game Management" />

      {/* ── Page Header ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-200">
              🎮
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Game Management & Controls
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Control game availability (Active, Coming Soon, Maintenance), notices, and player settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleSeedDefaults}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            <span>Sync Default Games</span>
          </button>
          <Link
            href="/games/add-game"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-200 hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Game</span>
          </Link>
        </div>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveFilter("all")}
          className={`cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
            activeFilter === "all"
              ? "border-indigo-500 ring-2 ring-indigo-100 shadow-sm"
              : "border-gray-100 hover:border-gray-200 shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Games</span>
            <span className="text-xl">🕹️</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">{counts.all}</span>
            <span className="text-xs text-gray-500 font-medium">registered</span>
          </div>
        </div>

        <div
          onClick={() => setActiveFilter("active")}
          className={`cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
            activeFilter === "active"
              ? "border-emerald-500 ring-2 ring-emerald-100 shadow-sm"
              : "border-gray-100 hover:border-gray-200 shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active / Live</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{counts.active}</span>
            <span className="text-xs text-emerald-600 font-medium">open to play</span>
          </div>
        </div>

        <div
          onClick={() => setActiveFilter("coming_soon")}
          className={`cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
            activeFilter === "coming_soon"
              ? "border-indigo-500 ring-2 ring-indigo-100 shadow-sm"
              : "border-gray-100 hover:border-gray-200 shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Coming Soon</span>
            <span className="text-xl">🚀</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-700">{counts.coming_soon}</span>
            <span className="text-xs text-indigo-600 font-medium">in development</span>
          </div>
        </div>

        <div
          onClick={() => setActiveFilter("maintenance")}
          className={`cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
            activeFilter === "maintenance"
              ? "border-amber-500 ring-2 ring-amber-100 shadow-sm"
              : "border-gray-100 hover:border-gray-200 shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Maintenance</span>
            <span className="text-xl">🛠️</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{counts.maintenance}</span>
            <span className="text-xs text-amber-600 font-medium">offline for updates</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { key: "all", label: "All Games", count: counts.all },
            { key: "active", label: "🟢 Live", count: counts.active },
            { key: "coming_soon", label: "🚀 Soon", count: counts.coming_soon },
            { key: "maintenance", label: "🛠️ Maint", count: counts.maintenance },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} <span className="opacity-60 ml-0.5">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by game title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Games List Cards Grid ── */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading game configurations...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center space-y-3">
          <span className="text-4xl">🕹️</span>
          <h3 className="text-base font-bold text-gray-800">No games found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? `No games matched "${searchQuery}". Try changing your search or filter.`
              : "No games currently configured. Click below to seed the default game suite."}
          </p>
          <button
            type="button"
            onClick={handleSeedDefaults}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Sync Default Games
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const meta = STATUS_META[game.status] || STATUS_META.active;
            const isUpdating = statusUpdating[game._id];

            return (
              <div
                key={game._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top Banner / Details */}
                <div className="p-6">
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm text-white"
                        style={{
                          background: game.color || "linear-gradient(135deg, #6366f1, #3b82f6)",
                        }}
                      >
                        {game.slug === "last-runner"
                          ? "🏃"
                          : game.slug === "coin-rush"
                          ? "🪙"
                          : game.slug === "laser-tag"
                          ? "🔫"
                          : game.slug === "pixel-tanks"
                          ? "🛡️"
                          : "🎮"}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {game.title || (game as any)?.name || "Game"}
                        </h3>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">
                          /game/{game.slug || "gamename"}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeBg}`}
                    >
                      <span>{meta.icon}</span> {meta.label}
                    </span>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-xs font-semibold text-indigo-600 mb-1.5">
                    {game.subtitle || "Multiplayer Arcade Game"}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {game.description || "No description configured."}
                  </p>

                  {/* Badges: Players & Duration */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-semibold">
                      👥 {game.players || "2–8 Players"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-semibold">
                      ⏱️ {game.duration || "60s Rounds"}
                    </span>
                  </div>

                  {/* ── QUICK STATUS SELECTOR SEGMENT ── */}
                  <div className="rounded-xl bg-gray-50 p-2.5 border border-gray-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Quick Status Control
                      </span>
                      {isUpdating && (
                        <span className="text-[10px] text-indigo-600 font-semibold animate-pulse">
                          Updating…
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {(["active", "coming_soon", "maintenance"] as GameStatus[]).map((st) => {
                        const isCurrent = game.status === st;
                        const itemMeta = STATUS_META[st];
                        return (
                          <button
                            key={st}
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuickStatusChange(game, st)}
                            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
                              isCurrent
                                ? `${itemMeta.badgeBg} border shadow-2xs font-black ring-1 ring-inset ring-black/5`
                                : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
                            }`}
                            title={itemMeta.description}
                          >
                            <span>{itemMeta.icon}</span>
                            <span className="truncate">
                              {st === "active" ? "Live" : st === "coming_soon" ? "Soon" : "Maint"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notice text display if coming soon or maintenance */}
                  {game.status !== "active" && (
                    <div
                      className={`mt-3 p-2.5 rounded-xl text-xs border ${
                        game.status === "maintenance"
                          ? "bg-amber-50/70 border-amber-200 text-amber-900"
                          : "bg-indigo-50/70 border-indigo-200 text-indigo-900"
                      }`}
                    >
                      <p className="font-semibold text-[11px] flex items-center gap-1 mb-0.5">
                        <span>{game.status === "maintenance" ? "🛠️ Active Maintenance Notice:" : "🚀 Coming Soon Teaser:"}</span>
                      </p>
                      <p className="text-[11px] leading-relaxed line-clamp-2 italic">
                        &ldquo;{game.status === "maintenance" ? game.maintenanceNotice : game.comingSoonNotice}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Card Action Footer ── */}
                <div className="px-6 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/games/${game.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-2xs"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Control Form</span>
                    </Link>

                    <a
                      href={`http://localhost:5173/game/${game.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors shadow-2xs"
                      title="Preview public game page in user frontend"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                      <span>Public</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(game)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                    title="Delete Game"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
