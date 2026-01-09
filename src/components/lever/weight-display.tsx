import { useBullseyeStore } from "@/stores/bullseyeStore"
import type { DocLever } from "../data/lever-data"

interface WeightDisplayProps {
  lever: DocLever
}

export default function WeightDisplay({ lever }: WeightDisplayProps) {
  const { calculateLeverWeight } = useBullseyeStore()

  // Calculate the weight for this lever
  const maxWeight = 45; // We might have to change this value, depending on each filter weight currently +3 for each boolean and the each matching category
  const weightPerBubble = maxWeight / 5;
  const weight = calculateLeverWeight(lever)
  const filled = (index: number) => { return index < Math.round(weight / weightPerBubble) }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index}
          className={`
      ${filled(index) ? "bg-primary" : "bg-muted border border-border"} 
      w-2 h-2 rounded-full`}
        />
      ))}
      <span className="pl-1 text-sm text-muted-foreground">{weight == 0 ? 0 : Math.round(weight / maxWeight * 100)}%</span>
    </div>
  )
}

// impl_time: +3
// mat_des: +3
// mat_type: +3
// details: +3
// esg: +3
// cat: +9 (lets keep this one out)

// sup_num: +5
// sup_pow: +5
// price: +5
// sup_comp: +5
// geo: +5
// lead: +5

// = +30
// = +15 (24 with category)
// = 45