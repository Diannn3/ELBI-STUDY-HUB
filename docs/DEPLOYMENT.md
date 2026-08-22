# Deployment

## Cloudflare Pages

Build settings:

- Framework preset: Vite
- Build command: `npm run build`
- Build output: `dist`
- Node: 22
- Environment variables (optional until cloud sign-in is enabled):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

`public/_headers` adds a small security baseline. Vite-PWA generates the service worker and manifest during production build.

## Supabase

1. Install the Supabase CLI and Docker.
2. `supabase start`
3. `supabase db reset`
4. Run `supabase/tests/rls_policy_audit.sql` against the local instance.
5. Link a remote project only after the local migration and policies are verified.
6. Never ship a service-role key to the browser. Only the anon/publishable client key belongs in Vite environment variables.

## Preview without npm

The `preview/` directory is a dependency-free verification harness using the same interaction model and pixel assets. It is useful when package installation is unavailable:

```bash
python3 -m http.server 4174 -d preview
```

Then open `http://127.0.0.1:4174/`.
