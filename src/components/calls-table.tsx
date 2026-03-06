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
import type { CallActivity } from "@/lib/close";

interface CallsTableProps {
  calls: CallActivity[];
}

export function CallsTable({ calls }: CallsTableProps) {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDispositionColor = (disposition?: string) => {
    if (!disposition) return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    const lower = disposition.toLowerCase();
    if (lower.includes('meeting') || lower.includes('booked') || lower.includes('demo')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (lower.includes('interested') || lower.includes('callback')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    if (lower.includes('not interested') || lower.includes('no answer')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Recent Call Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="text-slate-400">Date</TableHead>
              <TableHead className="text-slate-400">Contact</TableHead>
              <TableHead className="text-slate-400">Direction</TableHead>
              <TableHead className="text-slate-400">Duration</TableHead>
              <TableHead className="text-slate-400">Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                  No calls found
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => (
                <TableRow key={call.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-slate-300">
                    {formatDate(call.date_created)}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {call.contact_name || call.lead_name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      call.direction === 'outbound' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    }>
                      {call.direction}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {formatDuration(call.duration)}
                  </TableCell>
                  <TableCell>
                    {call.disposition && (
                      <Badge variant="outline" className={getDispositionColor(call.disposition)}>
                        {call.disposition}
                      </Badge>
                    )}
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
