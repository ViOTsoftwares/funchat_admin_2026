"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCategoryApi } from "@/Api/community";
import { toastMessage } from "@/lib/toast.message";
import Breadcrumbs from "@/components/Breadcrumbs";
import Spinner from "@/components/Spinner";

export default function AddCategory() {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "file") {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setImageFile(target.files[0]);
      }
    } else {
      if (name === "name") {
        setFormData((prev) => ({ ...prev, name: value, slug: generateSlug(value) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      data.append("isActive", String(formData.isActive));
      if (imageFile) {
        data.append("image", imageFile);
      }

      const response: any = await CreateCategoryApi(data);
      if (response.ok) {
        toastMessage(response.message, "success");
        navigate.push("/community-category");
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
      <Breadcrumbs path="Community Categories" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Category</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new community category</p>
        </div>
      </div>
      <div className="h-px bg-gray-200" />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Technology"
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
              placeholder="e.g. technology"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
              placeholder="Discuss code, AI developments..."
            />
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
            onClick={() => navigate.push("/community-category")}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
