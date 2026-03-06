'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "./stat-card";
import { CampaignsTable } from "./campaigns-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, BarChart3, Users, TrendingUp, PhoneCall, Target, Calendar, Clock, ThumbsDown, Play, RefreshCw } from "lucide-react";

import type { Campaign } from "@/lib/emailbison";
import type { CallActivity } from "@/lib/close";

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
  };
  campaignsWithStats: Campaign[];
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

export function DashboardTabs({ emailStats, campaignsWithStats, callStats }: DashboardTabsProps) {
  const [callTableTab, setCallTableTab] = useState('recordings');
  const [lastUpdated] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

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
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6">
          {/* Cold Email Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Cold Email Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Emails Sent"
                value={emailStats.totalSent.toLocaleString()}
                subtitle="Total emails delivered"
                icon={<Mail className="w-4 h-4" />}
              />
              <StatCard
                title="Reply Rate"
                value={`${emailStats.replyRate}%`}
                subtitle={`${emailStats.totalReplies.toLocaleString()} total replies`}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <StatCard
                title="Bounce Rate"
                value={`${emailStats.bounceRate}%`}
                subtitle={`${emailStats.totalBounces.toLocaleString()} bounced`}
                icon={<Target className="w-4 h-4" />}
              />
              <StatCard
                title="Positive Reply Rate"
                value={`${emailStats.positiveRate}%`}
                subtitle={`${emailStats.positiveReplies.toLocaleString()} interested`}
                icon={<Users className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Cold Calling Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-400" />
              Cold Calling Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Calls Today"
                value={callStats.todayCalls}
                subtitle={`${callStats.weekCalls} this week`}
                icon={<PhoneCall className="w-4 h-4" />}
              />
              <StatCard
                title="Calls This Month"
                value={callStats.monthCalls}
                subtitle={`${callStats.totalCalls} total`}
                icon={<Phone className="w-4 h-4" />}
              />
              <StatCard
                title="Connect Rate"
                value={`${callStats.connectRate}%`}
                subtitle="Connected calls"
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <StatCard
                title="Meetings Booked"
                value={callStats.meetingsBooked}
                subtitle="From cold calls"
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Campaigns Table - Full Width */}
          <CampaignsTable campaigns={campaignsWithStats} />
        </div>
      </TabsContent>

      {/* Cold Email Tab */}
      <TabsContent value="email" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sent"
            value={emailStats.totalSent.toLocaleString()}
            icon={<Mail className="w-4 h-4" />}
          />
          <StatCard
            title="Total Replies"
            value={emailStats.totalReplies.toLocaleString()}
            subtitle={`${emailStats.replyRate}% reply rate`}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            title="Bounced"
            value={emailStats.totalBounces.toLocaleString()}
            subtitle={`${emailStats.bounceRate}% bounce rate`}
            icon={<Target className="w-4 h-4" />}
          />
          <StatCard
            title="Interested"
            value={emailStats.positiveReplies.toLocaleString()}
            subtitle={`${emailStats.positiveRate}% of replies`}
            icon={<Users className="w-4 h-4" />}
          />
        </div>
        
        <CampaignsTable campaigns={campaignsWithStats} />
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
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
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
    </Tabs>
  );
}
