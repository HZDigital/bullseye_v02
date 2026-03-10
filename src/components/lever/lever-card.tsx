import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookmarkCheck, BookOpen, PackageCheck, PackagePlus, PackageX, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useEffect, useState } from "react"

import FadeText from "./fade-text"
import LeverDialog from "./lever-dialog"
import CategoryIcons from "./category-icons"
import WeightDisplay from "./weight-display"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import type { DocLever } from "../data/lever-data"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface LeverCardProps {
  lever: DocLever
}

// Button states
type ButtonState = "add" | "added" | "remove"

export default function LeverCard({ lever }: LeverCardProps) {
  const { addToCart, isInCart, removeFromCart, filterCategories, isRecommendedLever } = useBullseyeStore()
  const inCart = isInCart(lever.id)
  const isRecommended = isRecommendedLever(lever.id)
  const [showAdded, setShowAdded] = useState(false)

  // Derive button state from inCart and showAdded
  const buttonState: ButtonState = showAdded ? "added" : inCart ? "remove" : "add"

  // Handle the "added" animation transition
  useEffect(() => {
    let timeout: number

    if (showAdded) {
      // Transition from "added" animation after 1.5 seconds
      timeout = setTimeout(() => {
        setShowAdded(false)
      }, 1500)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [showAdded])

  // Handle add to cart with state transition
  const handleAddToCart = () => {
    addToCart(lever)
    setShowAdded(true)
  }

  return (
    <div className={cn("p-0.5 rounded-lg", { "bg-linear-to-tr from-head to-hand": isRecommended })}>
      <Card className={isRecommended ? "" : "border shadow-sm overflow-hidden"}>
        <CardHeader className="relative">
          <div className="w-full flex justify-between items-center pb-2">
            {/* Category Icons - show all three */}
            <div className="flex gap-2">
              <CategoryIcons categories={lever.categories} selectedCategories={filterCategories} size="sm" />
            </div>
            {/* Weight progress bar */}
            <div className="flex gap-2 items-center justify-end flex-1">
              <Tooltip>
                <TooltipTrigger>
                  <BookmarkCheck className="text-muted-foreground h-4 w-4 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Strategic Fit</span>
                </TooltipContent>
              </Tooltip>
              <WeightDisplay lever={lever} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{lever.title}</CardTitle>
          </div>

          {isRecommended && (
            <div className="absolute -top-0.5 -left-0.5 mt-0! flex items-center bg-linear-to-tl from-head to-hand text-white px-2 py-0.5 rounded-br-lg rounded-tl-lg text-xs font-medium">
              <Star className="h-3 w-3 mr-1 text-white fill-white" />
              Recommended
            </div>
          )}
        </CardHeader>

        <CardContent className="-mt-3">
          {/* Description with truncated text */}
          <FadeText text={lever.definition} />

          <div className="mt-4 flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 text-sm font-medium text-foreground hover:bg-muted">
                  <BookOpen className="h-5 w-5" />
                  More information
                </Button>
              </DialogTrigger>
              <LeverDialog lever={lever} />
            </Dialog>

            {buttonState === "add" && (
              <Button size="sm" className="flex-1 text-sm bg-foreground hover:bg-linear-to-tr from-head to-hand transition-colors duration-300" onClick={handleAddToCart}>
                <PackagePlus className="h-5 w-5" />
                Add to lever box
              </Button>
            )}

            {buttonState === "added" && (
              <Button size="sm" className="flex-1 text-sm bg-linear-to-tr from-head to-hand" disabled>
                <span className="text-white">
                  <PackageCheck className="h-5 w-5" />
                </span>
                <span className="text-white">Lever added</span>
              </Button>
            )}

            {buttonState === "remove" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-sm text-destructive hover:bg-destructive hover:text-white"
                onClick={() => removeFromCart(lever.id)}
              >
                <PackageX className="h-5 w-5" />
                Remove from box
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}