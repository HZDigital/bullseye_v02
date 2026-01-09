import { Button } from "@/components/ui/button"
import { PackageOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { navigateWithRedirect } from "@/lib/redirect-base-url"

export default function CartEmpty() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="flex flex-col m-auto py-64 justify-center items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <PackageOpen className="h-12 w-12 text-muted-foreground" />
      </motion.div>
      <motion.div
        className="p-4 text-center text-muted-foreground"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        No items selected
      </motion.div>
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <Button onClick={() => navigateWithRedirect("/", navigate)}>Go to Bullseye</Button>
      </motion.div>
    </motion.div>
  )
}