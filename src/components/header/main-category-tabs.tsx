import { Button } from "@/components/ui/button"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import { HandCoins, Leaf, Shield } from "lucide-react"

export default function MainCategoryTabs({ categories }: { categories: string[] }) {
  const { filterCategories, toggleFilterCategory } = useBullseyeStore()

  const categoryIcons = {
    "Value Creation": HandCoins,
    Sustainability: Leaf,
    Resilience: Shield,
  }

  return (
    <div className="flex gap-2">
      {categories.map((category) => {
        const isSelected = filterCategories.includes(category)

        const IconComponent = categoryIcons[category as keyof typeof categoryIcons]

        return (
          <Button
            key={category}
            onClick={() => toggleFilterCategory(category)}
            className={`
              p-0.5 text-foreground transition-all duration-200 w-36 hover:bg-foreground
              ${isSelected ? "bg-linear-to-tr from-head to-hand" : "bg-background border outline-border"}
            `}
          >
            <div className="w-full h-full bg-background text-foreground rounded-sm flex items-center justify-center px-3 gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span>{category}</span>
            </div>
          </Button>
        )
      })}
    </div>
  )
}