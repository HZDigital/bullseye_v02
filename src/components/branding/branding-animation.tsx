import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useBullseyeStore } from "@/stores/bullseyeStore"

const LOGO_LETTERS = "/assets/hz-letters-logo.svg"
const LOGO_LETTERS_DARK = "/assets/hz-letters-logo-dark.svg"
const LOGO_ICONS = "/assets/H&Z_Icons_bunt_RGB.svg"
const TOOL_TEXT = "BullsEye"

export default function Branding() {
  const { initialAnimationComplete } = useBullseyeStore()
  const [animationComplete, setAnimationComplete] = useState(false)

  // Start the animation when the component mounts
  useEffect(() => {
    // Set animation complete after the startup animation finishes
    if (initialAnimationComplete && !animationComplete) {
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 500) // Small delay after the main animation completes

      return () => clearTimeout(timer)
    }
  }, [initialAnimationComplete, animationComplete])

  return (
    <div className="pt-4 relative w-full flex justify-center items-center -mb-16 overflow-hidden">
      {/* Container for the logo and text */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{
          x: animationComplete ? "100%" : 0,
          opacity: animationComplete ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8,
        }}
      >
        {/* Logo row with icons and letters */}
        <motion.div className="flex items-center">
          <motion.img src={LOGO_ICONS} alt="H&Z Icons" className="h-8 mr-2" />
          <motion.img src={LOGO_LETTERS} alt="H&Z Letters" className="h-8 block dark:hidden" />
          <motion.img src={LOGO_LETTERS_DARK} alt="H&Z Letters" className="h-8 hidden dark:block" />
        </motion.div>

        {/* Text row */}
        <motion.div className="text-lg font-bold mt-1">{TOOL_TEXT}</motion.div>
      </motion.div>

      {/* Resting state - just the icons at 50% opacity */}
      <motion.img
        src={LOGO_ICONS}
        alt="H&Z Icons"
        className="absolute h-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: animationComplete ? 0.5 : 0,
          scale: animationComplete ? 1 : 0.8,
          x: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: animationComplete ? 0.2 : 0, // Small delay to ensure smooth transition
        }}
      />
    </div>
  )
}