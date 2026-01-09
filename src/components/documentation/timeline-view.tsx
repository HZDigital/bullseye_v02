
/** @param  implementation_timeline is an boolean[] */

import { AlertCircle } from "lucide-react"
import type { DocLever } from "../data/lever-data"

export default function TimelineView({lever}: {lever: DocLever}) {

  if (!lever) return <div><AlertCircle />Something went wrong</div>

  // Define the terms corresponding to each position in the array
  const terms = ["Short Term", "Mid Term", "Long Term"]

  // Filter the terms based on which boolean values are true
  const selectedTerms = terms.filter((_, index) => lever.implementation_timeline[index])

  // Join the selected terms with commas
  const displayText = selectedTerms.length > 0 ? selectedTerms.join(", ") : "None selected"

  return (
    <div className="space-y-2 pt-2">
      <div className="flex gap-2">
        <span className="text-sm font-medium">Implementation Timeline: </span>
        <span className="text-sm text-muted-foreground">{displayText}</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div className={`w-full rounded-l-full ${lever.implementation_timeline[0] ? "bg-foreground" : ""} border border-foreground h-2`} />
        <div className={`w-full rounded-none ${lever.implementation_timeline[1] ? "bg-foreground" : ""} border border-foreground`} />
        <div className={`w-full rounded-r-full ${lever.implementation_timeline[2] ? "bg-foreground" : ""} border border-foreground`} />
      </div>
    </div>
  )
}