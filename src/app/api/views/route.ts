import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("site_views")
      .select("total_count")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return NextResponse.json({ count: data.total_count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const supabase = getAdminClient();

    // Increment using rpc or raw update
    const { data: current } = await supabase
      .from("site_views")
      .select("total_count")
      .eq("id", 1)
      .single();

    const newCount = (current?.total_count ?? 0) + 1;

    const { error } = await supabase
      .from("site_views")
      .update({ total_count: newCount })
      .eq("id", 1);

    if (error) throw error;
    return NextResponse.json({ count: newCount });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
