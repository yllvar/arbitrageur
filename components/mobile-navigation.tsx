"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, X, TrendingUp, Activity, Wallet, BarChart3, Zap } from "lucide-react"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  opportunityCount: number
}

export function MobileNavigation({ activeTab, onTabChange, opportunityCount }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: "monitor", label: "Monitor", icon: TrendingUp, badge: null },
    { id: "realtime", label: "Live Feed", icon: Activity, badge: opportunityCount > 0 ? opportunityCount : null },
    { id: "contract", label: "Contract", icon: Wallet, badge: null },
    { id: "trade", label: "Execute", icon: Zap, badge: null },
    { id: "analytics", label: "Analytics", icon: BarChart3, badge: null },
  ]

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 relative ${
                activeTab === item.id ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}

          {/* More Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center space-y-1 text-gray-600">
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Navigation</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id)}
                      className={`flex items-center space-x-3 p-4 rounded-lg border ${
                        activeTab === item.id
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && <Badge className="ml-auto bg-red-500 text-white">{item.badge}</Badge>}
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Top Navigation */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 md:hidden">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-blue-600">BSC Arbitrage</h1>
            <p className="text-xs text-gray-600">Professional Trading</p>
          </div>
          {opportunityCount > 0 && (
            <Badge className="bg-green-500 text-white animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              {opportunityCount} Opportunities
            </Badge>
          )}
        </div>
      </div>
    </>
  )
}
