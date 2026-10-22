# Project architecture rules

- Render the shared mobile bottom navigation from `Navbar` so all standard pages keep one consistent primary navigation; property detail pages omit it because they have a booking bar.
- MCP server tools are authored in `src/lib/mcp/` (one `defineTool` per file, registered in `src/lib/mcp/index.ts`); `supabase/functions/mcp/index.ts` is SDK-generated — never hand-edit it. OAuth consent lives at `src/pages/OAuthConsent.tsx` with return-path validation in `src/lib/oauth-return-path.ts`.
