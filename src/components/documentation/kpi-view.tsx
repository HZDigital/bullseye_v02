import { Check, Leaf, HandCoins, Shield } from "lucide-react"

interface KPICategories {
  value_creation: boolean[]
  sustainability: boolean[]
  resilience: boolean[]
}

interface KPIViewProps {
  kpis: KPICategories
}

export default function KPIView({ kpis }: KPIViewProps) {
  const categories = Object.keys(kpis) as Array<keyof KPICategories>

  // Define KPI titles for each category
  const kpiTitles = {
    value_creation: ["PPC", "MCP", "VAM", "CTG", "ANR"],
    sustainability: ["CO2", "Circularity rating", "CoC adherence", "Supplier risk score"],
    resilience: ["OTIF", "AVG Lead Time", "Safety Stock", "% single-source supplier"],
  }

  const categoryConfig = {
    value_creation: {
      Icon: HandCoins,
      label: "Value Creation",
    },
    sustainability: {
      Icon: Leaf,
      label: "Sustainability",
    },
    resilience: {
      Icon: Shield,
      label: "Resilience",
    },
  }

  const getIcon = (category: keyof KPICategories) => {
    const config = categoryConfig[category]
    if (!config) return null

    const { Icon } = config
    return (
      Icon && (
        <span className="text-muted-foreground">
          <Icon className="h-4 w-4 -mt-1.5" />
        </span>
      )
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <div key={index} className="space-y-1">
          <div className="flex gap-2 items-center">
            {getIcon(category)}
            <h3 className="font-medium capitalize text-sm">
              {categoryConfig[category]?.label || category.replace("_", " ")}
            </h3>
          </div>
          {kpis[category].map((isChecked, kpiIndex) => {
            // Get the corresponding title for this KPI
            const title = kpiTitles[category][kpiIndex] || `KPI ${kpiIndex + 1}`

            return (
              <div key={kpiIndex} className="flex gap-2 items-start">
                <div
                  className={`${isChecked ? "bg-foreground text-background" : ""} mt-1 shrink-0 rounded-sm border border-border w-4 h-4 flex justify-center items-center`}
                >
                  {isChecked && <Check className="w-3 h-3" />}
                </div>
                <span className="text-sm">{title}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}