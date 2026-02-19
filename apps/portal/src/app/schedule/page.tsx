"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout, PageWrapper } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabase/client";
import { DailyRoutine } from "@/lib/supabase/types";
import { staggerContainer, staggerItem, smoothTransition } from "@/lib/animations";

// Demo care circle ID
const DEMO_CARE_CIRCLE_ID = process.env.NEXT_PUBLIC_DEMO_CARE_CIRCLE_ID || '11111111-1111-1111-1111-111111111111';

interface ScheduledVisit {
  id: string;
  visitor_name: string;
  relationship: string | null;
  photo_url: string | null;
  scheduled_at: string;
  notes: string | null;
  created_at: string;
}

const typeColors: Record<string, string> = {
  routine: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  medication: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  visit: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function SchedulePage() {
  const { careCircleId } = useAuth();
  const [routines, setRoutines] = useState<DailyRoutine[]>([]);
  const [visits, setVisits] = useState<ScheduledVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<DailyRoutine | null>(null);

  const activeCareCircleId = careCircleId || DEMO_CARE_CIRCLE_ID;

  const fetchData = async () => {
    const supabase = getSupabaseClient();
    
    // Fetch routines
    const { data: routineData } = await supabase
      .from('daily_routines')
      .select('*')
      .eq('care_circle_id', activeCareCircleId)
      .order('time', { ascending: true });

    if (routineData) setRoutines(routineData);

    // Fetch upcoming visits
    const { data: visitData } = await supabase
      .from('scheduled_visits')
      .select('*')
      .eq('care_circle_id', activeCareCircleId)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5);

    if (visitData) setVisits(visitData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeCareCircleId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this routine?')) return;
    
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('daily_routines')
      .delete()
      .eq('id', id);

    if (!error) {
      setRoutines(prev => prev.filter(r => r.id !== id));
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayRoutines = routines.filter(r => r.days_of_week.includes(dayOfWeek));

  return (
    <DashboardLayout>
      <PageWrapper>
        {/* Header */}
        <motion.div 
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Daily routines and upcoming events
            </p>
          </div>
          <motion.button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Routine
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="h-6 w-32 bg-[var(--muted)] rounded mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-[var(--muted)] rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <motion.div 
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={smoothTransition}
              >
                <div className="border-b border-[var(--border)] bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 dark:from-indigo-950/30 dark:to-purple-950/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {todayRoutines.length} routines
                    </div>
                  </div>
                </div>
                
                {todayRoutines.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 font-semibold">No routines for today</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      Add a routine to get started
                    </p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                    >
                      Add First Routine
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    className="divide-y divide-[var(--border)]"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {todayRoutines.map((routine, index) => (
                      <motion.div 
                        key={routine.id}
                        variants={staggerItem}
                        transition={{ ...smoothTransition, delay: index * 0.05 }}
                        className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[var(--muted)]/50"
                      >
                        {/* Time */}
                        <div className="w-20 flex-shrink-0">
                          <span className="text-sm font-medium">
                            {formatTime(routine.time)}
                          </span>
                        </div>

                        {/* Icon */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)] text-xl">
                          {routine.icon || '📋'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{routine.title}</h3>
                          {routine.description && (
                            <p className="text-sm text-[var(--muted-foreground)] truncate">
                              {routine.description}
                            </p>
                          )}
                        </div>

                        {/* Type badge */}
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          routine.is_medication ? typeColors.medication : typeColors.routine
                        }`}>
                          {routine.is_medication ? 'medication' : 'routine'}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingRoutine(routine)}
                            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(routine.id)}
                            className="p-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* All Routines */}
              {routines.length > 0 && (
                <motion.div 
                  className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...smoothTransition, delay: 0.2 }}
                >
                  <div className="border-b border-[var(--border)] px-6 py-4">
                    <h2 className="text-lg font-semibold">All Routines</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {routines.length} total routines configured
                    </p>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {routines.map((routine) => (
                      <div 
                        key={routine.id}
                        className="group flex items-center gap-4 px-6 py-3 hover:bg-[var(--muted)]/50 transition-colors"
                      >
                        <span className="text-xl">{routine.icon || '📋'}</span>
                        <div className="flex-1">
                          <p className="font-medium">{routine.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {formatTime(routine.time)} • {routine.days_of_week.length === 7 ? 'Every day' : `${routine.days_of_week.length} days/week`}
                          </p>
                        </div>
                        <button
                          onClick={() => setEditingRoutine(routine)}
                          className="opacity-0 group-hover:opacity-100 text-sm text-[var(--primary)] hover:underline transition-opacity"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...smoothTransition, delay: 0.2 }}
            >
              {/* Upcoming Visits */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden">
                <div className="border-b border-[var(--border)] px-6 py-4">
                  <h2 className="text-lg font-semibold">Upcoming Visits</h2>
                </div>
                {visits.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--muted-foreground)]">
                    No upcoming visits scheduled
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    {visits.map((visit) => (
                      <motion.div 
                        key={visit.id}
                        className="px-6 py-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {visit.photo_url ? (
                              <img src={visit.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                            ) : (
                              <span className="text-lg font-medium">{visit.visitor_name[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{visit.visitor_name}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {new Date(visit.scheduled_at).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Add */}
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
                <h3 className="mb-3 font-semibold">Quick Add</h3>
                <div className="space-y-2">
                  <motion.button 
                    onClick={() => setShowAddModal(true)}
                    className="flex w-full items-center gap-3 rounded-lg bg-[var(--muted)] p-3 text-left transition-colors hover:bg-[var(--muted)]/80"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">⏰</span>
                    <div>
                      <p className="font-medium text-sm">New Routine</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Daily activity or reminder</p>
                    </div>
                  </motion.button>
                  <motion.button 
                    onClick={() => setShowAddModal(true)}
                    className="flex w-full items-center gap-3 rounded-lg bg-[var(--muted)] p-3 text-left transition-colors hover:bg-[var(--muted)]/80"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">💊</span>
                    <div>
                      <p className="font-medium text-sm">Medication</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Med reminder with time</p>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || editingRoutine) && (
          <RoutineModal
            routine={editingRoutine}
            careCircleId={activeCareCircleId}
            onClose={() => {
              setShowAddModal(false);
              setEditingRoutine(null);
            }}
            onSave={() => {
              setShowAddModal(false);
              setEditingRoutine(null);
              fetchData();
            }}
          />
        )}
      </PageWrapper>
    </DashboardLayout>
  );
}

// Modal component
function RoutineModal({
  routine,
  careCircleId,
  onClose,
  onSave,
}: {
  routine: DailyRoutine | null;
  careCircleId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(routine?.title || '');
  const [time, setTime] = useState(routine?.time || '09:00');
  const [icon, setIcon] = useState(routine?.icon || '📋');
  const [description, setDescription] = useState(routine?.description || '');
  const [isMedication, setIsMedication] = useState(routine?.is_medication || false);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(routine?.days_of_week || [0, 1, 2, 3, 4, 5, 6]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!routine;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const commonIcons = ['📋', '💊', '☕', '🍽️', '🧩', '📞', '🎵', '📖', '🚶', '😴'];

  const toggleDay = (day: number) => {
    setDaysOfWeek(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (daysOfWeek.length === 0) {
      setError('Select at least one day');
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = getSupabaseClient();

    const routineData = {
      title: title.trim(),
      time,
      icon,
      description: description.trim() || null,
      is_medication: isMedication,
      days_of_week: daysOfWeek,
      care_circle_id: careCircleId,
    };

    let queryError;
    if (isEditing) {
      const res = await supabase
        .from('daily_routines')
        .update(routineData)
        .eq('id', routine.id);
      queryError = res.error;
    } else {
      const res = await supabase
        .from('daily_routines')
        .insert([routineData]);
      queryError = res.error;
    }

    if (queryError) {
      setError(queryError.message);
      setSaving(false);
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div 
        className="w-full max-w-md rounded-xl bg-[var(--card)] p-6 shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-xl font-semibold">
          {isEditing ? 'Edit Routine' : 'Add Routine'}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {isEditing ? 'Update the routine details' : 'Create a new daily routine'}
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
              placeholder="e.g., Morning Medication"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Icon</label>
              <div className="flex flex-wrap gap-1">
                {commonIcons.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`p-1.5 rounded text-lg transition-colors ${
                      icon === i 
                        ? 'bg-[var(--primary)] text-white' 
                        : 'hover:bg-[var(--muted)]'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="Optional details..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Days of Week *</label>
            <div className="flex gap-1">
              {dayNames.map((name, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
                    daysOfWeek.includes(i)
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--muted)] hover:bg-[var(--muted)]/80'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isMedication"
              checked={isMedication}
              onChange={(e) => setIsMedication(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border)]"
            />
            <label htmlFor="isMedication" className="text-sm">
              This is a medication reminder
            </label>
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
              className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Routine'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
