"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabase/client";
import { FamilyMember } from "@/lib/supabase/types";

// Demo care circle ID (same as mobile app)
const DEMO_CARE_CIRCLE_ID = process.env.NEXT_PUBLIC_DEMO_CARE_CIRCLE_ID || '11111111-1111-1111-1111-111111111111';

export default function FamilyPage() {
  const { careCircleId } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Use demo care circle if user doesn't have one yet
  const activeCareCircleId = careCircleId || DEMO_CARE_CIRCLE_ID;

  const fetchFamilyMembers = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('care_circle_id', activeCareCircleId)
      .order('display_order', { ascending: true });

    if (data && !error) {
      setFamilyMembers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, [activeCareCircleId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id);

    if (!error) {
      setFamilyMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Family</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Manage family members who appear in the patient app
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Family Member
        </button>
      </div>

      {/* Family Members Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[var(--muted)]" />
                <div className="flex-1">
                  <div className="h-5 w-24 rounded bg-[var(--muted)]" />
                  <div className="mt-2 h-4 w-16 rounded bg-[var(--muted)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : familyMembers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="mt-4 font-semibold">No family members yet</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Add family members to show them in the patient app
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Add First Family Member
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow)]"
            >
              <div className="flex items-start gap-4">
                <img
                  src={member.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=10b981&color=fff`}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{member.relationship}</p>
                  {member.fun_fact && (
                    <p className="mt-2 text-sm text-[var(--muted-foreground)] italic">
                      "{member.fun_fact}"
                    </p>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setEditingMember(member)}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-900/50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingMember) && (
        <FamilyMemberModal
          member={editingMember}
          careCircleId={activeCareCircleId}
          onClose={() => {
            setShowAddModal(false);
            setEditingMember(null);
          }}
          onSave={() => {
            setShowAddModal(false);
            setEditingMember(null);
            fetchFamilyMembers();
          }}
        />
      )}
    </DashboardLayout>
  );
}

// Modal component for adding/editing family members
function FamilyMemberModal({
  member,
  careCircleId,
  onClose,
  onSave,
}: {
  member: FamilyMember | null;
  careCircleId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(member?.name || '');
  const [relationship, setRelationship] = useState(member?.relationship || '');
  const [photoUrl, setPhotoUrl] = useState(member?.photo_url || '');
  const [funFact, setFunFact] = useState(member?.fun_fact || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!member;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) {
      setError('Name and relationship are required');
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = getSupabaseClient();

    const memberData = {
      name: name.trim(),
      relationship: relationship.trim(),
      photo_url: photoUrl.trim() || null,
      fun_fact: funFact.trim() || null,
      care_circle_id: careCircleId,
    };

    let error;
    if (isEditing) {
      const res = await supabase
        .from('family_members')
        .update(memberData)
        .eq('id', member.id);
      error = res.error;
    } else {
      const res = await supabase
        .from('family_members')
        .insert([memberData]);
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
          {isEditing ? 'Edit Family Member' : 'Add Family Member'}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {isEditing ? 'Update the family member details' : 'Add someone to the family circle'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g., Sarah"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Relationship *</label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g., Daughter"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Photo URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Leave blank to use an auto-generated avatar
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Fun Fact</label>
            <input
              type="text"
              value={funFact}
              onChange={(e) => setFunFact(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g., She loves gardening"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              A helpful reminder shown in the patient app
            </p>
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
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
