import Link from 'next/link';
import { getClientConfigs } from "@/lib/airtable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2 } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

export default async function HomePage() {
  const clients = await getClientConfigs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Client Dashboards</h1>
        <p className="text-slate-400 mt-1">Select a client to view their performance metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <Link key={client.id} href={`/${client.slug}`}>
            <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">/{client.slug}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="bg-green-500/10 border-green-500/30 text-green-400 text-xs"
                  >
                    {client.status}
                  </Badge>
                  {client.bisonBaseUrl?.includes('personal') && (
                    <Badge 
                      variant="outline" 
                      className="bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs"
                    >
                      Personal
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {clients.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400">No active clients found</p>
            <p className="text-sm text-slate-500 mt-2">
              Add clients with Email Bison API keys in Airtable
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
