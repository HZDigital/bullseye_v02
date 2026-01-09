import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import type { DocLever } from "@/components/data/lever-data"

// TODO: This might need some more work

const kpisText = {
  implementation_timeline: {
    title: "Implementation Timeline",
    values: ["Short", "Medium", "Long"],
  },
  material_desc: {
    title: "Material Description",
    values: ["Product", "Project", "System", "Service"],
  },
  material_type: {
    title: "Type of Material",
    values: ["Direct", "Indirect"],
  },
  details: {
    title: "Details",
    values: ["Catalogue", "Standard", "Customized", "Raw Material"],
  },
  supplier_type: {
    title: "Number of Suppliers",
    values: ["Monopoly", "Oligopoly", "Polypoly"],
  },
  supplier_power: {
    title: "Supplier Power",
    values: ["Low", "Medium", "High"],
  },
  price_trend: {
    title: "Current Category Price Trend",
    values: ["Rising", "Stable", "Declining"],
  },
  supply_chain: {
    title: "Supply Chain Complexity",
    values: [
      "High added value at Tier-1",
      "Moderate finishing depths in SC (Tier-1-N)",
      "Complex finishing depths in SC (Tier-N)",
    ],
  },
  geo_sourcing: {
    title: "Geographic Sourcing Strategy",
    values: ["Local", "Regional", "Global"],
  },
  lead_time: {
    title: "Lead Time",
    values: ["Low / <6 Months", "Medium / <1 year", "High / >1 year"],
  },
  esg: {
    title: "ESG",
    values: ["Environmental", "Social", "Governance"],
  },
}

