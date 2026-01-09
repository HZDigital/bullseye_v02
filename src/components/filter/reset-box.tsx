import { Button } from "@/components/ui/button"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import { RotateCcw } from "lucide-react"

type ResetButtonProps = {
  which: "filters" | "kpis"
}


export default function ResetButton({ which }: ResetButtonProps) {
  const { resetFilters, resetKPIs } = useBullseyeStore()

  const handleReset = () => {
    if (which === "filters") {
      resetFilters();
    } else {
      resetKPIs();
    }
  }


  return (
    <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2 text-muted-foreground">
      <RotateCcw className="h-3.5 w-3.5 mr-1" />
      Reset
    </Button>
  )
}