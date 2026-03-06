'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "./stat-card";
import { CampaignsTable } from "./campaigns-table";
import { CallsTable } from "./calls-table";
import { SequencesTable } from "./sequences-table";
import { Mail, Phone, BarChart3, Users, TrendingUp, PhoneCall, Target, Calendar } from "lucide-react";

import type { Campaign } from "@/lib/emailbison";
import type { CallActivity, Sequence } from "@/lib/close";

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
    recentCalls: CallActivity[];
  };
  sequenceStats: {
    sequences: Sequence[];
    totalActive: number;
    totalPaused: number;
    totalFinished: number;
    totalSequences: number;
  };
}

export function DashboardTabs({ emailStats, campaignsWithStats, callStats, sequenceStats }: DashboardTabsProps) {
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

          {/* Tables */}
          <div className="grid lg:grid-cols-2 gap-6">
            <CampaignsTable campaigns={campaignsWithStats.slice(0, 5)} />
            <SequencesTable sequences={sequenceStats.sequences} />
          </div>
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

      {/* Cold Calling Tab */}
      <TabsContent value="calling" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today"
            value={callStats.todayCalls}
            subtitle="Calls made"
            icon={<PhoneCall className="w-4 h-4" />}
          />
          <StatCard
            title="This Week"
            value={callStats.weekCalls}
            subtitle="Calls made"
            icon={<Phone className="w-4 h-4" />}
          />
          <StatCard
            title="This Month"
            value={callStats.monthCalls}
            subtitle="Calls made"
            icon={<Phone className="w-4 h-4" />}
          />
          <StatCard
            title="Connect Rate"
            value={`${callStats.connectRate}%`}
            subtitle={`${callStats.meetingsBooked} meetings booked`}
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CallsTable calls={callStats.recentCalls} />
          <SequencesTable sequences={sequenceStats.sequences} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
