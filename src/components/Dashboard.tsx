"use client";

import React, { useEffect, useState } from "react";
import { DashboardCountApi } from "../Api/dashboard";
import { Users, MessageSquare, Video, BookOpen, Star, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const GetData = async () => {
    try {
      setLoading(true);
      const response = await DashboardCountApi();
      if (response?.success) {
        setFormData(response.result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time chat platform activity and content status</p>
        </div>
        <button
          onClick={GetData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Total Connected Users */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Online Users</h3>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formData?.activeUsers ?? 0}
            </span>
            <div className="flex items-center mt-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Live Connections
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Card 2: Live Chat Users */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Live Chat Users</h3>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <MessageSquare size={20} />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formData?.chatUsers ?? 0}
            </span>
            <div className="flex gap-2 items-center mt-2">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                In Chat Mode
              </span>
              {(formData?.chatQueue ?? 0) > 0 && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-bounce">
                  Queue: {formData.chatQueue}
                </span>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Card 3: Live Video Users */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Live Video Users</h3>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Video size={20} />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formData?.videoUsers ?? 0}
            </span>
            <div className="flex gap-2 items-center mt-2">
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                In Video Mode
              </span>
              {(formData?.videoQueue ?? 0) > 0 && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-bounce">
                  Queue: {formData.videoQueue}
                </span>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
        </div>

        {/* Card 4: Blogs count */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Blogs</h3>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <BookOpen size={20} />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formData?.blog ?? 0}
            </span>
            <div className="text-xs font-medium text-purple-600 bg-purple-50 w-fit px-2.5 py-0.5 rounded-full mt-2">
              Published Articles
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
        </div>

        {/* Card 5: Testimonials count */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Testimonials</h3>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Star size={20} />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formData?.testimonial ?? 0}
            </span>
            <div className="text-xs font-medium text-amber-600 bg-amber-50 w-fit px-2.5 py-0.5 rounded-full mt-2">
              Client Feedback Entries
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
