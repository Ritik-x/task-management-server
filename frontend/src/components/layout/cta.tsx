"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Cta() {
  const router = useRouter();

  return (
    <section id="cta" className="relative py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-blue-800 to-indigo-90" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/15 bg-white/10 px-6 py-12 text-center text-white shadow-2xl backdrop-blur sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to boost your productivity?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85 sm:text-lg">
            Start managing your tasks in minutes. Clean UI, fast workflow, and a
            dashboard that keeps you focused.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() => router.push("/auth/login")}
            >
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
              onClick={() => router.push("/auth/signup")}
            >
              Create account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
