# BuzzLead Customer Dashboard

A customer-facing performance dashboard for BuzzLead, tracking cold email and cold calling metrics.

## Features

- **Lead Generation Overview** - Combined view of email and calling performance
- **Cold Email Metrics** - Campaign stats, reply rates, bounce rates from EmailBison
- **Cold Calling Metrics** - Call activity, connect rates, meetings booked from Close CRM

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui components
- EmailBison API
- Close CRM API

## Environment Variables

Create a `.env.local` file with:

```
EMAILBISON_API_KEY=your_key_here
CLOSE_API_KEY=your_key_here
```

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel with automatic updates from the main branch.

## License

Private - BuzzLead Internal
