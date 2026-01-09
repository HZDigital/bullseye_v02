import AppHeader from "@/components/layout/app-header"

import DocumentsButton from "@/components/documentation/documents-button"
import FilterSheet from "@/components/header/filter-sheet"
import KPISheet from "@/components/header/kpis-sheet"
import MainCategoryTabs from "@/components/header/main-category-tabs"
import VariantToggle from "@/components/header/variant-toggle"
import ShoppingCart from "@/components/header/shopping-cart"

import Bullseye from "@/components/sunburst/bullseye"

import { sectionColors } from "@/components/data/lever-data"
import { Explanation } from "@/components/section-explanation"
import { DimensionExplanation } from "@/components/dimension-explanation"
import { Levers } from "@/components/lever/levers"

import { useBullseyeStore } from "@/stores/bullseyeStore"
import Branding from "@/components/branding/branding-animation"

import BadgeVisibility from "@/components/sunburst/badge-visibility"

export default function BullseyePage() {
  const { selectedDimension } = useBullseyeStore()

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <AppHeader>
        <div className="flex w-full justify-center">
          <div className="w-full flex gap-2">
            <DocumentsButton />
            <FilterSheet side="left" />
            <KPISheet side="left" />
          </div>
          <div className="w-full flex justify-center">
            <MainCategoryTabs categories={["Value Creation", "Sustainability", "Resilience"]} />
          </div>
          <div className="w-full flex justify-end gap-2">
            <BadgeVisibility />
            <VariantToggle />
            <ShoppingCart />
          </div>
        </div>
      </AppHeader>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden px-8" style={{ height: "calc(100vh - 64px)" }}>
        <div className="w-full h-full overflow-hidden">
          {selectedDimension ? (
            // Show subcategory explanation when a subcategory is selected
            <DimensionExplanation
              subcategoryTitle={selectedDimension.title}
              color={sectionColors[selectedDimension.section as keyof typeof sectionColors]}
            />
          ) : (
            // Show regular explanations when no subcategory is selected
            <div className="h-full overflow-hidden">
              <Explanation section="Specification" color={sectionColors.Specification} />
              <Explanation section="Demand" color={sectionColors.Demand} />
            </div>
          )}
        </div>
        <div className="w-full flex flex-col justify-center items-center overflow-hidden">
          <Branding />
          <Bullseye />
        </div>
        <div className="w-full h-full overflow-hidden">
          {selectedDimension ? (
            // Show levers when a subcategory is selected
            <Levers />
          ) : (
            // Show regular explanations when no subcategory is selected
            <div className="h-full overflow-hidden">
              <Explanation section="Sourcing" color={sectionColors.Sourcing} />
              <Explanation section="Execution" color={sectionColors.Execution} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}