import { NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  const url = new URL("/login?msg=saiu", req.url);
  return NextResponse.redirect(url);
}
