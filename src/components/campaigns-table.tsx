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
        <CardTitle className="text-lg text-white">Active Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="text-slate-400">Campaign</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400 text-right">Sent</TableHead>
              <TableHead className="text-slate-400 text-right">Opened</TableHead>
              <TableHead className="text-slate-400 text-right">Replied</TableHead>
              <TableHead className="text-slate-400 text-right">Interested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-medium text-white">
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    {campaign.statistics?.sent?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    {campaign.statistics?.opened?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    {campaign.statistics?.replied?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right text-green-400 font-medium">
                    {campaign.statistics?.interested?.toLocaleString() || '0'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
