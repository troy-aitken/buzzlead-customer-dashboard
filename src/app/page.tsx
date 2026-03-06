import { getEmailStats, getCampaignsWithStats } from "@/lib/emailbison";
import { getCallStats } from "@/lib/close";
import { DashboardTabs } from "@/components/dashboard-tabs";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function DashboardPage() {
  // Fetch all data in parallel
  const [emailStats, campaignsWithStats, callStats] = await Promise.all([
    getEmailStats().catch(() => ({
      totalSent: 0,
      totalReplies: 0,
      totalBounces: 0,
      positiveReplies: 0,
      replyRate: '0',
      bounceRate: '0',
      positiveRate: '0',
      campaigns: [],
    })),
    getCampaignsWithStats().catch(() => []),
    getCallStats().catch(() => ({
      totalCalls: 0,
      todayCalls: 0,
      weekCalls: 0,
      monthCalls: 0,
      connectRate: '0',
      meetingsBooked: 0,
      recentCalls: [],
    })),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
        <p className="text-slate-400 mt-1">Track your lead generation metrics in real-time</p>
      </div>
      
      <DashboardTabs
        emailStats={emailStats}
        campaignsWithStats={campaignsWithStats}
        callStats={callStats}
      />
    </div>
  );
}
