import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // IMPORTANT: do not add any logic between createServerClient and
  // supabase.auth.getUser() — it will break session refreshing.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const citizenProtected = ["/profile"];
  const govProtected = ["/gov-dashboard"];
  const authRoutes = ["/login", "/signup", "/gov-login", "/gov-signup"];

  // Redirect unauthenticated users away from protected routes
  if (!user) {
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
