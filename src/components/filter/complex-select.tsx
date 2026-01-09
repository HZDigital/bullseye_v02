import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ComplexSelect({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string | null) => void
}) {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="space-y-2">
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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 px-3 text-sm"
          >
            {selectedOption ? selectedOption.label : `Select ${title.toLowerCase()}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                  >
                    {option.label}
                    {value === option.value && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}