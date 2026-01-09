import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { DocLever } from "@/components/data/lever-data"
import CategoryIcons from "./category-icons"
import SectionBadge from "./section-badge"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { PackageCheck, PackagePlus, PackageX } from "lucide-react"
import KPIView from "@/components/documentation/kpi-view"

interface LeverDialogProps {
  lever: DocLever
}

type ButtonState = "add" | "added" | "remove"

export default function LeverDialog({ lever }: LeverDialogProps) {
  const { addToCart, isInCart, filterCategories, removeFromCart } = useBullseyeStore()
  const inCart = isInCart(lever.id)
  const [showKPIs, setShowKPIs] = useState(false)
  const [showAddedState, setShowAddedState] = useState(false)

  // Derive button state from inCart and showAddedState
  const buttonState: ButtonState = !inCart ? "add" : showAddedState ? "added" : "remove"

  // Handle transition from "added" to "remove" after 1.5 seconds
  useEffect(() => {
    if (showAddedState) {
      const timeout = setTimeout(() => {
        setShowAddedState(false)
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [showAddedState])

  const toggle = () => {
    setShowKPIs(!showKPIs)
  }

  const handleAddToCart = () => {
    addToCart(lever)
    setShowAddedState(true)
  }

  return (
    <DialogContent>
      <DialogHeader className="space-y-2">
        <CategoryIcons categories={lever.categories} selectedCategories={filterCategories} size="sm" />
        <DialogTitle>{lever.title}</DialogTitle>
        <SectionBadge section={lever.section} />
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {showKPIs ? (
          <KPIView kpis={lever.kpis} />
        ) : (
          <>
            <div className="text-sm">{lever.definition}</div>
            <div>
              <h3 className="text-sm font-medium mb-2">Example:</h3>
              <p className="text-sm text-muted-foreground">{lever.example}</p>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={toggle}
          >
            {showKPIs ? "Show general Information" : "Show KPIs"}
          </Button>
          {buttonState === "add" && (
            <Button size="sm" className="flex-1 text-sm"
              onClick={handleAddToCart}
            >
              <PackagePlus className="h-5 w-5 mr-2" />
              Add to lever box
            </Button>
          )}

          {buttonState === "added" && (
            <Button size="sm" className="flex-1 text-sm bg-linear-to-tr from-head to-hand" disabled>
              <span className="text-white">
                <PackageCheck className="h-5 w-5 mr-2" />
              </span>
              <span className="text-white">Lever added</span>
            </Button>
          )}

          {buttonState === "remove" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full flex-1 text-sm text-destructive"
              onClick={() => removeFromCart(lever.id)}
            >
              <PackageX className="h-5 w-5 mr-2" />
              Remove from box
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  )
}