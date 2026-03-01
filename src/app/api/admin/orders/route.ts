import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL } from "@/lib/constants";

// Server-side Supabase client with service role to bypass RLS
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceKey) {
    return createClient(url, serviceKey);
  }

  // Fallback: use anon key (will be subject to RLS)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anonKey);
}

// Verify the requesting user is the admin
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, anonKey);

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user?.email === ADMIN_EMAIL;
}

// GET — fetch all orders
export async function GET(request: NextRequest) {
  const isAdminUser = await verifyAdmin(request);
  if (!isAdminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const adminSupabase = getAdminSupabase();

  const { data, error } = await adminSupabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        *,
        product:products(id, name, slug, image_url, image_emoji)
      ),
      payment:payments(*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}

// PATCH — update order status
export async function PATCH(request: NextRequest) {
  const isAdminUser = await verifyAdmin(request);
  if (!isAdminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { orderId, status } = body;

  if (!orderId || !status) {
    return NextResponse.json(
      { error: "orderId and status are required" },
      { status: 400 },
    );
  }

  const adminSupabase = getAdminSupabase();

  const { error } = await adminSupabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
