import { notFound } from 'next/navigation';
import { getClientBySlug } from "@/lib/airtable";
import { getEmailStats, getMeetingsBookedFromEmail } from "@/lib/emailbison";
import { getCallStats, getMeetingsFromCalls, MeetingFromCall } from "@/lib/close";
import { DashboardTabs } from "@/components/dashboard-tabs";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface Props {
  params: { client: string };
}

export default async function ClientDashboardPage({ params }: Props) {
  const client = await getClientBySlug(params.client);
  
  if (!client) {
    notFound();
  }

  // Fetch data from cache server + Close API
  const [emailStats, emailMeetings, callStats, callMeetings] = await Promise.all([
    getEmailStats(params.client),
    getMeetingsBookedFromEmail(params.client),
    // Use default Close config (shared across clients for now)
    getCallStats().catch(() => ({
      totalCalls: 0,
      todayCalls: 0,
      weekCalls: 0,
      monthCalls: 0,
      connectRate: '0',
      meetingsBooked: 0,
      recentCalls: [],
    })),
    getMeetingsFromCalls().catch(() => [] as MeetingFromCall[]),
  ]);

  // Combine and sort meetings by date (newest first)
  const allMeetings = [...emailMeetings, ...callMeetings].sort(
    (a, b) => new Date(b.dateBooked).getTime() - new Date(a.dateBooked).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{client.name}</h1>
          <p className="text-slate-400 mt-1">Performance Dashboard</p>
        </div>
        {emailStats.cachedAt && (
          <div className="text-xs text-slate-500">
            Data cached: {new Date(emailStats.cachedAt).toLocaleString()}
          </div>
        )}
      </div>
      
      <DashboardTabs
        emailStats={emailStats}
        campaignsWithStats={emailStats.campaigns || []}
        meetingsBooked={allMeetings}
        callStats={callStats}
        clientSlug={params.client}
      />
    </div>
  );
}
