import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useEffect, useRef } from "react"

export default function RadioButtonGroup({
  title,
  explanation,
  options,
  value,
  onChange,
}: {
  title: string
  explanation: string
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string | null) => void
}) {
  // Use a ref to prevent scroll jumping
  const radioGroupRef = useRef<HTMLDivElement>(null)

  // This effect prevents layout shifts by maintaining the height
  useEffect(() => {
    if (radioGroupRef.current) {
      const element = radioGroupRef.current
      // Set a fixed height based on the current height to prevent layout shifts
      const height = element.offsetHeight
      element.style.minHeight = `${height}px`
    }
  }, [])

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{title}</h3>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
              className="h-6 px-2 text-xs text-muted-foreground"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{explanation}</div>
      </div>
      <RadioGroup
        ref={radioGroupRef}
        value={value || ""}
        onValueChange={(val) => onChange(val || null)}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <RadioGroupItem
              value={option.value}
              id={`${title}-${option.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`${title}-${option.value}`}
              className="flex items-center justify-center px-3 py-1.5 text-sm border rounded-md cursor-pointer 
                peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground 
                peer-data-[state=checked]:border-primary hover:bg-muted transition-colors"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}