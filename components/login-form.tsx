"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock authentication - accept any credentials
    setTimeout(() => {
      localStorage.setItem(
        "clhear_user",
        JSON.stringify({
          name: "Sarah Chen",
          role: "Chief Compliance Officer",
          email: email || "sarah.chen@example.com",
        }),
      )
      router.push("/dashboard")
    }, 800)
  }

  return (
    <Card className="w-full max-w-md border-border">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">CLHEAR</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Compliance & Risk Management Platform
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="cco@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in as CCO"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">Demo: Use any credentials to login</p>
        </form>
      </CardContent>
    </Card>
  )
}
