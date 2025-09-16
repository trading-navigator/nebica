import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(
        requestUrl.origin +
          `/login?message=${encodeURIComponent(error.message)}`
      )
    }

    // Get current session
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (session) {
      // Look up home workspace
      const { data: homeWorkspace } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_home", true)
        .single()

      if (homeWorkspace) {
        return NextResponse.redirect(
          `${requestUrl.origin}/${homeWorkspace.id}/chat`
        )
      }

      // If no home workspace, send to setup
      return NextResponse.redirect(`${requestUrl.origin}/setup`)
    }
  }

  // Fallback: if no session or code
  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  }

  return NextResponse.redirect(requestUrl.origin)
}
