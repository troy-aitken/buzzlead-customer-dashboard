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
import type { Sequence } from "@/lib/close";

interface SequencesTableProps {
  sequences: Sequence[];
}

export function SequencesTable({ sequences }: SequencesTableProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Active Sequences</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="text-slate-400">Sequence</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400 text-right">Active</TableHead>
              <TableHead className="text-slate-400 text-right">Paused</TableHead>
              <TableHead className="text-slate-400 text-right">Finished</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sequences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                  No sequences found
                </TableCell>
              </TableRow>
            ) : (
              sequences.map((sequence) => (
                <TableRow key={sequence.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-medium text-white">
                    {sequence.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(sequence.status)}>
                      {sequence.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-green-400 font-medium">
                    {sequence.subscriptions_active || 0}
                  </TableCell>
                  <TableCell className="text-right text-yellow-400">
                    {sequence.subscriptions_paused || 0}
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    {sequence.subscriptions_finished || 0}
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
