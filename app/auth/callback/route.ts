// Change from @/utils/superbase/server to relative path
import { createClient } from "../../../utils/superbase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
      // Redirect to login with error
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`);
    }
    
    // Check if this is a signup or signin
    const next = requestUrl.searchParams.get("next") || "/";
    
    // Get the user to check if they have a profile
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if user has a profile in the database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // If no profile exists, create one
      if (!profile) {
        await supabase.from('profiles').insert([
          {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString()
          }
        ]);
      }
    }
    
    // Redirect to the next URL or home page
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
