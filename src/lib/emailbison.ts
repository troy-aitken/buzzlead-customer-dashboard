const EMAILBISON_API_KEY = process.env.EMAILBISON_API_KEY!;
const EMAILBISON_BASE_URL = process.env.EMAILBISON_BASE_URL || 'https://send.buzzlead.io/api';

async function fetchEmailBison(endpoint: string) {
  const res = await fetch(`${EMAILBISON_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${EMAILBISON_API_KEY}`,
      'Accept': 'application/json',
    },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    console.error(`EmailBison API error: ${res.status} ${res.statusText}`);
    return null;
  }
  
  return res.json();
}

export interface Campaign {
  id: number;
  uuid: string;
  name: string;
  type: string;
  status: string;
  completion_percentage: number;
  emails_sent: number;
  opened: number;
  unique_opens: number;
  replied: number;
  unique_replies: number;
  bounced: number;
  unsubscribed: number;
  interested: number;
  total_leads_contacted: number;
  total_leads: number | null;
  max_emails_per_day: number;
  max_new_leads_per_day: number;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface Reply {
  id: number;
  uuid: string;
  folder: string;
  type: string;
  interested: boolean;
  automated_reply: boolean;
  date_received: string;
  campaign_id: number | null;
}

export async function getCampaigns(): Promise<Campaign[]> {
  const data = await fetchEmailBison('/campaigns');
  return data?.data || [];
}

export async function getReplies(limit: number = 200): Promise<Reply[]> {
  const data = await fetchEmailBison(`/replies?limit=${limit}`);
  return data?.data || [];
}

export async function getEmailStats() {
  const [campaigns, replies] = await Promise.all([
    getCampaigns(),
    getReplies(500), // Get recent replies for time-based stats
  ]);
  
  // Only count stats from ACTIVE campaigns (not draft/paused)
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const activeCampaignIds = new Set(activeCampaigns.map(c => c.id));
  
  // Calculate totals from active campaigns only
  let totalSent = 0;
  let totalReplies = 0;
  let totalBounces = 0;
  let positiveReplies = 0;
  
  for (const campaign of activeCampaigns) {
    totalSent += campaign.emails_sent || 0;
    totalReplies += campaign.replied || 0;
    totalBounces += campaign.bounced || 0;
    positiveReplies += campaign.interested || 0;
  }
  
  // Calculate time-based stats from replies linked to active campaigns only
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 30);
  
  // Filter replies to only those from active campaigns
  const activeReplies = replies.filter(r => r.campaign_id && activeCampaignIds.has(r.campaign_id));
  
  // Filter by type
  const realReplies = activeReplies.filter(r => !r.automated_reply && r.type !== 'Bounced');
  const bounced = activeReplies.filter(r => r.type === 'Bounced');
  const interested = activeReplies.filter(r => r.interested);
  
  const repliesToday = realReplies.filter(r => new Date(r.date_received) >= todayStart).length;
  const repliesWeek = realReplies.filter(r => new Date(r.date_received) >= weekStart).length;
  const repliesMonth = realReplies.filter(r => new Date(r.date_received) >= monthStart).length;
  
  const bouncesToday = bounced.filter(r => new Date(r.date_received) >= todayStart).length;
  const bouncesWeek = bounced.filter(r => new Date(r.date_received) >= weekStart).length;
  const bouncesMonth = bounced.filter(r => new Date(r.date_received) >= monthStart).length;
  
  const interestedToday = interested.filter(r => new Date(r.date_received) >= todayStart).length;
  const interestedWeek = interested.filter(r => new Date(r.date_received) >= weekStart).length;
  const interestedMonth = interested.filter(r => new Date(r.date_received) >= monthStart).length;
  
  return {
    // Totals (from active campaigns only)
    totalSent,
    totalReplies,
    totalBounces,
    positiveReplies,
    replyRate: totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(2) : '0',
    bounceRate: totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(2) : '0',
    positiveRate: totalReplies > 0 ? ((positiveReplies / totalReplies) * 100).toFixed(2) : '0',
    campaigns,
    // Time-based replies (from active campaigns only)
    repliesToday,
    repliesWeek,
    repliesMonth,
    // Time-based bounces
    bouncesToday,
    bouncesWeek,
    bouncesMonth,
    // Time-based interested
    interestedToday,
    interestedWeek,
    interestedMonth,
  };
}

export async function getCampaignsWithStats(): Promise<Campaign[]> {
  return getCampaigns();
}
