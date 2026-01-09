import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import ResetButton from "../filter/reset-box"
import RadioButtonGroup from "../filter/radio-select"
import ComplexSelect from "../filter/complex-select"
import { useState } from "react"

type FilterSheetProps = {
  side?: "left" | "right"
}

export default function FilterSheet({ side }: FilterSheetProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 ease-in-out"
          aria-label="Open filters"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <SlidersHorizontal className={`h-4 w-4 ${hovered ? "scale-x-[-1]" : ""}`} />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-6 border-b shrink-0">
            <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
            <div className="flex items-center justify-between mb-2">
              <SheetDescription className="text-sm text-muted-foreground">
                Apply filters to further refine your lever selection.
              </SheetDescription>
              <ResetButton which="filters" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full p-4 sm:p-6 overflow-y-auto">
              <SheetMain />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function SheetMain({ allRadio }: { allRadio?: boolean }) {
  const { setFilter, getCurrentFilters } = useBullseyeStore()

  // Get current variant's filters
  const filters = getCurrentFilters()

  // Implementation Time options
  const implementationTimeOptions = ["short term", "mid term", "long term"]

  // Material Description options
  const materialDescriptionOptions = ["Product", "Project", "System", "Service"]

  // Type of Material options
  const typeOfMaterialOptions = ["Direct", "Indirect"]

  // Details options
  const detailsOptions = ["Catalogue", "Standard", "Customized", "Raw Material"]

  // ESG options
  const esgOptions = ["Environmental", "Social", "Governance"]

  const explanations = {
    implementationTime: "The estimated duration required to fully implement a lever and achieve measurable results. It guides prioritization based on urgency or project timelines.",
    materialDescription: "Describes the functional classification of the material or item being sourced, based on its usage or application.",
    typeOfMaterial: "Categorizes the procurement item based on its contribution to the core business process.",
    details: "Classifies the degree of standardization or customization of a material.",
    numberOfSuppliers: "Describes the market structure based on supplier availability within a category.",
    supplierPower: "Indicates the relative influence suppliers have over pricing, terms, or availability due to market conditions, capabilities, or uniqueness.",
    categoryPriceTrend: "Reflects the market dynamics and pricing trajectory in a procurement category.",
    supplyChain: "Describes the complexity and value distribution across tiers of the supply chain.",
    geoSourcing: "Defines the spatial scope and strategic location of the sourcing base.",
    leadTime: "Estimates how quickly a product or solution derived from the lever can reach end users or the market.",
    esg: "Filters levers based on their primary contribution to environmental, social, or governance dimensions.",
  }

  return (
    <div className="space-y-8">
      {/* Implementation Time */}
      <RadioButtonGroup
        title="Implementation Time"
        explanation={explanations.implementationTime}
        options={implementationTimeOptions.map((value) => ({ value, label: value }))}
        value={filters.implementationTime}
        onChange={(value) => setFilter("implementationTime", value)}
      />

      {/* Material Description */}
      <RadioButtonGroup
        title="Material Description"
        explanation={explanations.materialDescription}
        options={materialDescriptionOptions.map((value) => ({ value, label: value }))}
        value={filters.materialDescription}
        onChange={(value) => setFilter("materialDescription", value)}
      />

      {/* Type of Material */}
      <RadioButtonGroup
        title="Type of Material"
        explanation={explanations.typeOfMaterial}
        options={typeOfMaterialOptions.map((value) => ({ value, label: value }))}
        value={filters.typeOfMaterial}
        onChange={(value) => setFilter("typeOfMaterial", value)}
      />

      {/* Material Customization Level */}
      <RadioButtonGroup
        title="Material Customization Level"
        explanation={explanations.details}
        options={detailsOptions.map((value) => ({ value, label: value }))}
        value={filters.details}
        onChange={(value) => setFilter("details", value)}
      />

      {/* Number of Suppliers */}
      <RadioButtonGroup
        title="Number of Suppliers"
        explanation={explanations.numberOfSuppliers}
        options={[
          { value: "Monopoly", label: "Monopoly" },
          { value: "Oligopoly", label: "Oligopoly" },
          { value: "Polypoly", label: "Polypoly" },
        ]}
        value={filters.numberOfSuppliers}
        onChange={(value) => setFilter("numberOfSuppliers", value)}
      />

      {/* Supplier Power */}
      <RadioButtonGroup
        title="Supplier Power"
        explanation={explanations.supplierPower}
        options={[
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ]}
        value={filters.supplierPower}
        onChange={(value) => setFilter("supplierPower", value)}
      />

      {/* Current Category Price Trend */}
      <RadioButtonGroup
        title="Current Category Price Trend"
        explanation={explanations.categoryPriceTrend}
        options={[
          { value: "rising", label: "Rising" },
          { value: "stable", label: "Stable" },
          { value: "declining", label: "Declining" },
        ]}
        value={filters.commodityPriceTrend}
        onChange={(value) => setFilter("commodityPriceTrend", value)}
      />

      {/* Supply Chain Depth & Value Concentration */}
      {allRadio ? (
        <ComplexSelect
          title="Supply Chain Depth & Value Concentration"
          options={[
            { value: "High added value at Tier-1", label: "High added value at Tier-1" },
            {
              value: "Moderate finishing depths in SC (Tier-1-3)",
              label: "Moderate finishing depths in SC (Tier-1-3)",
            },
            {
              value: "Complex finishing depths in SC (Tier-N)",
              label: "Complex finishing depths in SC (Tier-N)",
            },
          ]}
          value={filters.supplyChainComplexity}
          onChange={(value) => setFilter("supplyChainComplexity", value)}
        />
      ) : (
        <RadioButtonGroup
          title="Supply Chain Depth & Value Concentration"
          explanation={explanations.supplyChain}
          options={[
            { value: "High added value at Tier-1", label: "High added value at Tier-1" },
            {
              value: "Moderate finishing depths in SC (Tier-1-3)",
              label: "Moderate finishing depths in SC (Tier-1-3)",
            },
            {
              value: "Complex finishing depths in SC (Tier-N)",
              label: "Complex finishing depths in SC (Tier-N)",
            },
          ]}
          value={filters.supplyChainComplexity}
          onChange={(value) => setFilter("supplyChainComplexity", value)}
        />
      )}

      {/* Geographic Sourcing Strategy */}
      <RadioButtonGroup
        title="Geographic Sourcing Strategy"
        explanation={explanations.geoSourcing}
        options={[
          { value: "Local", label: "Local" },
          { value: "Regional", label: "Regional" },
          { value: "Global", label: "Global" },
        ]}
        value={filters.geographicSourcingStrategy}
        onChange={(value) => setFilter("geographicSourcingStrategy", value)}
      />

      {/* Lead Time */}
      <RadioButtonGroup
        title="Lead Time"
        explanation={explanations.leadTime}
        options={[
          { value: "Low / < 6 Months", label: "Low / < 6 Months" },
          { value: "Medium / < 1 year", label: "Medium / < 1 year" },
          { value: "High / > 1 year", label: "High / > 1 year" },
        ]}
        value={filters.leadTime}
        onChange={(value) => setFilter("leadTime", value)}
      />

      {/* ESG */}
      <RadioButtonGroup
        title="ESG"
        explanation={explanations.esg}
        options={esgOptions.map((value) => ({ value, label: value }))}
        value={filters.esg}
        onChange={(value) => setFilter("esg", value)}
      />
    </div>
  )
}