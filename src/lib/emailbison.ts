// Cache server URL (local PM2 service)
const CACHE_SERVER = process.env.CACHE_SERVER_URL || 'http://localhost:3847';

export interface BisonConfig {
  apiKey: string;
  baseUrl: string;
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

export interface InterestedLead {
  id: number;
  replyUuid: string;
  name: string;
  email: string;
  company: string;
  dateReceived: string;
  threadUrl: string;
}

export interface MeetingBooked {
  id: string;
  name: string;
  email: string;
  company: string;
  dateBooked: string;
  source: 'email' | 'call';
  threadUrl?: string;
  recordingUrl?: string;
}

export interface CachedEmailStats {
  totalSent: number;
  totalReplies: number;
  totalBounces: number;
  positiveReplies: number;
  replyRate: string;
  bounceRate: string;
  positiveRate: string;
  campaigns: Campaign[];
  repliesToday: number;
  repliesWeek: number;
  repliesMonth: number;
  bouncesToday: number;
  bouncesWeek: number;
  bouncesMonth: number;
  interestedToday: number;
  interestedWeek: number;
  interestedMonth: number;
  interestedLeads: InterestedLead[];
  cachedAt?: string;
  clientName?: string;
  clientSlug?: string;
}

// Fetch from local cache server
export async function getEmailStatsFromCache(slug: string): Promise<CachedEmailStats | null> {
  try {
    const res = await fetch(`${CACHE_SERVER}/api/client/${slug}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.error(`Cache server error: ${res.status}`);
      return null;
    }
    
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('Failed to fetch from cache:', err);
    return null;
  }
}

// Trigger refresh on cache server
export async function triggerRefresh(slug: string): Promise<CachedEmailStats | null> {
  try {
    const res = await fetch(`${CACHE_SERVER}/api/client/${slug}/refresh`, {
      method: 'POST',
    });
    
    if (!res.ok) {
      throw new Error(`Refresh failed: ${res.status}`);
    }
    
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('Failed to trigger refresh:', err);
    return null;
  }
}

// Get campaigns from cached data
export async function getCampaignsWithStats(slug: string): Promise<Campaign[]> {
  const data = await getEmailStatsFromCache(slug);
  return data?.campaigns || [];
}

// For backwards compatibility - returns empty stats structure
function emptyStats(): CachedEmailStats {
  return {
    totalSent: 0,
    totalReplies: 0,
    totalBounces: 0,
    positiveReplies: 0,
    replyRate: '0',
    bounceRate: '0',
    positiveRate: '0',
    campaigns: [],
    repliesToday: 0,
    repliesWeek: 0,
    repliesMonth: 0,
    bouncesToday: 0,
    bouncesWeek: 0,
    bouncesMonth: 0,
    interestedToday: 0,
    interestedWeek: 0,
    interestedMonth: 0,
    interestedLeads: [],
  };
}

// Main function to get email stats for a client
export async function getEmailStats(slug: string): Promise<CachedEmailStats> {
  const cached = await getEmailStatsFromCache(slug);
  return cached || emptyStats();
}

// Get meetings booked (from cache - would need to be added to cache server)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getMeetingsBookedFromEmail(_slug: string): Promise<MeetingBooked[]> {
  // For now, return empty - meetings would need to be added to cache
  // The cache server would need to fetch leads with "Meeting Booked" tag
  return [];
}
