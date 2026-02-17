'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getLiveStats } from '@/app/actions/stats'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function UsageMiniStats() {
  const [stats, setStats] = useState({ cpu: 0, ram: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getLiveStats()
      if (data && data.length > 0) {
        setStats({
          cpu: data[0].cpu_percent,
          ram: data[0].ram_percent
        })
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-xs tracking-tighter">
          <span className="text-muted-foreground uppercase font-semibold">CPU</span>
          <span className={cn("font-bold", stats.cpu > 85 ? "text-red-500" : "text-primary")}>
            {stats.cpu}%
          </span>
        </div>
        <Progress value={stats.cpu} className="h-1" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs tracking-tighter">
          <span className="text-muted-foreground uppercase font-semibold">Memory</span>
          <span className={cn("font-bold", stats.ram > 85 ? "text-red-500" : "text-primary")}>
            {stats.ram}%
          </span>
        </div>
        <Progress value={stats.ram} className="h-1" />
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'fa-chart-line' },
    { name: 'Projects', path: '/projects', icon: 'fa-network-wired' },
    { name: 'Deployments', path: '/deployments', icon: 'fa-rocket' },
    { name: 'Maintenance', path: '/maintenance', icon: 'fa-screwdriver-wrench' },
    { name: 'Cloudflare', path: '/cloudflare', icon: 'fa-cloud' },
    { name: 'Settings', path: '/settings', icon: 'fa-cogs' },
  ]

  return (
    <nav className="h-full bg-card flex flex-col py-6 px-3">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Button
              key={item.path}
              asChild
              variant="ghost"
              className={cn(
                "justify-start gap-3 h-9 px-3 transition-colors duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground font-semibold" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Link href={item.path}>
                <i className={`fa-solid ${item.icon} w-4 text-center`}></i>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </Button>
          )
        })}
      </div>
      
      <div className="mt-auto pt-6">
        <div className="bg-secondary border border-border p-4 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System Resources
          </div>
          
          <UsageMiniStats />

          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <i className="fa-solid fa-wifi text-xs"></i> Live
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}