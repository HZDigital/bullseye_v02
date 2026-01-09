import type React from "react"
import { HandCoins, Leaf, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface CategoryIconsProps {
  categories: string[]
  selectedCategories: string[]
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function CategoryIcons({
  categories,
  selectedCategories,
  size = "md",
  className = "",
}: CategoryIconsProps) {
  // Map of category names to their respective icons
  const categoryConfig: Record<string, { Icon: React.ElementType }> = {
    "Value Creation": {
      Icon: HandCoins,
    },
    Sustainability: {
      Icon: Leaf,
    },
    Resilience: {
      Icon: Shield,
    },
  }

  // Size mapping
  const sizeMap = {
    sm: {
      svgSize: 16,
      strokeWidth: 2,
    },
    md: {
      svgSize: 20,
      strokeWidth: 2,
    },
    lg: {
      svgSize: 24,
      strokeWidth: 2,
    },
  }

  const { svgSize, strokeWidth } = sizeMap[size]

  return (
    <div className={`flex gap-2 ${className}`}>
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category)
        // Check if the category exists in the config
        const config = categoryConfig[category]

        // If config doesn't exist, use a default icon and log a warning
        if (!config) {
          console.warn(`No icon configuration found for category: "${category}"`)
          return (
            <div key={category} className={isSelected ? "text-primary" : "text-muted-foreground/50"}>
              <HandCoins size={svgSize} strokeWidth={strokeWidth} />
            </div>
          )
        }

        const { Icon } = config

        return (
          <Tooltip>
            <TooltipTrigger>
              <div key={category} className={isSelected ? "text-primary" : "text-muted-foreground/50"}>
                <Icon size={svgSize} strokeWidth={strokeWidth} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2">
              <Icon className="w-4 h-4" /><span>{category}</span>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}