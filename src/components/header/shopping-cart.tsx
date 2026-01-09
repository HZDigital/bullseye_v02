import { Package, PackageOpen, PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer"
import TableView from "../checkout/table-view"
import { SheetMain } from "./filter-sheet"
import ResetButton from "../filter/reset-box"
import { navigateWithRedirect } from "@/lib/redirect-base-url"
import { useNavigate } from "react-router-dom"

export default function ShoppingCart() {
  const [hovered, setHovered] = useState(false)
  const [animating, setAnimating] = useState(false)
  const { getCurrentCartItems, clearCart } = useBullseyeStore()
  const navigate = useNavigate()

  const currentCartItems = getCurrentCartItems()
  const prevCartLength = useRef(currentCartItems.length)

  // Trigger animation when cart items change
  useEffect(() => {
    // Only animate when items are added (not removed)
    if (currentCartItems.length > prevCartLength.current) {
      const animationTimer = setTimeout(() => {
        setAnimating(true)

        // Reset animation after a short delay
        const resetTimer = setTimeout(() => {
          setAnimating(false)
        }, 500) // Animation duration in milliseconds

        return () => clearTimeout(resetTimer)
      }, 0)

      // Update the previous length reference
      prevCartLength.current = currentCartItems.length

      return () => clearTimeout(animationTimer)
    }

    // Update the previous length reference
    prevCartLength.current = currentCartItems.length
  }, [currentCartItems.length])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative"
        >
          {hovered || animating ? <PackageOpen className="h-5 w-5" /> : <Package className="h-5 w-5" />}
          {currentCartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-linear-to-tr from-head to-hand text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {currentCartItems.length}
            </span>
          )}
          <span>Lever Box</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex items-center justify-between p-4 border-b shrink-0">
          <h3 className="font-medium">Lever Box</h3>
          <div className="flex items-center gap-2">
            {currentCartItems.length > 0 &&
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-destructive"
                onClick={clearCart}
              >
                <PackageX />Clear
              </Button>}
            <span className="text-sm text-muted-foreground">{currentCartItems.length} items</span>
          </div>
        </DrawerHeader>
        <div className="flex gap-2 overflow-hidden flex-1">
          <div className="w-1/4 border-r shrink-0">
            <Filters />
          </div>
          {currentCartItems.length === 0 ? (
            <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
              <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Your lever box is empty</p>
            </div>
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <TableView />
              </div>
              <div className="p-4 border-t shrink-0">
                <div className="flex justify-end">
                  <Button
                    className="bg-linear-to-tr from-head to-hand hover:bg-linear-to-r"
                    onClick={() => navigateWithRedirect("/checkout", navigate)}
                  >
                    <span className="text-white">Checkout</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function Filters() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-1.5 border-b shrink-0">
        <div className="flex items-center justify-between p-0">
          <h3 className="text-lg font-semibold">Filters</h3>
          <ResetButton which="filters" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <SheetMain />
        </div>
      </div>
    </div>
  )
}