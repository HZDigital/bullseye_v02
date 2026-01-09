import type React from "react"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Plus, Check, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useBullseyeStore } from "@/stores/bullseyeStore"

export default function VariantToggle() {
  const { variants, setVariants, currentVariant, setCurrentVariant, renameVariant, variantData } =
    useBullseyeStore()

  // State for create new tab UI
  const [isCreating, setIsCreating] = useState(false)
  const [newTabName, setNewTabName] = useState("")

  // State for renaming
  const [renamingVariant, setRenamingVariant] = useState<string | null>(null)
  const [renamingValue, setRenamingValue] = useState("")

  // State for scrolling
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // State for copying variants
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const createInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Focus input when renaming or creating
  useEffect(() => {
    if (renamingVariant !== null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [renamingVariant])

  useEffect(() => {
    if (isCreating && createInputRef.current) {
      createInputRef.current.focus()
    }
  }, [isCreating])

  // Start creating a new tab
  const initCreate = () => {
    setIsCreating(true)
    setNewTabName("")
  }

  // Create a new tab
  const createNewTab = () => {
    const name = newTabName.trim() || `Variant ${variants.length + 1}`

    setVariants([...variants, name])
    setCurrentVariant(name)
    setRenamingVariant(null)

    setIsCreating(false)
    setNewTabName("")
  }

  // Cancel creating a new tab
  const cancelCreate = () => {
    setIsCreating(false)
    setNewTabName("")
  }

  // Start renaming a tab
  const startRename = (currentName: string) => {
    setRenamingVariant(currentName)
    setRenamingValue(currentName)
  }

  // Complete renaming a tab
  const completeRename = () => {
    if (renamingVariant !== null) {
      renameVariant(renamingVariant, renamingValue)

      // Update copiedVariant name if it was the one being renamed
      if (copiedVariant === renamingVariant) {
        setCopiedVariant(renamingValue)
      }

      setRenamingVariant(null)
    }
  }

  // Cancel renaming a tab
  const cancelRename = () => {
    setRenamingVariant(null)
  }

  // Delete a tab
  const deleteTab = (id: string) => {
    // If we're deleting the last tab, create a new default tab
    if (variants.length === 1) {
      setVariants(["Variant 1"])
      setCurrentVariant("Variant 1")
      setRenamingVariant(null)
      setRenamingValue("")
      setIsCreating(false)
      setNewTabName("")
      // Clear copiedVariant if it was the one being deleted
      if (copiedVariant === id) {
        setCopiedVariant(null)
      }
      return
    }

    // Otherwise, remove the tab
    const newVariants = [...variants.filter((variant) => variant !== id)]
    setVariants(newVariants)
    if (currentVariant === id) {
      const newActiveTab = newVariants[0] // Set to the first tab
      setCurrentVariant(newActiveTab)
    }

    // Clear copiedVariant if it was the one being deleted
    if (copiedVariant === id) {
      setCopiedVariant(null)
    }
  }

  // Copy variant data
  const copyVariant = (variantName: string) => {
    setCopiedVariant(variantName)
  }

  // Paste & Replace variant data
  const pasteAndReplaceVariant = (targetVariantName: string) => {
    if (!copiedVariant || !variantData[copiedVariant]) return

    // Create a deep copy of the variant data
    const sourceCopy = JSON.parse(JSON.stringify(variantData[copiedVariant]))

    // Update the store with the copied data
    useBullseyeStore.setState((state) => ({
      variantData: {
        ...state.variantData,
        [targetVariantName]: sourceCopy,
      },
    }))
  }

  // Handle key press in input fields
  const handleKeyPress = (e: React.KeyboardEvent, action: () => void, cancelAction: () => void) => {
    if (e.key === "Enter") {
      action()
    } else if (e.key === "Escape") {
      cancelAction()
    }
  }

  // Mouse drag scrolling handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return

    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="flex gap-1 rounded-sm bg-muted h-10 inset-shadow-xs scrollbar-hide">
      {/* Scrollable container for tabs only */}
      <div
        ref={scrollContainerRef}
        className="flex max-w-[228px] overflow-x-auto scrollbar-hide bg-muted p-1 rounded-sm inset-shadow-sm"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? "grabbing" : "grab", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-1 min-w-max">
          {variants.map((tab) => (
            <div key={tab} className="flex items-center">
              {renamingVariant === tab ? (
                <div className="flex items-center h-7 bg-background rounded-sm px-1">
                  <Input
                    ref={inputRef}
                    value={renamingValue}
                    onChange={(e) => setRenamingValue(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, completeRename, cancelRename)}
                    onBlur={completeRename}
                    className="h-6 px-1 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                  <div className="flex">
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0.5" onClick={completeRename}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0.5" onClick={cancelRename}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Button
                      className={`
                        h-8 w-fit p-0.5 rounded-sm text-foreground transition-all duration-200
                        ${tab === currentVariant ? "bg-linear-to-tr from-head to-hand" : "bg-background hover:bg-foreground"}
                      `}
                      onClick={() => setCurrentVariant(tab)}
                    >
                      <div className="h-full bg-background text-foreground rounded-sm flex items-center justify-center px-2">
                        {tab}
                      </div>
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => startRename(tab)}>Rename</ContextMenuItem>
                    <ContextMenuItem onClick={() => copyVariant(tab)}>
                      Copy
                      {copiedVariant === tab && <Check className="ml-2 h-4 w-4 text-green-500" />}
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => pasteAndReplaceVariant(tab)}
                      disabled={!copiedVariant || copiedVariant === tab}
                    >
                      Paste & Replace
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => deleteTab(tab)}>Delete</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create new tab section - outside the scrollable area */}
      <div className="flex items-center ml-1 pr-1">
        {isCreating ? (
          <div className="flex items-center h-7 bg-background rounded-sm px-1">
            <Input
              ref={createInputRef}
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, createNewTab, cancelCreate)}
              placeholder="New variant"
              className="h-6 px-1 border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm min-w-[100px]"
            />
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0.5 bg-transparent hover:bg-transparent hover:scale-110"
                onClick={createNewTab}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0.5 bg-transparent hover:bg-transparent hover:scale-110"
                onClick={cancelCreate}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 p-1 hover:scale-110 hover:bg-transparent transition-transform"
            onClick={initCreate}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}