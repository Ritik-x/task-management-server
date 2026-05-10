import { CheckCircle, Clock, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Background from "@/components/layout/background"

const features = [
  {
    icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
    title: "Task Organization",
    description: "Easily create, categorize, and prioritize your tasks for maximum efficiency.",
  },
  {
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    title: "Time Tracking",
    description: "Monitor time spent on tasks to improve productivity and project management.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-500" />,
    title: "Team Collaboration",
    description: "Share tasks and collaborate with your team in real-time for seamless workflow.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: "Automation",
    description: "Set up automated workflows to reduce manual work and increase productivity.",
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-16 sm:py-20">
      <Background className="opacity-70" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay on track
            </h2>
            <p className="mt-3 text-muted-foreground sm:text-lg">
              Built for students, teams, and anyone who wants a calmer workflow.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border bg-background/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-600/20 to-sky-500/10 blur-2xl transition-opacity group-hover:opacity-90" />
              <CardHeader className="space-y-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-background shadow-sm">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}

