import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isRealSupabase =
    !!supabaseUrl &&
    !!supabaseKey &&
    !supabaseUrl.includes("your-project.supabase.co") &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseUrl.includes("example.com");

  const demoRole = request.cookies.get("civicpulse_role")?.value as "citizen" | "government" | undefined;
  const { pathname } = request.nextUrl;

  const citizenProtected = ["/profile"];
  const govProtected = ["/gov-dashboard"];
  const authRoutes = ["/login", "/signup", "/gov-login", "/gov-signup"];

  // If running in demo mode or without real Supabase connection
  if (!isRealSupabase) {
    if (demoRole) {
      if (govProtected.some((p) => pathname.startsWith(p)) && demoRole !== "government") {
        return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
      }
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(demoRole === "government" ? "/gov-dashboard" : "/map", request.url));
      }
      return supabaseResponse;
    }

    // Unauthenticated demo user
    if (govProtected.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/gov-login", request.url));
    }
    if (citizenProtected.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // Real Supabase is configured
  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  if (!user) {
    if (demoRole) {
      if (govProtected.some((p) => pathname.startsWith(p)) && demoRole !== "government") {
        return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
      }
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(demoRole === "government" ? "/gov-dashboard" : "/map", request.url));
      }
      return supabaseResponse;
    }

    if (govProtected.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/gov-login", request.url));
    }
    if (citizenProtected.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // User is authenticated — fetch their role from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as "citizen" | "government" | null;

  // Block citizens from gov-dashboard
  if (govProtected.some((p) => pathname.startsWith(p))) {
    if (role !== "government") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.includes(pathname)) {
    if (role === "government") {
      return NextResponse.redirect(new URL("/gov-dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/map", request.url));
  }

  return supabaseResponse;
}
