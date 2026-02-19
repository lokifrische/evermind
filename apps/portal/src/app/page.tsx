"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout, StatCard, ActivityFeed, QuickActions, PageWrapper } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabase/client";
import { smoothTransition } from "@/lib/animations";

const DEMO_CARE_CIRCLE_ID = process.env.NEXT_PUBLIC_DEMO_CARE_CIRCLE_ID || '11111111-1111-1111-1111-111111111111';

interface Stats {
  memoriesViewed: number;
  familyConnections: number;
  activitiesCompleted: number;
  routinesCompleted: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  type: 'visit' | 'routine' | 'memory';
  icon: React.ReactNode;
}

interface PatientInfo {
  name: string;
  lastActive: string | null;
  isActive: boolean;
}

export default function Dashboard() {
  const { profile, careCircleId } = useAuth();
  const [stats, setStats] = useState<Stats>({ memoriesViewed: 0, familyConnections: 0, activitiesCompleted: 0, routinesCompleted: 0 });
  const [upcoming, setUpcoming] = useState<UpcomingEvent[]>([]);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const activeCareCircleId = careCircleId || DEMO_CARE_CIRCLE_ID;
  const userName = profile?.full_name?.split(' ')[0] || 'there';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = getSupabaseClient();

      // Fetch patient info
      const { data: patientData } = await supabase
        .from('patients')
        .select('preferred_name')
        .eq('care_circle_id', activeCareCircleId)
        .single();

      // Fetch recent activity stats (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: activityData } = await supabase
        .from('activity_log')
        .select('activity_type, created_at')
        .eq('care_circle_id', activeCareCircleId)
        .gte('created_at', weekAgo.toISOString());

      // Calculate stats
      const memoriesViewed = activityData?.filter(a => a.activity_type === 'memory_viewed').length || 0;
      const familyConnections = activityData?.filter(a => 
        a.activity_type === 'family_viewed' || a.activity_type === 'call_made'
      ).length || 0;
      const activitiesCompleted = activityData?.filter(a => 
        a.activity_type === 'routine_completed'
      ).length || 0;

      setStats({
        memoriesViewed,
        familyConnections,
        activitiesCompleted,
        routinesCompleted: activitiesCompleted,
      });

      // Fetch upcoming visits
      const { data: visitsData } = await supabase
        .from('scheduled_visits')
        .select('id, visitor_name, scheduled_at')
        .eq('care_circle_id', activeCareCircleId)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(3);

      // Fetch today's routines
      const { data: routinesData } = await supabase
        .from('daily_routines')
        .select('id, title, time, icon')
        .eq('care_circle_id', activeCareCircleId)
        .order('time', { ascending: true })
        .limit(3);

      const upcomingEvents: UpcomingEvent[] = [];

      // Add visits
      visitsData?.forEach(visit => {
        const date = new Date(visit.scheduled_at);
        const isToday = date.toDateString() === new Date().toDateString();
        const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
        
        let timeStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (isToday) timeStr = `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        if (isTomorrow) timeStr = `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

        upcomingEvents.push({
          id: visit.id,
          title: `Visit from ${visit.visitor_name}`,
          time: timeStr,
          type: 'visit',
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          ),
        });
      });

      // Add routines for today
      const today = new Date().getDay();
      routinesData?.filter(r => {
        // This is simplified - in real app, filter by days_of_week
        return true;
      }).forEach(routine => {
        const [hours, minutes] = routine.time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;

        upcomingEvents.push({
          id: routine.id,
          title: routine.title,
          time: `Today at ${displayHour}:${minutes} ${ampm}`,
          type: 'routine',
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-xl">
              {routine.icon || '📋'}
            </div>
          ),
        });
      });

      setUpcoming(upcomingEvents.slice(0, 5));

      // Check if patient is active (activity in last 30 minutes)
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      const { data: recentActivity } = await supabase
        .from('activity_log')
        .select('created_at')
        .eq('care_circle_id', activeCareCircleId)
        .gte('created_at', thirtyMinsAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      setPatient({
        name: patientData?.preferred_name || 'the patient',
        lastActive: recentActivity?.[0]?.created_at || null,
        isActive: (recentActivity?.length || 0) > 0,
      });

      setLoading(false);
    };

    fetchDashboardData();
  }, [activeCareCircleId]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return 'No recent activity';
    const now = new Date();
    const then = new Date(dateStr);
    const mins = Math.floor((now.getTime() - then.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <DashboardLayout>
      <PageWrapper>
        {/* Header with subtle gradient */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
        >
          <h1 className="text-2xl font-semibold tracking-tight">{getGreeting()}, {userName}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Here&apos;s how {patient?.name || 'your loved one'} is doing
          </p>
        </motion.div>

        {/* Quick Actions */}
        <section className="mb-8">
          <QuickActions />
        </section>

        {/* Stats Grid */}
        <section className="mb-8">
          <motion.h2 
            className="mb-4 text-lg font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            This Week
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Memories Viewed"
              value={loading ? '-' : stats.memoriesViewed}
              subtitle={stats.memoriesViewed === 0 ? 'No activity yet' : 'photos and stories'}
              delay={0.1}
              icon={
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              }
            />
            <StatCard
              title="Family Connections"
              value={loading ? '-' : stats.familyConnections}
              subtitle={stats.familyConnections === 0 ? 'No connections yet' : 'calls and views'}
              delay={0.15}
              icon={
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              }
            />
            <StatCard
              title="Routines Completed"
              value={loading ? '-' : stats.routinesCompleted}
              subtitle={stats.routinesCompleted === 0 ? 'No completions yet' : 'this week'}
              delay={0.2}
              icon={
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Memories"
              value={loading ? '-' : stats.memoriesViewed > 0 ? '5+' : '0'}
              subtitle="in the collection"
              delay={0.25}
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>

          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smoothTransition, delay: 0.3 }}
          >
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden">
              <div className="border-b border-[var(--border)] px-6 py-4">
                <h3 className="text-lg font-semibold">Upcoming</h3>
              </div>
              {upcoming.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--muted-foreground)]">
                  No upcoming events
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {upcoming.map((event) => (
                    <motion.div 
                      key={event.id}
                      className="px-6 py-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3">
                        {event.icon}
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{event.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Card */}
            {patient && (
              <motion.div 
                className={`mt-4 rounded-xl border p-4 ${
                  patient.isActive
                    ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-900 dark:from-emerald-950/50 dark:to-teal-950/50'
                    : 'border-[var(--border)] bg-[var(--card)]'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  {patient.isActive ? (
                    <motion.div 
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500"
                      animate={{ 
                        boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 10px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                      <svg className="h-5 w-5 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className={`font-medium ${patient.isActive ? 'text-emerald-900 dark:text-emerald-100' : ''}`}>
                      {patient.isActive ? `${patient.name} is active` : `${patient.name} is inactive`}
                    </p>
                    <p className={`text-sm ${patient.isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-[var(--muted-foreground)]'}`}>
                      {patient.lastActive ? `Last activity ${getTimeAgo(patient.lastActive)}` : 'No recent activity'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
