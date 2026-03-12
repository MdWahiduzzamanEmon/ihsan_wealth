import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use createClient with service role key to properly bypass RLS.
// createServerClient from @supabase/ssr is for cookie-based user auth
// and does not reliably bypass RLS even with the service role key.
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[views] SUPABASE_SERVICE_ROLE_KEY is not set");
      return NextResponse.json({ count: 0 });
    }
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("site_views")
      .select("total_count")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return NextResponse.json({ count: data.total_count });
  } catch (err) {
    console.error("[views] GET failed:", err);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[views] SUPABASE_SERVICE_ROLE_KEY is not set");
      return NextResponse.json({ count: 0 });
    }
    const supabase = getAdminClient();

    // Atomic increment using rpc to avoid race conditions with concurrent visitors
    const { data, error } = await supabase.rpc("increment_site_views");

    if (!error && data != null) {
      return NextResponse.json({ count: data });
    }

    // Fallback: manual select + update if rpc doesn't exist yet
    const { data: current } = await supabase
      .from("site_views")
      .select("total_count")
      .eq("id", 1)
      .single();

    const newCount = (current?.total_count ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("site_views")
      .update({ total_count: newCount })
      .eq("id", 1);

    if (updateError) throw updateError;
    return NextResponse.json({ count: newCount });
  } catch (err) {
    console.error("[views] POST failed:", err);
    return NextResponse.json({ count: 0 });
  }
}
