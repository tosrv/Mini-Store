"use client";

import { CardContent } from "@/components/dashboard/card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const [form, setForm] = useState<User>({
    id: user?.id ?? "",
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });

  const inputs: { name: keyof User; label: string; type: string }[] = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!user?.id) {
      console.log("User ID not found");
      return;
    }
    const userId = user.id;
    const payload = {
      ...form,
    };

    const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
    setUser(payload);
    
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  const requirement = !form.name || !form.email || !form.phone || !form.address;

  return (
    <div className="flex justify-center items-center p-4 my-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            Manage your profile information. These details will be used for
            transaction and payment data.
          </CardDescription>
        </CardHeader>

        <CardContent className="border-none">
          <form onSubmit={handleSubmit} className="space-y-3">
            {inputs.map((input) => (
              <div key={input.name} className="space-y-1">
                <Label htmlFor={input.name}>{input.label}</Label>

                <Input
                  id={input.name}
                  type={input.type}
                  value={form[input.name]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [input.name]: e.target.value,
                    }))
                  }
                  required
                  className="h-12 shadow-none rounded-full"
                />
              </div>
            ))}

            <div className="space-y-1">
              <Label htmlFor="description">Address</Label>
              <Textarea
                spellCheck={false}
                id="description"
                rows={4}
                className="resize-none overflow-auto shadow-none"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => router.push("/")}
                variant="outline"
                className="shadow-none"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={requirement}>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
