import { AuthForm } from "./components/AuthForm";
import { createClient } from "../../../utils/superbase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is already logged in, redirect them to the home page
  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <AuthForm />
    </div>
  );
}
