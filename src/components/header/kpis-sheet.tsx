import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import ResetButton from "../filter/reset-box"
import { ChartColumn, ChartColumnIncreasing } from "lucide-react"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import MultiSelectCombobox from "../filter/multi-select-combobox"

type KPIsSheetProps = {
  side?: "left" | "right"
}

export default function KPISheet({ side }: KPIsSheetProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 ease-in-out"
          aria-label="Open KPIs"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered ? <ChartColumnIncreasing className="h-4 w-4" /> : <ChartColumn className="h-4 w-4" />}
          <span>KPIs</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-6 border-b shrink-0">
            <SheetTitle className="text-lg font-semibold">KPIs</SheetTitle>
            <div className="flex items-center justify-between mb-2">
              <SheetDescription className="text-sm text-muted-foreground">
                Apply KPIs to further refine your lever selection.
              </SheetDescription>
              <ResetButton which="kpis" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full p-4 sm:p-6 overflow-y-auto">
              <KPIsMain />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const VALUE_CREATION_OPTIONS = ["PPC", "MCP", "VAM", "CTG", "ANR"]

const SUSTAINABILITY_OPTIONS = ["CO2", "Circularity rating", "CoC adherence", "Supplier risk score"]

const RESILIENCE_OPTIONS = ["OTIF", "AVG Lead Time", "Safety Stock", "% single-source supplier"]

export function KPIsMain() {
  const { setKPIs, getCurrentKPIs } = useBullseyeStore()

  // Get current variant's KPIs
  const kpis = getCurrentKPIs()

  return (
    <div className="space-y-8">
      <MultiSelectCombobox
        title="Value Creation"
        options={VALUE_CREATION_OPTIONS}
        selectedValues={kpis.valueCreation}
        onChange={(values) => setKPIs("valueCreation", values)}
      />
      <MultiSelectCombobox
        title="Sustainability"
        options={SUSTAINABILITY_OPTIONS}
        selectedValues={kpis.sustainability}
        onChange={(values) => setKPIs("sustainability", values)}
      />
      <MultiSelectCombobox
        title="Resilience"
        options={RESILIENCE_OPTIONS}
        selectedValues={kpis.resilience}
        onChange={(values) => setKPIs("resilience", values)}
      />
    </div>
  )
}