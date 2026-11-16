import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return NextResponse.json({ error: "Database is not configured. Add DATABASE_URL to your deployment environment." }, { status: 503 });
  try {
    const body = await request.json();
    const length = Number(body.length), pointLoad = Number(body.pointLoad), pointPosition = Number(body.pointPosition), udl = Number(body.udl);
    if (![length, pointLoad, pointPosition, udl].every(Number.isFinite) || length < 2 || length > 12 || pointLoad < 0 || pointLoad > 40 || pointPosition < 0 || pointPosition > length || udl < 0 || udl > 10) {
      return NextResponse.json({ error: "The beam inputs are outside the supported range." }, { status: 400 });
    }
    const sql = neon(connectionString);
    const result = await sql.query(
      "INSERT INTO beam_analyses (beam_length, point_load, point_position, udl, inputs) VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING id, created_at",
      [length, pointLoad, pointPosition, udl, JSON.stringify({ length, pointLoad, pointPosition, udl })]
    );
    return NextResponse.json({ analysis: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save. Confirm that the beam_analyses table exists in Neon." }, { status: 500 });
  }
}
