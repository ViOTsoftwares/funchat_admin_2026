"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { OneCategoryApi, UpdateCategoryApi } from "@/Api/community";
import { toastMessage } from "@/lib/toast.message";
import Breadcrumbs from "@/components/Breadcrumbs";
import Spinner from "@/components/Spinner";
import { ENV } from "@/config";

export default function UpdateCategory() {
  const navigate = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    slug: "",
    description: "",
    image: "",
    isPopular: false,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response: any = await OneCategoryApi(id);
        if (response.ok && response.data) {
          const cat = response.data;
          setFormData({
            _id: cat._id,
            name: cat.name || "",
            slug: cat.slug || "",
            description: cat.description || "",
            image: cat.image || "",
            isPopular: cat.isPopular ?? false,
            isActive: cat.isActive ?? true,
          });
          if (cat.image) {
            setImagePreview(`${ENV.IMAGE_URL}/logos/${cat.image}`);
          }
        } else {
          toastMessage("Category not found", "error");
          navigate.push("/community-category");
        }
      } catch (error) {
        toastMessage("Something went wrong", "error");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchCategory();
  }, [id, navigate]);

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
        const file = target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
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
      data.append("_id", formData._id);
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      data.append("isPopular", String(formData.isPopular));
      data.append("isActive", String(formData.isActive));
      if (imageFile) {
        data.append("image", imageFile);
      }

      const response: any = await UpdateCategoryApi(data);
      if (response.ok || response.success) {
        toastMessage(response.message || "Category updated successfully", "success");
        navigate.push("/community-category");
      } else {
        toastMessage(response.message || "Failed to update category", "error");
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
      <Breadcrumbs path="Community Categories" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Update Category</h1>
          <p className="text-sm text-gray-500 mt-1">Update community category details</p>
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image / Logo</label>
            {imagePreview && (
              <div className="mb-3 flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Category logo preview"
                  className="h-16 w-16 rounded-lg object-cover border border-gray-300 bg-white shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {imageFile ? "New Selected Image" : "Current Image"}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                🔥 Popular Category (Show on Community Welcome Screen)
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
            {loading ? <Spinner size="w-6 h-6" color="text-white" text="" /> : "Update"}
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
