"use client";

import { FcGoogle } from "react-icons/fc";
import { createClient } from "@/lib/supabase/client";

type Provider = "google";

export default function OAuth() {
  const supabase = createClient();

  const handleOAuth = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) console.error(`${provider} login error:`, error.message);
  };

  return (
    <div>
      <section
        onClick={() => handleOAuth("google")}
        className="flex-1 h-12 text-xl flex items-center justify-center gap-2 border rounded-full hover:bg-gray-100/50 hover:cursor-pointer"
      >
        <FcGoogle className="w-7 h-7" />
        <span className="font-semibold dark:text-white">Google</span>
      </section>
    </div>
  );
}
