import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import { sectionDimensionData } from "@/components/data/section-dimension-data"

interface SubcategoryExplanationProps {
  subcategoryTitle: string
  color: string
}

export function DimensionExplanation({ subcategoryTitle, color }: SubcategoryExplanationProps) {
  const { isOuterVisible, selectedDimension } = useBullseyeStore()

  // Only visible if outer segments are visible
  const isVisible = isOuterVisible

  // Get the dimension data from the selected dimension
  const dimensionData = selectedDimension
    ? sectionDimensionData
        .find((section) => section.title === selectedDimension.section)
        ?.dimensions.find((dim) => dim.title === selectedDimension.dimension)
    : null

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
      className="h-full flex flex-col pt-16"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      style={{ height: "100%" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3 p-4">
          <div className="-mt-2 w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
          <h2 className="text-base font-medium">{subcategoryTitle}</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-4 p-4 pt-0">
              {dimensionData && dimensionData.description && (
                <ul className="space-y-2">
                  {dimensionData.description.map((desc, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  )
}