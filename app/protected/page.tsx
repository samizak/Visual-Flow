import { createClient } from "@/utils/superbase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p>Welcome, {session.user.email}!</p>
      <p>This page is only visible to authenticated users.</p>
    </div>
  );
}
