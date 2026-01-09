// External libraries
import { Check } from 'lucide-react'

// UI components
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Project-specific components and utilities
import Waterfall from "@/components/documentation/waterfall"
import type { DocLever } from "@/components/data/lever-data"

// Local components
import CategoryIcons from "../lever/category-icons"
import KPIView from "./kpi-view"
import TimelineView from './timeline-view'
import { sectionColors } from '@/components/data/lever-data'
import { useBullseyeStore } from '@/stores/bullseyeStore'

interface DocumentsLeverViewProps {
  lever: DocLever
}

export default function DocumentsLeverView({ lever }: DocumentsLeverViewProps) {
  const { filterCategories } = useBullseyeStore()

  const getColor = () => {
    return sectionColors[lever.section as keyof typeof sectionColors] ?? "#cccccc"
  }

  return (
    <div className="pr-6">
      <div className={`flex justify-between px-2 py-1 items-center`}>
        <div className="space-y-1 items-baseline">
          <Label className="text-md">{lever.title}</Label>
          <div className="text-sm text-muted-foreground">{lever.section} - {lever.dimension}</div>
        </div>
        <CategoryIcons categories={lever.categories} selectedCategories={filterCategories} size="md" />
      </div>
      <div className="rounded-full w-full h-1 mt-2" style={{ backgroundColor: getColor() }} />
      <div className="px-2 mt-4">

        <div className="grid grid-cols-2 gap-4 mt-2">

          <div className="space-y-2 pr-2">
            <div className="text-sm font-medium">Description</div>
            <div className="text-sm ">{lever.definition}</div>
          </div>

          <div className="space-y-2 pl-2">
            <Card className="p-4 h-fit">
              <div className="text-sm font-medium">Example:</div>
              <div className="text-sm text-muted-foreground">{lever.example}</div>
            </Card>
            <TimelineView lever={lever} />
          </div>

          <div className="space-y-2 pr-2">
            <div className="text-sm font-medium">Measures / Tools / Activites</div>
            <div>
              {lever.measures_tools_activities.map((item, index) => (
                <div key={index} className="flex gap-2"><Check className="h-3.5 w-4 mt-1 flex-shrink-0" /><span className="text-sm text-muted-foreground">{item}</span></div>
              ))}
            </div>
            <div className="text-sm font-medium">Impact / Potential</div>
            <div>
              {lever.impact_potential.map((item, index) => (
                <div key={index} className="flex gap-2"><Check className="h-3.5 w-4 mt-1 flex-shrink-0" /><span className="text-sm text-muted-foreground">{item}</span></div>
              ))}
            </div>
          </div>

          <div className="pl-2">
            <div className="text-sm font-medium">Approach</div>
            <Waterfall approach={lever.approach} />
          </div>

        </div>

        <div className="mt-4 pb-4">
          <KPIView kpis={lever.kpis} />
        </div>
      </div>
    </div>
  )
}