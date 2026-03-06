const CLOSE_API_KEY = process.env.CLOSE_API_KEY!;
const CLOSE_BASE_URL = process.env.CLOSE_BASE_URL || 'https://api.close.com/api/v1';

async function fetchClose(endpoint: string) {
  const auth = Buffer.from(`${CLOSE_API_KEY}:`).toString('base64');
  
  const res = await fetch(`${CLOSE_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
    },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    console.error(`Close API error: ${res.status} ${res.statusText}`);
    return null;
  }
  
  return res.json();
}

export interface CallActivity {
  id: string;
  direction: 'outbound' | 'inbound';
  duration: number;
  disposition?: string;
  note?: string;
  date_created: string;
  user_name?: string;
  contact_name?: string;
  lead_name?: string;
}

export interface CallStats {
  totalCalls: number;
  todayCalls: number;
  weekCalls: number;
  monthCalls: number;
  connectRate: string;
  meetingsBooked: number;
  recentCalls: CallActivity[];
}

export async function getCallActivities(): Promise<CallActivity[]> {
  const data = await fetchClose('/activity/call/?_limit=100&_order_by=-date_created');
  return data?.data || [];
}

export async function getCallStats(): Promise<CallStats> {
  const calls = await getCallActivities();
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 30);
  
  const todayCalls = calls.filter(c => new Date(c.date_created) >= todayStart);
  const weekCalls = calls.filter(c => new Date(c.date_created) >= weekStart);
  const monthCalls = calls.filter(c => new Date(c.date_created) >= monthStart);
  
  // Connected calls have duration > 30 seconds
  const connectedCalls = calls.filter(c => c.duration > 30);
  const connectRate = calls.length > 0 
    ? ((connectedCalls.length / calls.length) * 100).toFixed(1) 
    : '0';
  
  // Meetings booked (look for disposition containing 'meeting' or 'booked')
  const meetingsBooked = calls.filter(c => 
    c.disposition?.toLowerCase().includes('meeting') || 
    c.disposition?.toLowerCase().includes('booked') ||
    c.disposition?.toLowerCase().includes('demo')
  ).length;
  
  return {
    totalCalls: calls.length,
    todayCalls: todayCalls.length,
    weekCalls: weekCalls.length,
    monthCalls: monthCalls.length,
    connectRate,
    meetingsBooked,
    recentCalls: calls.slice(0, 10),
  };
}

export interface Sequence {
  id: string;
  name: string;
  status: string;
  subscriptions_active: number;
  subscriptions_paused: number;
  subscriptions_finished: number;
}

export async function getSequences(): Promise<Sequence[]> {
  const data = await fetchClose('/sequence/');
  return data?.data || [];
}

export async function getSequenceStats() {
  const sequences = await getSequences();
  
  const activeSequences = sequences.filter(s => s.status === 'active');
  const totalActive = sequences.reduce((sum, s) => sum + (s.subscriptions_active || 0), 0);
  const totalPaused = sequences.reduce((sum, s) => sum + (s.subscriptions_paused || 0), 0);
  const totalFinished = sequences.reduce((sum, s) => sum + (s.subscriptions_finished || 0), 0);
  
  return {
    sequences: activeSequences.slice(0, 5),
    totalActive,
    totalPaused,
    totalFinished,
    totalSequences: sequences.length,
  };
}
