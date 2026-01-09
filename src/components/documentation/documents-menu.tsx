import { motion } from "framer-motion"
import type { DocLever } from "@/components/data/lever-data"
import DocumentsMenuItem from "./documents-menu-card"

interface DocumentsMenuProps {
  levers: DocLever[]
  filterCategories: string[]
  setLever?: (lever: DocLever) => void
}

export default function DocumentsMenu({ levers, filterCategories, setLever }: DocumentsMenuProps) {
  // Sort levers based on filterCategories match count
  const sortedLevers = filterCategories.length > 0
    ? levers
        .map((lever, index) => {
          const leverCategories = lever.categories || [];
          const matchCount = leverCategories.filter(category => 
            filterCategories.includes(category)
          ).length || 0;
          
          // Check if this lever has ONLY the categories from the filter (no other categories)
          const onlyFilteredCategories = matchCount === leverCategories.length && matchCount > 0;
          
          return { 
            lever, 
            index, 
            matchCount,
            onlyFilteredCategories
          };
        })
        .filter(item => 
          item.matchCount >= filterCategories.length
        )
        .sort((a, b) => {
          // First prioritize levers that only have categories from the filter
          if (a.onlyFilteredCategories && !b.onlyFilteredCategories) return -1;
          if (!a.onlyFilteredCategories && b.onlyFilteredCategories) return 1;
          
          // Then by match count
          if (a.matchCount !== b.matchCount) return b.matchCount - a.matchCount;
          
          // Finally by original index
          return a.index - b.index;
        })
        .map(item => item.lever)
    : levers;

  return (
    <div className="h-full w-full px-8">
      {sortedLevers.map((lever, index) => (
        <motion.div
          key={index}
          className="py-1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            type: "spring",
            damping: 12,
          }}
        >
          <DocumentsMenuItem lever={lever} filterCategories={filterCategories} setLever={setLever} />
        </motion.div>
      ))}
    </div>
  )
}