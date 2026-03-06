const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = 'app3L9bziLQdm150H';
const AIRTABLE_TABLE_ID = 'tbls2ahDVjaQ1otR9';

export interface ClientConfig {
  id: string;
  name: string;
  slug: string;
  bisonApiKey: string | null;
  bisonBaseUrl: string | null;
  closeApiKey: string | null;
  status: string;
}

// Convert client name to URL-friendly slug
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getClientConfigs(): Promise<ClientConfig[]> {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?filterByFormula={Status}="Active"`,
    {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );

  if (!res.ok) {
    console.error('Airtable error:', res.status);
    return [];
  }

  interface AirtableRecord {
    id: string;
    fields: {
      'Client Name'?: string;
      'Bison API Key'?: string;
      'EmailBison Base URL'?: string;
      'Close API Key'?: string;
      'Status'?: string;
    };
  }
  
  const data = await res.json() as { records: AirtableRecord[] };
  
  return data.records
    .filter((record) => record.fields['Bison API Key']) // Must have API key
    .map((record) => ({
      id: record.id,
      name: record.fields['Client Name'] || 'Unknown',
      slug: slugify(record.fields['Client Name'] || 'unknown'),
      bisonApiKey: record.fields['Bison API Key'] || null,
      bisonBaseUrl: record.fields['EmailBison Base URL'] || 'https://send.buzzlead.io',
      closeApiKey: record.fields['Close API Key'] || null, // Add this field if needed
      status: record.fields['Status'] || 'Unknown',
    }));
}

export async function getClientBySlug(slug: string): Promise<ClientConfig | null> {
  const clients = await getClientConfigs();
  return clients.find(c => c.slug === slug) || null;
}

export async function getAllClientSlugs(): Promise<string[]> {
  const clients = await getClientConfigs();
  return clients.map(c => c.slug);
}
