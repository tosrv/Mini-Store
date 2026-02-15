"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Loading from "@/components/layout/Loading";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      router.push("/");
    };

    handleAuth();
  }, [router, supabase]);

  return <Loading />;
}
