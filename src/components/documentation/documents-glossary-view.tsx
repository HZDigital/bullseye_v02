import { glossary } from '../data/documents-glossary'
import { Label } from '@/components/ui/label'

export default function DocumentsGlossaryView() {

  return (
    <div className="space-y-4 pb-4 pr-8 overflow-y-hidden">
      <h2 className="font-bold text-sm">Definitions</h2>
      <BullseyeDef />
      <LeverDef />
      <OptimizationAreasDef />
      <ClustersDef />
      <MTADef />
      <IPDef />
      <ApproachDef />
      <ImpTimeDef />
      <KPIDef />
    </div>
  )
}

function BullseyeDef() {
  return (
    <div className="space-y-1.5">
      <Label>{glossary.bullseye.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.bullseye.definition}</span></div>
    </div>
  )
}

import { Leaf, HandCoins, Shield } from 'lucide-react'
import SectionBadge from '../lever/section-badge'

function LeverDef() {
  const categoryConfig = {
    "Value Creation": {
      Icon: HandCoins,
    },
    Sustainability: {
      Icon: Leaf,
    },
    Resilience: {
      Icon: Shield,
    },
  }

  return (
    <div className="space-y-1.5">
      <Label>{glossary.lever.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.lever.definition}</span></div>
      <ul>
        {glossary.lever.sub.map((sub, index) => {
          let category = ""
          if (sub.term.includes("Value Creation")) {
            category = "Value Creation"
          } else if (sub.term.includes("Sustainability")) {
            category = "Sustainability"
          } else if (sub.term.includes("Resilience")) {
            category = "Resilience"
          }

          const { Icon } = categoryConfig[category as keyof typeof categoryConfig]

          return (
            <li key={index} className="flex gap-2 items-center">
              {Icon && <span className="text-muted-foreground"><Icon className="h-4 w-4" /></span>}
              <Label>{sub.term}:</Label>
              <div>
                <span className="text-muted-foreground text-sm">{sub.definition}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function OptimizationAreasDef() {
  return (
    <div className="space-y-1.5">
      <Label>{glossary.optimization_area.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.optimization_area.definition}</span></div>
      {glossary.optimization_area.sub.map((sub, index) => (
        <div key={index} className="flex gap-2 items-center">
          <SectionBadge section={sub.term} />
          <span className="text-muted-foreground text-sm">{sub.definition}</span>
        </div>
      ))}
    </div>
  )
}


import { Card, CardContent } from '@/components/ui/card'


function ClustersDef() {
  const color = (term: string) => sectionColors[term as keyof typeof sectionColors] || "#888"

  return (
    <div className="space-y-1.5">
      <Label>{glossary.clusters.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.clusters.definition}</span></div>
      <div className='grid grid-cols-2 gap-2'>
        {glossary.clusters.sub.map((sub, index) => (
          <Card key={index} className="overflow-hidden py-2 px-2 bg-background"
            style={{ borderWidth: "2px", borderColor: color(sub.term) }}>
            <div className="flex gap-2 items-center">
              <div className="w-1/4">
                <SectionBadge section={sub.term} />
              </div>
              <div className="flex flex-col gap-2">
                {sub.sub.map((subSub, subIndex) => (
                  <span key={subIndex} className="text-sm">{subSub}</span>
                ))}
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MTADef() {
  return (
    <div className="space-y-1.5">
      <Label>{glossary.mta.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.mta.definition}</span></div>
    </div>
  )
}

function IPDef() {
  return (
    <div className="space-y-1.5">
      <Label>{glossary.ip.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.ip.definition}</span></div>
    </div>
  )
}

function ApproachDef() {
  return (
    <div className="space-y-1.5">
      <Label>{glossary.approach.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.approach.definition}</span></div>
    </div>
  )
}

function ImpTimeDef() {
  return (
    <div className="space-y-1.5">
      <Label>{glossary.implementation_timeline.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.implementation_timeline.definition}</span></div>
      <div className='grid grid-cols-3 gap-2'>
        {glossary.implementation_timeline.sub.map((sub, index) => (
          <div key={index} className="flex gap-2 items-center justify-center">
            <Label>{sub.term}:</Label>
            <span className="text-muted-foreground text-sm">{sub.definition}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sectionColors } from '../data/lever-data'

function KPIDef() {
  return (
    <div className="space-y-1.5">
      <Label>{glossary.kpi.term}:</Label>
      <div><span className="text-muted-foreground text-sm">{glossary.kpi.definition}</span></div>
      <div className="flex w-full pb-4">
        <Tabs defaultValue="vci_kpi" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="vci_kpi" className="w-full">{glossary.vc_kpi.term}</TabsTrigger>
            <TabsTrigger value="sustainability_kpi" className="w-full">{glossary.sustainability_kpi.term}</TabsTrigger>
            <TabsTrigger value="resilience_kpi" className="w-full">{glossary.resilience_kpi.term}</TabsTrigger>
          </TabsList>
          <TabsContent value="vci_kpi">
            <Card>
              <KPICardContent sub={glossary.vc_kpi.sub} />
            </Card>
          </TabsContent>
          <TabsContent value="sustainability_kpi">
            <Card>
              <KPICardContent sub={glossary.sustainability_kpi.sub} />
            </Card>
          </TabsContent>
          <TabsContent value="resilience_kpi">
            <Card>
              <KPICardContent sub={glossary.resilience_kpi.sub} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface KPIItem {
  term: string
  definition: string
}

interface KPICardProps {
  sub: KPIItem[]
}

function KPICardContent({ sub }: KPICardProps) {
  return (
    <CardContent className="space-y-2">
      {sub.map((item: KPIItem, index: number) => (
        <div key={index}>
          <span className="text-foreground text-sm">{item.term}: </span>
          <div><span className="text-muted-foreground text-sm">{item.definition}</span></div>
        </div>
      ))}
    </CardContent>
  )
}