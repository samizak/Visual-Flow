import { AuthForm } from "./components/AuthForm";
import { createClient } from "@/utils/superbase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is already logged in, redirect them to the home page
  if (session) {
    redirect("/");
  }

  // Get the returnTo parameter from the URL or default to "/"
  // Use optional chaining and nullish coalescing to safely access the property
  const returnTo = searchParams?.returnTo ?? "/";

  // Convert to string if it's an array
  const returnToPath = Array.isArray(returnTo) ? returnTo[0] : returnTo;

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Link
        href={returnToPath}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 z-10 group"
      >
        <span className="bg-slate-100 dark:bg-slate-800 rounded-full p-2 transform group-hover:-translate-x-1 transition-transform duration-300">
          <ArrowLeft size={18} />
        </span>
        <span className="text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Back
        </span>
      </Link>
      <AuthForm />
    </div>
  );
}
