import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MultiSelectCombobox({
  title,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
}: {
  title: string
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = (e: React.MouseEvent, value: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (selectedValues.length === options.length) {
      onChange([])
    } else {
      onChange([...options])
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const allSelected = options.length > 0 && selectedValues.length === options.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {selectedValues.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            className="h-6 px-2 text-xs text-muted-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 px-3 text-sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-popover rounded-md border border-border shadow-md">
            <div className="max-h-[300px] overflow-auto p-1">
              <div
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted rounded-sm"
                onClick={(e) => handleSelectAll(e)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                    allSelected ? "bg-primary border-primary" : "opacity-50",
                  )}
                >
                  {allSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span>Select All</span>
              </div>

              {options.map((option) => (
                <div
                  key={option}
                  className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted rounded-sm"
                  onClick={(e) => handleSelect(e, option)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border",
                      selectedValues.includes(option) ? "bg-primary border-primary" : "opacity-50",
                    )}
                  >
                    {selectedValues.includes(option) && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedValues.map((value) => (
            <Badge key={value} variant="secondary" className="text-xs py-0 h-6">
              {value}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(selectedValues.filter((v) => v !== value))
                }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}