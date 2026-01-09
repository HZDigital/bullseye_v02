import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import LeverCard from "./lever-card"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import { LEVER_DATA } from "@/components/data/lever-data"
import { useMemo } from "react"
import { getRelevantLevers } from "@/components/utils/lever-sort"

export function Levers() {
  const { selectedDimension, isOuterVisible, calculateLeverWeight, filterCategories, getCurrentKPIs } =
    useBullseyeStore()

  // Get current variant data
  const kpis = getCurrentKPIs()

  const isVisible = selectedDimension !== null && isOuterVisible

  const relevantLevers = useMemo(() => {
    return getRelevantLevers({
      levers: LEVER_DATA,
      selectedDimension,
      calculateLeverWeight,
      selectedCategories: filterCategories,
      kpis,
    })
  }, [selectedDimension, calculateLeverWeight, filterCategories, kpis])

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

  return (
    <motion.div
      className="h-full flex flex-col"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      style={{ height: "100%" }}
    >
      {selectedDimension && (
        <div className="flex-1 overflow-hidden">
          {relevantLevers.length > 0 ? (
            <ScrollArea className="h-full pr-2">
              <div className="p-4 pt-1 flex flex-col gap-4">
                {relevantLevers.map((lever) => (
                  <LeverCard lever={lever} key={lever.id} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col h-full items-center justify-center p-4">
              <p className="font-medium text-center">No levers match the current filters.</p>
              <p className="text-muted-foreground">Try adjusting your KPI selections.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}