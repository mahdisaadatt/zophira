import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface NavDropdownProps {
  trigger: React.ReactNode
  items: {
    label: string
    href: string
    icon: LucideIcon
  }[]
}

export function NavDropdown({ trigger, items }: NavDropdownProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const router = useRouter()

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {trigger}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-md bg-background/95 backdrop-blur-sm border border-border/40 shadow-lg"
          >
            <div className="py-1">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      setIsHovered(false)
                      router.push(item.href)
                    }}
                  >
                    <Icon className="ml-2 w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
