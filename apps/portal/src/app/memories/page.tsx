"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components";
import { ImageUpload } from "@/components/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Memory, MemoryType } from "@/lib/supabase/types";

const DEMO_CARE_CIRCLE_ID = process.env.NEXT_PUBLIC_DEMO_CARE_CIRCLE_ID || '11111111-1111-1111-1111-111111111111';

export default function MemoriesPage() {
  const { careCircleId } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [filter, setFilter] = useState<'all' | 'album' | 'story'>('all');

  const activeCareCircleId = careCircleId || DEMO_CARE_CIRCLE_ID;

  const fetchMemories = async () => {
    const supabase = getSupabaseClient();
    let query = supabase
      .from('memories')
      .select('*')
      .eq('care_circle_id', activeCareCircleId)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('type', filter);
    }

    const { data, error } = await query;

    if (data && !error) {
      setMemories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMemories();
  }, [activeCareCircleId, filter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (!error) {
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleToggleFavorite = async (memory: Memory) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('memories')
      .update({ is_favorite: !memory.is_favorite })
      .eq('id', memory.id);

    if (!error) {
      setMemories(prev =>
        prev.map(m => m.id === memory.id ? { ...m, is_favorite: !m.is_favorite } : m)
      );
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Memories</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Create and manage memory albums and stories
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Memory
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {(['all', 'album', 'story'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-purple-500 text-white'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
            }`}
          >
            {f === 'all' ? 'All' : f === 'album' ? 'Albums' : 'Stories'}
          </button>
        ))}
      </div>

      {/* Memories Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="h-48 bg-[var(--muted)]" />
              <div className="p-4">
                <div className="h-5 w-32 rounded bg-[var(--muted)]" />
                <div className="mt-2 h-4 w-20 rounded bg-[var(--muted)]" />
              </div>
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h3 className="mt-4 font-semibold">No memories yet</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Create memories to share with the patient
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
          >
            Create First Memory
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow)]"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-[var(--muted)]">
                {memory.thumbnail_url ? (
                  <img
                    src={memory.thumbnail_url}
                    alt={memory.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-12 w-12 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
                
                {/* Type badge */}
                <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium ${
                  memory.type === 'album'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                }`}>
                  {memory.type === 'album' ? 'Album' : 'Story'}
                </span>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(memory);
                  }}
                  className="absolute top-3 right-3 rounded-full bg-white/80 p-1.5 backdrop-blur transition-colors hover:bg-white dark:bg-black/50 dark:hover:bg-black/70"
                >
                  <svg
                    className={`h-5 w-5 ${memory.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-600 dark:text-zinc-400'}`}
                    fill={memory.is_favorite ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold">{memory.title}</h3>
                {memory.description && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2">
                    {memory.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                  {memory.view_count} views
                </p>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingMemory(memory)}
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingMemory) && (
        <MemoryModal
          memory={editingMemory}
          careCircleId={activeCareCircleId}
          onClose={() => {
            setShowAddModal(false);
            setEditingMemory(null);
          }}
          onSave={() => {
            setShowAddModal(false);
            setEditingMemory(null);
            fetchMemories();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function MemoryModal({
  memory,
  careCircleId,
  onClose,
  onSave,
}: {
  memory: Memory | null;
  careCircleId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(memory?.title || '');
  const [description, setDescription] = useState(memory?.description || '');
  const [type, setType] = useState<MemoryType>(memory?.type || 'album');
  const [thumbnailUrl, setThumbnailUrl] = useState(memory?.thumbnail_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!memory;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = getSupabaseClient();

    const memoryData = {
      title: title.trim(),
      description: description.trim() || null,
      type,
      thumbnail_url: thumbnailUrl.trim() || null,
      care_circle_id: careCircleId,
    };

    let error;
    if (isEditing) {
      const res = await supabase
        .from('memories')
        .update(memoryData)
        .eq('id', memory.id);
      error = res.error;
    } else {
      const res = await supabase
        .from('memories')
        .insert([memoryData]);
      error = res.error;
    }

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-[var(--card)] p-6 shadow-xl">
        <h2 className="text-xl font-semibold">
          {isEditing ? 'Edit Memory' : 'Add Memory'}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {isEditing ? 'Update the memory details' : 'Create a new memory for the patient'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g., Christmas 2024"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Type</label>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] p-3 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                <input
                  type="radio"
                  name="type"
                  value="album"
                  checked={type === 'album'}
                  onChange={() => setType('album')}
                  className="accent-purple-500"
                />
                <span className="text-sm">Album</span>
              </label>
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] p-3 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                <input
                  type="radio"
                  name="type"
                  value="story"
                  checked={type === 'story'}
                  onChange={() => setType('story')}
                  className="accent-purple-500"
                />
                <span className="text-sm">Story</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="A brief description..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Thumbnail</label>
            <ImageUpload
              value={thumbnailUrl}
              onChange={setThumbnailUrl}
              folder="memories"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
