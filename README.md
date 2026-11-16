# BeamLab

An interactive structural analysis learning tool. Adjust beam geometry and loads to see support reactions, shear force diagrams (SFD), bending moment diagrams (BMD), and equilibrium calculations update live.

## Stack
- Next.js, React and TypeScript
- Vercel deployment
- Neon Postgres for saved beam analyses
- GitHub source control

## First build
- Simply supported beam (pin at A, roller at B)
- Span: 2–12 m
- Single downward point load: 0–40 kN, movable along the span
- Full-span uniformly distributed load: 0–10 kN/m
- Live reactions, SFD, BMD and calculation breakdown
- Optional saving of beam input sets to Neon

## Run locally
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open http://localhost:3000.

## Neon setup
1. Create a Neon project and copy its pooled connection string.
2. Run the SQL in `db/schema.sql` in the Neon SQL Editor.
3. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
4. Add the same `DATABASE_URL` to Vercel Project Settings → Environment Variables.

Calculations work without a database. Saving requires the Neon table and connection string.

## Vercel deployment
Import `Cosmo-9/Beamlab` into Vercel. Vercel detects Next.js automatically. Add `DATABASE_URL` after configuring Neon, then redeploy.

## Engineering scope
This is an educational visualization tool for idealized, statically loaded, simply supported beams. It is not a code-compliant structural design package and must not be the sole basis for real-world structural decisions.
