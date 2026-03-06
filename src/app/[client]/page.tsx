import { notFound } from 'next/navigation';
import { getClientBySlug } from "@/lib/airtable";
import { getEmailStats, getCampaignsWithStats, getMeetingsBookedFromEmail, MeetingBooked, BisonConfig } from "@/lib/emailbison";
import { getCallStats, getMeetingsFromCalls, MeetingFromCall } from "@/lib/close";
import { DashboardTabs } from "@/components/dashboard-tabs";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface Props {
  params: { client: string };
}

export default async function ClientDashboardPage({ params }: Props) {
  const client = await getClientBySlug(params.client);
  
  if (!client || !client.bisonApiKey) {
    notFound();
  }

  // Build config for this client
  const bisonConfig: BisonConfig = {
    apiKey: client.bisonApiKey,
    baseUrl: client.bisonBaseUrl || 'https://send.buzzlead.io',
  };

  // Fetch all data in parallel
  const [emailStats, campaignsWithStats, emailMeetings, callStats, callMeetings] = await Promise.all([
    getEmailStats(bisonConfig).catch(() => ({
      totalSent: 0,
      totalReplies: 0,
      totalBounces: 0,
      positiveReplies: 0,
      replyRate: '0',
      bounceRate: '0',
      positiveRate: '0',
      campaigns: [],
    })),
    getCampaignsWithStats(bisonConfig).catch(() => []),
    getMeetingsBookedFromEmail(bisonConfig).catch(() => [] as MeetingBooked[]),
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
      <div>
        <h1 className="text-2xl font-bold text-white">{client.name}</h1>
        <p className="text-slate-400 mt-1">Performance Dashboard</p>
      </div>
      
      <DashboardTabs
        emailStats={emailStats}
        campaignsWithStats={campaignsWithStats}
        meetingsBooked={allMeetings}
        callStats={callStats}
      />
    </div>
  );
}
