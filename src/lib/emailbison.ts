const EMAILBISON_API_KEY = process.env.EMAILBISON_API_KEY!;
const EMAILBISON_BASE_URL = process.env.EMAILBISON_BASE_URL || 'https://app.emailbison.com/api';

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

export async function getCampaigns() {
  const data = await fetchEmailBison('/campaigns');
  return data?.data || [];
}

export async function getCampaignStats(campaignId: string) {
  const data = await fetchEmailBison(`/campaigns/${campaignId}/statistics`);
  return data?.data || null;
}

export async function getEmailStats() {
  // Get aggregated stats across all campaigns
  const campaigns = await getCampaigns();
  
  let totalSent = 0;
  let totalReplies = 0;
  let totalBounces = 0;
  let positiveReplies = 0;
  
  for (const campaign of campaigns.slice(0, 10)) { // Limit to recent 10
    const stats = await fetchEmailBison(`/campaigns/${campaign.id}/statistics`);
    if (stats?.data) {
      totalSent += stats.data.sent || 0;
      totalReplies += stats.data.replied || 0;
      totalBounces += stats.data.bounced || 0;
      positiveReplies += stats.data.interested || 0;
    }
  }
  
  return {
    totalSent,
    totalReplies,
    totalBounces,
    positiveReplies,
    replyRate: totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : '0',
    bounceRate: totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(1) : '0',
    positiveRate: totalReplies > 0 ? ((positiveReplies / totalReplies) * 100).toFixed(1) : '0',
    campaigns: campaigns.slice(0, 5),
  };
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  created_at: string;
  statistics?: {
    sent: number;
    opened: number;
    replied: number;
    bounced: number;
    interested: number;
  };
}

export async function getCampaignsWithStats(): Promise<Campaign[]> {
  const campaigns = await getCampaigns();
  const campaignsWithStats: Campaign[] = [];
  
  for (const campaign of campaigns.slice(0, 10)) {
    const stats = await fetchEmailBison(`/campaigns/${campaign.id}/statistics`);
    campaignsWithStats.push({
      ...campaign,
      statistics: stats?.data || null,
    });
  }
  
  return campaignsWithStats;
}
