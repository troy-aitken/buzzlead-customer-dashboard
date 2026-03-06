'use client';

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Campaign } from "@/lib/emailbison";

interface CampaignsTableProps {
  campaigns: Campaign[];
}

function formatPercent(value: number, total: number): string {
  if (total === 0) return '0.00%';
  return ((value / total) * 100).toFixed(2) + '%';
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Campaigns</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400 text-xs uppercase">Campaign</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase">Type</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase">Status</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase text-center">Progress</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase text-right">Total Leads</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase text-right">Contacted</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase text-right">Sent</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase text-right">Replies</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase text-right">Bounces</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase text-right">Interested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-slate-500 py-8">
                    No campaigns found
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">
                      <div>
                        <div className="text-blue-400 hover:underline cursor-pointer">{campaign.name}</div>
                        <div className="text-xs text-slate-500">Last updated {formatTimeAgo(campaign.updated_at)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 capitalize">
                        {campaign.type?.replace('_', ' ') || 'Outbound'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(campaign.status)}>
                        {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1) || 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${Math.min(campaign.completion_percentage || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{(campaign.completion_percentage || 0).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-slate-300">
                      {campaign.total_leads?.toLocaleString() || '—'}
                    </TableCell>
                    <TableCell className="text-right text-slate-300">
                      {campaign.total_leads_contacted?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell className="text-right text-slate-300">
                      {campaign.emails_sent?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-slate-300">{campaign.replied || 0}</span>
                        <span className="text-xs text-slate-500">{formatPercent(campaign.replied || 0, campaign.emails_sent || 0)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-slate-300">{campaign.bounced || 0}</span>
                        <span className="text-xs text-slate-500">{formatPercent(campaign.bounced || 0, campaign.emails_sent || 0)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-green-400 font-medium">{campaign.interested || 0}</span>
                        <span className="text-xs text-slate-500">{formatPercent(campaign.interested || 0, campaign.emails_sent || 0)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
