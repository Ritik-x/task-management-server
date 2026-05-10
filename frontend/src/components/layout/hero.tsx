"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import Background from "@/components/layout/background"

export default function Hero() {
  const router = useRouter()

  return (
    <section className="relative">
      <Background />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-10 pb-16 pt-20 md:pt-24 lg:grid-cols-2 lg:gap-14">
          <div className="text-center lg:text-left">
            <Badge className="mb-4 gap-2" variant="secondary">
              <Sparkles className="h-4 w-4" />
              Your productivity companion
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Organize tasks,
              <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                finish more work
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Plan, prioritize, and track progress in one place. TaskMaster keeps your day clear, focused, and on time.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" className="rounded-full" onClick={() => router.push("/auth/login")}>
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full bg-background/60"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                See features
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm lg:justify-start">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Quick task tracking
              </div>
              <div className="flex items-center justify-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm lg:justify-start">
                <Clock3 className="h-4 w-4 text-blue-600" />
                Time metrics
              </div>
              <div className="flex items-center justify-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm lg:justify-start">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Clean dashboard
              </div>
            </div>
          </div>

          {/* Mock preview */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-blue-600/15 via-sky-500/10 to-indigo-500/15 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border bg-background/70 shadow-xl">
              <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                <div className="ml-2 text-xs text-muted-foreground">Dashboard preview</div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-background p-4">
                    <div className="text-xs text-muted-foreground">Total tasks</div>
                    <div className="mt-2 text-2xl font-semibold">24</div>
                    <div className="mt-3 h-2 w-full rounded-full bg-muted" />
                  </div>
                  <div className="rounded-xl border bg-background p-4">
                    <div className="text-xs text-muted-foreground">Completed</div>
                    <div className="mt-2 text-2xl font-semibold">16</div>
                    <div className="mt-3 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[66%] rounded-full bg-gradient-to-r from-blue-600 to-sky-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Today</div>
                    <div className="text-xs text-muted-foreground">3 tasks due</div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <div className="h-3 w-2/3 rounded bg-muted" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-500" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-500" />
                      <div className="h-3 w-3/5 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