export default function KPIsView({ lever }: { lever: DocLever }) {
  const { getCurrentFilters } = useBullseyeStore()
  const filters = getCurrentFilters()

  const [scrollHeight, setScrollHeight] = useState("60vh")

  // Set scroll height based on screen size
  useEffect(() => {
    const updateScrollHeight = () => {
      if (window.innerHeight < 600) {
        setScrollHeight("40vh")
      } else if (window.innerHeight < 800) {
        setScrollHeight("50vh")
      } else {
        setScrollHeight("60vh")
      }
    }

    updateScrollHeight()
    window.addEventListener("resize", updateScrollHeight)
    return () => window.removeEventListener("resize", updateScrollHeight)
  }, [])

  // Helper function to check if a value is selected in the current filters
  const isValueSelected = (key: keyof typeof kpisText, index: number): boolean => {
    if (!filters) return false

    // Map store filter keys to lever property keys
    const filterKeyMap: Record<keyof DocLever, keyof typeof filters | null> = {
      implementation_timeline: "implementationTime",
      material_desc: "materialDescription",
      material_type: "typeOfMaterial",
      details: "details",
      supplier_type: "numberOfSuppliers",
      supplier_power: "supplierPower",
      price_trend: "commodityPriceTrend",
      supply_chain: "supplyChainComplexity",
      geo_sourcing: "geographicSourcingStrategy",
      lead_time: "leadTime",
      esg: "esg",
      // Add null for other properties that don't have corresponding filters
      id: null,
      categories: null,
      section: null,
      dimension: null,
      title: null,
      definition: null,
      example: null,
      measures_tools_activities: null,
      impact_potential: null,
      approach: null,
      kpis: null,
      pdfPage: null,
    }

    const filterKey = filterKeyMap[key]
    if (!filterKey) return false

    const filterValue = filters[filterKey]

    // Handle multi-select filters (string arrays in the store)
    if (Array.isArray(filterValue) && filterValue.length > 0) {
      return filterValue.includes(kpisText[key].values[index])
    }

    // Handle single-select filters (string values in the store)
    if (typeof filterValue === "string") {
      return filterValue === kpisText[key].values[index]
    }

    return false
  }

  // Helper function to check if a single-select filter is active
  const isSingleSelectFilterActive = (key: keyof typeof kpisText): boolean => {
    if (!filters) return false

    const filterKeyMap: Record<keyof DocLever, keyof typeof filters | null> = {
      implementation_timeline: "implementationTime",
      material_desc: "materialDescription",
      material_type: "typeOfMaterial",
      details: "details",
      supplier_type: "numberOfSuppliers",
      supplier_power: "supplierPower",
      price_trend: "commodityPriceTrend",
      supply_chain: "supplyChainComplexity",
      geo_sourcing: "geographicSourcingStrategy",
      lead_time: "leadTime",
      esg: "esg",
      // Add null for other properties that don't have corresponding filters
      id: null,
      categories: null,
      section: null,
      dimension: null,
      title: null,
      definition: null,
      example: null,
      measures_tools_activities: null,
      impact_potential: null,
      approach: null,
      kpis: null,
      pdfPage: null,
    }

    const filterKey = filterKeyMap[key]
    if (!filterKey) return false

    const filterValue = filters[filterKey]
    return typeof filterValue === "string" && filterValue !== ""
  }

  // Get all KPI keys in the order they appear in kpisText
  const kpiKeys = Object.keys(kpisText) as Array<keyof typeof kpisText>

  return (
    <div className="space-y-4">
      {/* Legend - outside scroll area */}
      <div className="flex flex-wrap gap-2 items-center text-xs">
        <span>Legend:</span>
        <Badge variant="default" className="bg-muted hover:bg-muted text-foreground text-xs">
          Lever doesn't have value
        </Badge>
        <Badge variant="outline" className="border-primary bg-muted text-xs">
          Lever has value
        </Badge>
        <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
          Filter matches
        </Badge>
      </div>

      {/* Scrollable KPI list */}
      <div className="overflow-y-auto p-1" style={{ maxHeight: scrollHeight }}>
        <div className="grid gap-4">
          {kpiKeys.map((key) => {
            if (!lever[key] || !kpisText[key]) return null

            // Check if this is a boolean[] (multi-select) or number[] (single-select)
            const isBooleanArray =
              Array.isArray(lever[key]) && (typeof lever[key][0] === "boolean" || lever[key][0] === undefined)

            if (isBooleanArray) {
              // Handle boolean arrays (multi-select) - showing all values
              const kpiValues = lever[key] as boolean[]

              return (
                <div key={key} className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">{kpisText[key].title}</div>
                  <div className="flex flex-wrap gap-1">
                    {kpisText[key].values.map((value, index) => {
                      const isSelected = kpiValues[index] === true
                      const isFilterMatch = isValueSelected(key, index)

                      return (
                        <Badge
                          key={index}
                          variant={isFilterMatch ? "default" : "outline"}
                          className={cn(
                            isSelected ? "border-primary" : "border-muted",
                            isFilterMatch ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted",
                            "text-xs",
                          )}
                        >
                          {value}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )
            } else {
              // Handle number arrays (single-select)
              const numberValues = lever[key] as number[]

              // Find the index with the highest value (the selected option)
              let selectedIndex = -1
              let maxValue = -1

              for (let i = 0; i < numberValues.length; i++) {
                if (numberValues[i] > maxValue) {
                  maxValue = numberValues[i]
                  selectedIndex = i
                }
              }

              if (selectedIndex === -1) return null

              // Check if a filter is active for this single-select KPI
              const filterActive = isSingleSelectFilterActive(key)

              return (
                <div key={key} className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">{kpisText[key].title}</div>
                  <div className="flex flex-wrap gap-1">
                    {filterActive ? (
                      // If filter is active, only show the selected value with its weight
                      <>
                        <Badge variant="outline" className={cn("border-primary bg-muted text-xs")}>
                          {kpisText[key].values[selectedIndex]} ({numberValues[selectedIndex]})
                        </Badge>
                        {kpisText[key].values.map((value, index) => {
                          const isFilterMatch = isValueSelected(key, index)
                          if (isFilterMatch) {
                            return (
                              <Badge
                                key={index}
                                variant="default"
                                className="bg-primary text-primary-foreground text-xs"
                              >
                                {value} ({numberValues[index]})
                              </Badge>
                            )
                          }
                          return null
                        })}
                      </>
                    ) : (
                      // If no filter is active, show all values
                      kpisText[key].values.map((value, index) => {
                        const isFilterMatch = isValueSelected(key, index)
                        const weight = numberValues[index]

                        return (
                          <Badge
                            key={index}
                            variant={isFilterMatch ? "default" : "outline"}
                            className={cn(
                              isFilterMatch
                                ? "bg-primary text-primary-foreground"
                                : "border border-foreground bg-muted hover:bg-muted",
                              "text-xs",
                            )}
                          >
                            {value} ({weight})
                          </Badge>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}