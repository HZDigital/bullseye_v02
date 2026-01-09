import type React from "react"

import { useState } from "react"
import { LEVER_DATA } from "@/components/data/lever-data"
import { ScrollArea } from "@/components/ui/scroll-area"
import AppHeader from "@/components/layout/app-header"
import BullseyeButton from "@/components/documentation/bullseye-button"
import MainCategoryTabs from "@/components/header/main-category-tabs"
import DocumentsMenu from "@/components/documentation/documents-menu"
import { AnimatePresence, motion } from "framer-motion"
import type { DocLever } from "@/components/data/lever-data"
import DocumentsGlossaryView from "@/components/documentation/documents-glossary-view"
import DocumentsLeverView from "@/components/documentation/documents-lever-view"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import { Input } from "@/components/ui/input"
import { ScanSearch, Search, X } from "lucide-react"

export default function BullseyeLeverDocsPage() {
  const [current, setCurrent] = useState<DocLever | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { filterCategories } = useBullseyeStore()
  const typedData = LEVER_DATA as unknown as DocLever[]

  // Filter levers based on both categories and search query
  const filteredLevers = typedData.filter(
    (lever) =>
      // Filter by categories if any are selected
      (filterCategories.length === 0 || lever.categories.some((category) => filterCategories.includes(category))) &&
      // Filter by search query across multiple fields if one exists
      (searchQuery === "" ||
        // Check all string properties and arrays of strings
        lever.title
          .toLowerCase().includes(searchQuery.toLowerCase()) ||
        lever.section
          .toLowerCase().includes(searchQuery.toLowerCase()) ||
        lever.dimension
          .toLowerCase().includes(searchQuery.toLowerCase()) ||
        lever.definition
          .toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Check arrays of strings
        lever.categories.some((category) => category
          .toLowerCase().includes(searchQuery.toLowerCase())) ||
        lever.measures_tools_activities.some((item) => item
          .toLowerCase().includes(searchQuery.toLowerCase())) ||
        lever.impact_potential.some((item) => item
          .toLowerCase().includes(searchQuery.toLowerCase())) ||
        lever.approach.some((item) => item
          .toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const toggleLever = (lever: DocLever) => {
    setCurrent(current && current.title === lever.title ? null : lever)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <main className="overflow-y-hidden">
      <AppHeader>
        <div className="flex w-full justify-center">
          <div className="w-full flex gap-2">
            <BullseyeButton />
          </div>
          <MainCategoryTabs categories={["Value Creation", "Sustainability", "Resilience"]} />
          <div className="w-full flex justify-end gap-2"></div>
        </div>
      </AppHeader>
      <div className="w-full flex flex-row gap-8 overflow-hidden px-8">
        <motion.div
          className="h-full overflow-hidden w-112.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-8 py-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a specific lever..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <ScrollArea style={{ height: "calc(100vh - 6.5rem)" }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="pb-16"
              >
                <DocumentsMenu levers={filteredLevers} filterCategories={filterCategories} setLever={toggleLever} />
                {filteredLevers.length === 0 && (
                  <div className="flex flex-col justify-center items-center shrink-0 p-8">
                    <ScanSearch className="w-8 h-8 text-muted-foreground stroke-1 mx-auto" />
                    <span className="p-1 text-muted-foreground text-center">No matching levers found</span>
                  </div>
                )}
              </motion.div>
            </ScrollArea>
          </AnimatePresence>
        </motion.div>

        <div className="flex-1 overflow-y-hidden">
          {current ? (
            <ScrollArea style={{ height: "calc(100vh - 3.2rem)" }}>
              <DocumentsLeverView lever={current} />
            </ScrollArea>
          ) : (
            <ScrollArea style={{ height: "calc(100vh - 3.2rem)" }}>
              <DocumentsGlossaryView />
            </ScrollArea>
          )}
        </div>
      </div>
    </main>
  )
}