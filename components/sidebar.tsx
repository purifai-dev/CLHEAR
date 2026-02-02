"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Briefcase,
  AlertTriangle,
  Scale,
  Database,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
} from "lucide-react"

const navigationItems = [
  { id: 0, name: "Dashboard", icon: LayoutDashboard, color: "text-blue-400", path: "/dashboard", subItems: [] },
  {
    id: 1,
    name: "Company Profile",
    icon: Building2,
    color: "text-blue-400",
    path: "/dashboard/company-profile",
    subItems: [
      { name: "Legal Entities", path: "/dashboard/company-profile" },
      { name: "Licences", path: "/dashboard/company-profile/licenses" },
    ],
  },
  {
    id: 2,
    name: "Offering",
    icon: Briefcase,
    color: "text-cyan-400",
    path: "/dashboard/business-activities/products-services",
    subItems: [
      { name: "Products & Services", path: "/dashboard/business-activities/products-services" },
    ],
  },
  {
    id: 3,
    name: "Obligations & Risk",
    icon: AlertTriangle,
    color: "text-yellow-400",
    path: "/dashboard/obligations",
    subItems: [],
  },
  {
    id: 4,
    name: "Governance",
    icon: Scale,
    color: "text-purple-400",
    path: "/dashboard/governance",
    subItems: [
      { name: "Boards & Committees", path: "/dashboard/governance/boards-committees" },
      { name: "Roles & Responsibilities", path: "/dashboard/governance/roles-responsibilities" },
    ],
  },
  {
    id: 5,
    name: "RegTech & Data",
    icon: Database,
    color: "text-green-400",
    path: "/dashboard/regtech",
    subItems: [],
  },
  {
    id: 6,
    name: "Standard Operating Procedures",
    icon: FileText,
    color: "text-orange-400",
    path: "/dashboard/sops",
    subItems: [],
  },
  {
    id: 7,
    name: "Assurance & Remediation",
    icon: CheckCircle2,
    color: "text-pink-400",
    path: "/dashboard/assurance",
    subItems: [],
  },
  {
    id: 8,
    name: "Glossary",
    icon: BookOpen,
    color: "text-teal-400",
    path: "/dashboard/glossary",
    subItems: [],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState(() => {
    const current = navigationItems.find(
      (item) => item.path === pathname || item.subItems.some((sub) => sub.path === pathname),
    )
    return current ? current.id : 0
  })
  const [expandedItem, setExpandedItem] = useState<number | null>(() => {
    const current = navigationItems.find((item) => item.subItems.some((sub) => sub.path === pathname))
    return current ? current.id : null
  })

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    setActiveItem(item.id)
    if (item.subItems.length > 0) {
      setExpandedItem(expandedItem === item.id ? null : item.id)
    }
    router.push(item.path)
  }

  const handleSubNavigation = (path: string, parentId: number) => {
    setActiveItem(parentId)
    router.push(path)
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">CLHEAR</h1>
            <p className="text-xs text-muted-foreground">Compliance Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            const isExpanded = expandedItem === item.id

            return (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-auto py-2.5 px-3 text-sm font-medium",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                  onClick={() => handleNavigation(item)}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", item.color)} />
                  <span className="flex-1 text-left truncate">{item.name}</span>
                  {item.subItems.length > 0 && (
                    <>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      )}
                    </>
                  )}
                </Button>

                {isExpanded && item.subItems.length > 0 && (
                  <div className="ml-7 mt-1 space-y-0.5">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem.path}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-xs h-auto py-1.5 px-3",
                          pathname === subItem.path
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => handleSubNavigation(subItem.path, item.id)}
                      >
                        {subItem.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Last Sync:</span>
            <span className="text-success">2 min ago</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-success">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
