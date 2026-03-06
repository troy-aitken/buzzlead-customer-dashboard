'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsTable } from "./campaigns-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, BarChart3, Users, PhoneCall, Target, Calendar, Clock, ThumbsDown, Play, RefreshCw } from "lucide-react";

import type { Campaign, InterestedLead, MeetingBooked } from "@/lib/emailbison";
import type { CallActivity, MeetingFromCall } from "@/lib/close";
import { ExternalLink, CalendarCheck } from "lucide-react";

interface DashboardTabsProps {
  emailStats: {
    totalSent: number;
    totalReplies: number;
    totalBounces: number;
    positiveReplies: number;
    replyRate: string;
    bounceRate: string;
    positiveRate: string;
    campaigns: Campaign[];
    // Time-based stats
    repliesToday?: number;
    repliesWeek?: number;
    repliesMonth?: number;
    bouncesToday?: number;
    bouncesWeek?: number;
    bouncesMonth?: number;
    interestedToday?: number;
    interestedWeek?: number;
    interestedMonth?: number;
    // Interested leads list
    interestedLeads?: InterestedLead[];
  };
  campaignsWithStats: Campaign[];
  meetingsBooked: Array<MeetingBooked | MeetingFromCall>;
  callStats: {
    totalCalls: number;
    todayCalls: number;
    weekCalls: number;
    monthCalls: number;
    connectRate: string;
    meetingsBooked: number;
    meetingsTodayCount?: number;
    meetingsWeekCount?: number;
    meetingsMonthCount?: number;
    notInterestedTodayCount?: number;
    notInterestedWeekCount?: number;
    notInterestedMonthCount?: number;
    recentCalls: CallActivity[];
  };
}

