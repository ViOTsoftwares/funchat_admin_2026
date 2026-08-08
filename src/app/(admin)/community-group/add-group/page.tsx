"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateGroupApi, GetCategoryApi } from "@/Api/community";
import { toastMessage } from "@/lib/toast.message";
import Breadcrumbs from "@/components/Breadcrumbs";
import Spinner from "@/components/Spinner";

export default function AddGroup() {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    chat_timing: "24/7",
    messageDelay: 0,
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await GetCategoryApi({ limit: 100 });
      if (res.ok && res.data) {
        setCategories(res.data);
      }
    };
    fetchCategories();
  }, []);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      if (name === "name") {
        const selectedCat: any = categories.find((c: any) => c._id === formData.category);
        const catPrefix = selectedCat ? selectedCat.slug || selectedCat.name : "";
        setFormData((prev) => ({ ...prev, name: value, slug: generateSlug(catPrefix ? `${catPrefix}-${value}` : value) }));
      } else if (name === "category") {
        const selectedCat: any = categories.find((c: any) => c._id === value);
        const catPrefix = selectedCat ? selectedCat.slug || selectedCat.name : "";
        setFormData((prev) => ({ ...prev, category: value, slug: generateSlug(catPrefix ? `${catPrefix}-${prev.name}` : prev.name) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: any = await CreateGroupApi(formData);
      if (response.ok) {
        toastMessage(response.message, "success");
        navigate.push("/community-group");
      } else {
        toastMessage(response.message, "error");
      }
    } catch (error) {
      toastMessage("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumbs path="Community Groups" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Group</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new community group</p>
        </div>
      </div>
      <div className="h-px bg-gray-200" />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Web Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. web-dev"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chat Timing</label>
            <select
              name="chat_timing"
              value={formData.chat_timing}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="24/7">24/7</option>
              <option value="9 AM - 6 PM">9 AM - 6 PM</option>
              <option value="10 AM - 10 PM">10 AM - 10 PM</option>
              <option value="6 PM - 12 AM">6 PM - 12 AM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message Delay (Minutes)</label>
            <input
              type="number"
              name="messageDelay"
              value={formData.messageDelay}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="0 for no delay"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="HTML/CSS, React, Vue, Node.js..."
            />
          </div>
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPopular"
                id="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPopular" className="ml-2 block text-sm font-medium text-gray-900">
                🔥 Popular Group (Featured on Community Welcome Screen)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#0f172a] text-white font-medium rounded-lg hover:bg-[#020617] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] transition-all disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Spinner size="w-6 h-6" color="text-white" text="" /> : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate.push("/community-group")}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
