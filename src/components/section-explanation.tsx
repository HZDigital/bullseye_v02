import { motion } from "framer-motion"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import MatchIndicator from "./section/match-indicator"
import { glossary } from "./data/documents-glossary"
import { LEVER_DATA } from "./data/lever-data" // Make sure to import the lever data

interface ExplanationProps {
  section: string
  color: string
}

const clusters = [
  {
    term: "Specification",
    sub: ["Cost Value Engineering", "Innovation"],
  },
  {
    term: "Sourcing",
    sub: ["Value Chain and Sourcing", "Negotiations"],
  },
  {
    term: "Demand",
    sub: ["Demand Management", "Forecasting and Planning"],
  },
  {
    term: "Execution",
    sub: ["Financeand Supply Chain Processes", "ESG"],
  },
]

export function Explanation({ section, color }: ExplanationProps) {
  const {
    getAreExplanationsVisible,
    visibleCategories,
    initialAnimationComplete,
    isOuterVisible,
    getCurrentSelectedCategories,
    calculateLeverWeight,
  } = useBullseyeStore()

  // Get the current selected categories
  const selectedCategories = getCurrentSelectedCategories()

  // During initial animation, each explanation appears when its category becomes visible
  // After animation, all explanations are visible only if areExplanationsVisible is true
  let isVisible = false

  if (initialAnimationComplete) {
    // After animation is complete, follow the global visibility rule
    isVisible = getAreExplanationsVisible()

    // But also check if this specific category is selected (if any are selected)
    if (selectedCategories.length > 0 && !selectedCategories.includes(section)) {
      isVisible = false
    }
  } else {
    // During initial animation, each explanation appears with its container segment
    isVisible = visibleCategories.includes(section)
  }

  // Always respect the outer visibility (center button)
  if (!isOuterVisible) {
    isVisible = false
  }

  const getSectionDefinition = () => {
    // Find the matching definition in the optimization_area
    const area = glossary.optimization_area.sub.find((item) => item.term === section)

    if (area) {
      return area.definition
    }

    // Fallback to other glossary sections if needed
    return "Definition not found for this section."
  }

  const recommendedThreshold = 45 * 0.7 // Adjust this threshold as needed

  // Calculate percentage of recommended levers for a section or dimension
  const calculateRecommendedPercentage = (sectionName: string, dimensionName?: string) => {
    // Filter levers by section
    const sectionLevers = LEVER_DATA.filter((lever) => lever.section === sectionName)

    // If dimension is provided, further filter by dimension
    const relevantLevers = dimensionName
      ? sectionLevers.filter((lever) => lever.dimension === dimensionName)
      : sectionLevers

    if (relevantLevers.length === 0) return 0

    const recommendedLevers = relevantLevers.filter((lever) => {
      const weight = calculateLeverWeight(lever)
      return weight >= recommendedThreshold
    })

    // Calculate percentage
    return Math.round((recommendedLevers.length / relevantLevers.length) * 100)
  }

  const showMatchIndicators = LEVER_DATA.some(
    (lever) => calculateLeverWeight(lever) >= recommendedThreshold,
  )

  // Animation variants
  const variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  // Calculate the overall percentage for the section
  const sectionPercentage = calculateRecommendedPercentage(section)

  return (
    <motion.div
      className="h-1/2 flex flex-col py-16"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="-mt-2 w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
        <h2 className="text-base font-medium">{section}</h2>
      </div>
      <div className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{getSectionDefinition()}</p>
      </div>
      {showMatchIndicators && (
        <>
          <div className="p-2 px-3.5">
            <h1 className="text-sm font-semibold text-foreground">% Recommended filters:</h1>
            <MatchIndicator color={color} percent={sectionPercentage} />
          </div>
          <div className="grid grid-cols-2 gap-2 p-2 px-3.5">
            {clusters
              .find((cluster) => cluster.term === section)
              ?.sub.map((subItem, index) => {
                // Calculate percentage for each dimension
                const dimensionPercentage = calculateRecommendedPercentage(section, subItem)

                return (
                  <div key={index} className="flex flex-col justify-end">
                    <h1 className="text-sm font-semibold text-foreground">{subItem}</h1>
                    <MatchIndicator color={color} percent={dimensionPercentage} />
                  </div>
                )
              })}
          </div>
        </>
      )}
    </motion.div>
  )
}