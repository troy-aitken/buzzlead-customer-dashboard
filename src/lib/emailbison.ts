const EMAILBISON_API_KEY = process.env.EMAILBISON_API_KEY!;
const EMAILBISON_BASE_URL = process.env.EMAILBISON_BASE_URL || 'https://personal.buzzlead.io/api';

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

export async function getCampaigns(): Promise<Campaign[]> {
  const data = await fetchEmailBison('/campaigns');
  return data?.data || [];
}

export async function getCampaignStats(campaignId: string) {
  const data = await fetchEmailBison(`/campaigns/${campaignId}/statistics`);
  return data?.data || null;
}

export async function getEmailStats() {
  const campaigns = await getCampaigns();
  
  let totalSent = 0;
  let totalReplies = 0;
  let totalBounces = 0;
  let positiveReplies = 0;
  
  for (const campaign of campaigns) {
    totalSent += campaign.emails_sent || 0;
    totalReplies += campaign.replied || 0;
    totalBounces += campaign.bounced || 0;
    positiveReplies += campaign.interested || 0;
  }
  
  return {
    totalSent,
    totalReplies,
    totalBounces,
    positiveReplies,
    replyRate: totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(2) : '0',
    bounceRate: totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(2) : '0',
    positiveRate: totalReplies > 0 ? ((positiveReplies / totalReplies) * 100).toFixed(2) : '0',
    campaigns,
  };
}

export async function getCampaignsWithStats(): Promise<Campaign[]> {
  return getCampaigns();
}
