// Frontend/components/BannerManagement.tsx
"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Edit, Plus, X } from "lucide-react";
import { API_BASE, bannerImageUrl } from "@/utils/apiBase";

type Banner = {
  id: number;
  title: string;
  subtitle?: string;
  discount?: string;
  image_url?: string | null;
  redirect_url?: string | null;
  is_active?: 0 | 1;
  sort_order?: number;
  created_at?: string;
};

type FormState = {
  title: string;
  subtitle: string;
  discount: string;
  redirect_url: string;
  is_active: boolean;
  imageFile?: File | null;
  imagePreview?: string | null; // data URL or backend image_url (full URL)
  image_url?: string; // optional external url typed in by admin
};

export default function BannerManagement(): JSX.Element {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    subtitle: "",
    discount: "",
    redirect_url: "",
    is_active: true,
    imageFile: null,
    imagePreview: null,
    image_url: "",
  });

  // fetch banners
  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/banners`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data: Banner[] = await res.json();
      const sorted = data.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      setBanners(sorted);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setIsEditing(false);
    setEditingBannerId(null);
    setForm({
      title: "",
      subtitle: "",
      discount: "",
      redirect_url: "",
      is_active: true,
      imageFile: null,
      imagePreview: null,
      image_url: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setIsEditing(true);
    setEditingBannerId(b.id);
    setForm({
      title: b.title || "",
      subtitle: b.subtitle || "",
      discount: b.discount || "",
      redirect_url: b.redirect_url || "",
      is_active: Boolean(b.is_active),
      imageFile: null,
      // use bannerImageUrl helper to show full preview if backend provided relative path
      imagePreview: b.image_url ? bannerImageUrl(b.image_url) : null,
      image_url: b.image_url || "",
    });
    setIsModalOpen(true);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setForm((f) => ({ ...f, imageFile: null, imagePreview: null }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageFile: file, imagePreview: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const onImageUrlChange = (v: string) => {
    setForm((f) => ({ ...f, image_url: v, imageFile: null, imagePreview: v || null }));
  };

  const change = (key: keyof FormState, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.imageFile && !form.image_url) {
      setError("Please upload an image file or provide an image URL");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle || "");
      fd.append("discount", form.discount || "");
      fd.append("redirect_url", form.redirect_url || "");
      fd.append("is_active", form.is_active ? "1" : "0");
      if (form.imageFile) {
        fd.append("image", form.imageFile);
      } else if (form.image_url) {
        // backend accepts image_url as a field when no file present
        fd.append("image_url", form.image_url);
      }

      if (isEditing && editingBannerId) {
        const res = await fetch(`${API_BASE}/api/admin/banners/${editingBannerId}`, {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            // DO NOT set Content-Type here — browser will set the multipart boundary
          },
          body: fd,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || `Update failed (${res.status})`);
        }
        const updated: Banner = await res.json();
        setBanners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch(`${API_BASE}/api/admin/banners`, {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: fd,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || `Create failed (${res.status})`);
        }
        const created: Banner = await res.json();
        setBanners((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/banners/${b.id}`, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: b.is_active ? 0 : 1 }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      const updated = await res.json();
      setBanners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Toggle failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={openCreate}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus className="mr-2" /> Add Banner
          </button>
        </div>
      </div>

      {error && <div className="p-3 rounded bg-red-50 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && banners.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">No banners yet</div>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-44 bg-gray-100 overflow-hidden">
                {b.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bannerImageUrl(b.image_url)}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{b.title}</div>
                    <div className="text-sm text-gray-600">{b.subtitle}</div>
                    {b.discount && <div className="text-sm text-green-700 mt-2">Offer: {b.discount}</div>}
                    {b.redirect_url && <div className="text-xs text-gray-400 mt-2">{b.redirect_url}</div>}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <button onClick={() => openEdit(b)} title="Edit" className="p-2 rounded-md hover:bg-gray-100">
                      <Edit className="text-gray-600" />
                    </button>

                    <button onClick={() => remove(b.id)} title="Delete" className="p-2 rounded-md hover:bg-gray-100">
                      <Trash2 className="text-red-600" />
                    </button>

                    <button
                      onClick={() => toggleActive(b)}
                      title={b.is_active ? "Deactivate" : "Activate"}
                      className={`text-xs px-2 py-1 rounded ${b.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}
                    >
                      {b.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsModalOpen(false)} />

          <form onSubmit={(e) => submit(e)} className="relative z-10 bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{isEditing ? "Edit Banner" : "Create Banner"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded hover:bg-gray-100">
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input value={form.title} onChange={(e) => change("title", e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => change("subtitle", e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Discount / Offer text</label>
                <input value={form.discount} onChange={(e) => change("discount", e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Redirect URL (optional)</label>
                <input value={form.redirect_url} onChange={(e) => change("redirect_url", e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>

                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-48 h-28 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {form.imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-sm text-gray-400">No preview</div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <input type="file" accept="image/*" onChange={onFileChange} />
                    </div>
                    <div className="text-xs text-gray-500">Or provide external image URL</div>
                    <div>
                      <input value={form.image_url} onChange={(e) => onImageUrlChange(e.target.value)} placeholder="https://..." className="w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => change("is_active", e.target.checked)} />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <div className="space-x-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">{loading ? "Saving..." : isEditing ? "Save changes" : "Create banner"}</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