// Stat row component matching the screenshot style
function StatRow({ title, icon, stats }: { 
  title: string; 
  icon: React.ReactNode;
  stats: { today: number | string; week: number | string; month: number | string; monthLabel?: string };
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-white font-medium flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Today</span>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.today}</div>
            <div className="text-xs text-slate-500 mt-1">{title.toLowerCase()} today</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">This Week</span>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.week}</div>
            <div className="text-xs text-slate-500 mt-1">{title.toLowerCase()} this week</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">This Month</span>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.month}</div>
            <div className="text-xs text-slate-500 mt-1">{stats.monthLabel || 'in March'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardTabs({ emailStats, campaignsWithStats, meetingsBooked, callStats }: DashboardTabsProps) {
  const router = useRouter();
  const [callTableTab, setCallTableTab] = useState('recordings');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    // Update the timestamp after a short delay to show new time
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
        <TabsTrigger 
          value="overview" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Lead Generation
        </TabsTrigger>
        <TabsTrigger 
          value="email"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Mail className="w-4 h-4 mr-2" />
          Cold Email
        </TabsTrigger>
        <TabsTrigger 
          value="calling"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Phone className="w-4 h-4 mr-2" />
          Cold Calling
        </TabsTrigger>
        <TabsTrigger 
          value="meetings"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <CalendarCheck className="w-4 h-4 mr-2" />
          Meetings Booked
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        {/* Header with refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Lead Generation Dashboard</h2>
            <p className="text-sm text-slate-400">Cold email & calling performance across all campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Updated {lastUpdated}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Cold Email Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Cold Email Performance
            </h2>
            <div className="space-y-4">
              <StatRow 
                title="Replies"
                icon={<Mail className="w-4 h-4 text-blue-400" />}
                stats={{
                  today: emailStats.repliesToday || 0,
                  week: emailStats.repliesWeek || 0,
                  month: emailStats.repliesMonth || 0,
                }}
              />
              <StatRow 
                title="Bounces"
                icon={<Target className="w-4 h-4 text-red-400" />}
                stats={{
                  today: emailStats.bouncesToday || 0,
                  week: emailStats.bouncesWeek || 0,
                  month: emailStats.bouncesMonth || 0,
                }}
              />
              <StatRow 
                title="Interested"
                icon={<Users className="w-4 h-4 text-green-400" />}
                stats={{
                  today: emailStats.interestedToday || 0,
                  week: emailStats.interestedWeek || 0,
                  month: emailStats.interestedMonth || 0,
                }}
              />
            </div>
          </div>

          {/* Cold Calling Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-400" />
              Cold Calling Performance
            </h2>
            <div className="space-y-4">
              <StatRow 
                title="Meetings Booked"
                icon={<Calendar className="w-4 h-4 text-blue-400" />}
                stats={{
                  today: callStats.meetingsTodayCount || 0,
                  week: callStats.meetingsWeekCount || 0,
                  month: callStats.meetingsMonthCount || 0,
                }}
              />
              <StatRow 
                title="Not Interested"
                icon={<ThumbsDown className="w-4 h-4 text-orange-400" />}
                stats={{
                  today: callStats.notInterestedTodayCount || 0,
                  week: callStats.notInterestedWeekCount || 0,
                  month: callStats.notInterestedMonthCount || 0,
                }}
              />
              <StatRow 
                title="Calls Made"
                icon={<PhoneCall className="w-4 h-4 text-green-400" />}
                stats={{
                  today: callStats.todayCalls || 0,
                  week: callStats.weekCalls || 0,
                  month: callStats.monthCalls || 0,
                }}
              />
            </div>
          </div>

          {/* Campaigns Table - Full Width */}
          <CampaignsTable campaigns={campaignsWithStats} />
        </div>
      </TabsContent>

      {/* Cold Email Tab */}
      <TabsContent value="email" className="space-y-6">
        {/* Header with last updated */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Cold Email Dashboard</h2>
            <p className="text-sm text-slate-400">Replies, bounces & interested leads across all campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Updated {lastUpdated}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Replies Row */}
        <StatRow 
          title="Replies"
          icon={<Mail className="w-4 h-4 text-blue-400" />}
          stats={{
            today: emailStats.repliesToday || 0,
            week: emailStats.repliesWeek || 0,
            month: emailStats.repliesMonth || 0,
          }}
        />

        {/* Bounces Row */}
        <StatRow 
          title="Bounces"
          icon={<Target className="w-4 h-4 text-red-400" />}
          stats={{
            today: emailStats.bouncesToday || 0,
            week: emailStats.bouncesWeek || 0,
            month: emailStats.bouncesMonth || 0,
          }}
        />

        {/* Interested Row */}
        <StatRow 
          title="Interested"
          icon={<Users className="w-4 h-4 text-green-400" />}
          stats={{
            today: emailStats.interestedToday || 0,
            week: emailStats.interestedWeek || 0,
            month: emailStats.interestedMonth || 0,
          }}
        />

        {/* Campaigns Table */}
        <CampaignsTable campaigns={campaignsWithStats} />

        {/* Interested Leads Table */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              Interested Leads ({emailStats.interestedLeads?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Company</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Thread</th>
                  </tr>
                </thead>
                <tbody>
                  {emailStats.interestedLeads?.slice(0, 25).map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-sm text-white font-medium">{lead.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 text-xs">
                          {lead.company || '—'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300">{lead.email}</td>
                      <td className="py-3 px-4 text-sm text-slate-400">
                        {new Date(lead.dateReceived).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <a 
                          href={lead.threadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                  {(!emailStats.interestedLeads || emailStats.interestedLeads.length === 0) && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No interested leads yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Cold Calling Tab - Redesigned to match screenshot */}
      <TabsContent value="calling" className="space-y-6">
        {/* Header with last updated */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Cold Calling Dashboard</h2>
            <p className="text-sm text-slate-400">Meetings booked, not interested & calls across all workspaces</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Updated {lastUpdated}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Meetings Booked Row */}
        <StatRow 
          title="Meetings Booked"
          icon={<Calendar className="w-4 h-4 text-blue-400" />}
          stats={{
            today: callStats.meetingsTodayCount || 0,
            week: callStats.meetingsWeekCount || 0,
            month: callStats.meetingsMonthCount || 0,
          }}
        />

        {/* Not Interested Row */}
        <StatRow 
          title="Not Interested"
          icon={<ThumbsDown className="w-4 h-4 text-orange-400" />}
          stats={{
            today: callStats.notInterestedTodayCount || 0,
            week: callStats.notInterestedWeekCount || 0,
            month: callStats.notInterestedMonthCount || 0,
          }}
        />

        {/* Calls Made Row */}
        <StatRow 
          title="Calls Made"
          icon={<PhoneCall className="w-4 h-4 text-green-400" />}
          stats={{
            today: callStats.todayCalls || 0,
            week: callStats.weekCalls || 0,
            month: callStats.monthCalls || 0,
          }}
        />

        {/* Tabbed Data Section */}
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-slate-800 pb-2">
            {['recordings', 'meetings', 'notinterested', 'calls', 'recent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCallTableTab(tab)}
                className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                  callTableTab === tab 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab === 'recordings' && `Call Recordings (${callStats.recentCalls?.length || 0})`}
                {tab === 'meetings' && 'Meetings'}
                {tab === 'notinterested' && 'Not Interested'}
                {tab === 'calls' && 'All Calls'}
                {tab === 'recent' && 'Recent Meetings'}
              </button>
            ))}
          </div>

          {/* Today's Calls Over 1 Minute Table */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-white">Today&apos;s Calls Over 1 Minute</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Agent</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Workspace</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Lead</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Lead Status</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Phone</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Duration</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Time</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Recording</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callStats.recentCalls?.filter(c => {
                      const duration = typeof c.duration === 'number' ? c.duration : parseInt(String(c.duration || '0'));
                      return duration >= 60;
                    }).slice(0, 10).map((call, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-sm text-white">{call.user_name || 'Agent'}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 text-xs">
                            {call.lead_name?.split(' ')[0] || 'Workspace'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">{call.lead_name || '—'}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              call.disposition === 'answered' 
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : call.disposition === 'no-answer'
                                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                            }`}
                          >
                            {call.disposition || 'Unknown'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-400">{call.phone || '—'}</td>
                        <td className="py-3 px-4 text-sm text-white font-mono">
                          {Math.floor((typeof call.duration === 'number' ? call.duration : parseInt(String(call.duration || '0'))) / 60)}:{((typeof call.duration === 'number' ? call.duration : parseInt(String(call.duration || '0'))) % 60).toString().padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-400">
                          {new Date(call.date_created || Date.now()).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </td>
                        <td className="py-3 px-4">
                          {call.recording_url ? (
                            <a 
                              href={call.recording_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                            >
                              <Play className="w-4 h-4" />
                              <span className="text-xs">Play</span>
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!callStats.recentCalls || callStats.recentCalls.filter(c => (typeof c.duration === 'number' ? c.duration : parseInt(String(c.duration || '0'))) >= 60).length === 0) && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          No calls over 1 minute today
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-4">
          Data sourced from Close.com • Auto-refreshes every 5 minutes
        </div>
      </TabsContent>

      {/* Meetings Booked Tab */}
      <TabsContent value="meetings" className="space-y-6">
        {/* Header with last updated */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Meetings Booked</h2>
            <p className="text-sm text-slate-400">All meetings booked from cold email and cold calling</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Updated {lastUpdated}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Total Meetings</span>
                <CalendarCheck className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white">{meetingsBooked?.length || 0}</div>
              <div className="text-xs text-slate-500 mt-1">all time</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">From Email</span>
                <Mail className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-white">
                {meetingsBooked?.filter(m => m.source === 'email').length || 0}
              </div>
              <div className="text-xs text-slate-500 mt-1">email meetings</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">From Calls</span>
                <Phone className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white">
                {meetingsBooked?.filter(m => m.source === 'call').length || 0}
              </div>
              <div className="text-xs text-slate-500 mt-1">call meetings</div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings Table */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-green-400" />
              All Meetings ({meetingsBooked?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Company</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Source</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {meetingsBooked?.slice(0, 50).map((meeting) => (
                    <tr key={meeting.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-sm text-white font-medium">{meeting.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 text-xs">
                          {meeting.company || '—'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300">
                        {meeting.email || ('phone' in meeting ? meeting.phone : '—')}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400">
                        {new Date(meeting.dateBooked).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            meeting.source === 'email'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-green-500/10 border-green-500/30 text-green-400'
                          }`}
                        >
                          {meeting.source === 'email' ? 'Email' : 'Call'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {meeting.source === 'email' && 'threadUrl' in meeting && meeting.threadUrl ? (
                          <a 
                            href={meeting.threadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Thread
                          </a>
                        ) : meeting.source === 'call' && 'recordingUrl' in meeting && meeting.recordingUrl ? (
                          <a 
                            href={meeting.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Recording
                          </a>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!meetingsBooked || meetingsBooked.length === 0) && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No meetings booked yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-4">
          Data sourced from Email Bison & Close.com • Auto-refreshes every 5 minutes
        </div>
      </TabsContent>
    </Tabs>
  );
}
