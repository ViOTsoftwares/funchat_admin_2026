"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreateGameApi, GameStatus } from "@/Api/game";
import { toastMessage } from "@/lib/toast.message";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AddGamePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    status: "active" as GameStatus,
    subtitle: "",
    description: "",
    badge: "🟢 LIVE NOW",
    players: "2–8 Players",
    duration: "60s Rounds",
    maintenanceNotice: "This game is currently undergoing scheduled maintenance. Please check back shortly!",
    comingSoonNotice: "This game is currently in development and will launch soon. Stay tuned!",
    color: "linear-gradient(135deg, #6366f1, #3b82f6)",
    icon: "SportsEsports",
    sortOrder: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !prev.slug) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      }
      if (name === "status") {
        if (value === "active") next.badge = "🟢 LIVE NOW";
        if (value === "coming_soon") next.badge = "⚡ COMING SOON";
        if (value === "maintenance") next.badge = "🛠️ IN MAINTENANCE";
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastMessage("Game title is required", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await CreateGameApi(formData);
      if (res.success && res.result) {
        toastMessage("Game created successfully!", "success");
        router.push(`/games/${res.result.slug}`);
      } else {
        toastMessage(res.message || "Failed to create game", "error");
      }
    } catch (err) {
      console.error(err);
      toastMessage("Something went wrong while creating game", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs pageName="Add New Game" />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Game</h1>
          <p className="text-xs text-gray-500 mt-1">Register a new game title, route slug, and initial availability status.</p>
        </div>
        <Link
          href="/games"
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
        >
          ← Back to Games
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
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
                placeholder="e.g. Space Odyssey Blitz"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Slug / URL Identifier *
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. space-odyssey"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1">Route: /game/{formData.slug || "gamename"}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Initial Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="active">🟢 Active / Live Now</option>
                <option value="coming_soon">🚀 Coming Soon (In Development)</option>
                <option value="maintenance">🛠️ Maintenance (Offline)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Badge Text
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. Real-time multiplayer galactic arena"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
                placeholder="Game overview and instructions..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Player Capacity
              </label>
              <input
                type="text"
                name="players"
                value={formData.players}
                onChange={handleChange}
                placeholder="e.g. 2–8 Players"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Match Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 60s Rounds"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Maintenance Notice Message
              </label>
              <textarea
                name="maintenanceNotice"
                rows={2}
                value={formData.maintenanceNotice}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Coming Soon Teaser Message
              </label>
              <textarea
                name="comingSoonNotice"
                rows={2}
                value={formData.comingSoonNotice}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/games"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create & Open Control Form"}
          </button>
        </div>
      </form>
    </div>
  );
}
