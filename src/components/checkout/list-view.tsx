import { motion } from "framer-motion"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import type { DocLever } from "../data/lever-data"
import ListItemCard from "./list-item-card"

export default function ListView({ toggleLever }: { toggleLever: (lever: DocLever) => void }) {
  const { removeFromCart, getCurrentCartItems } = useBullseyeStore()

  // Get current variant's cart items
  const currentCartItems = getCurrentCartItems()

  return (
    <div className="h-full w-full px-8">
      {currentCartItems.map((lever, index) => (
        <motion.div
          key={lever.title}
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
          <ListItemCard lever={lever} onRemove={() => removeFromCart(lever.id)} toggleLever={toggleLever} />
        </motion.div>
      ))}
    </div>
  )
}