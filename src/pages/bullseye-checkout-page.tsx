import { useState } from "react"
import AppHeader from "@/components/layout/app-header"
import ToggleView from "@/components/checkout/toggle-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Sheet } from "lucide-react"
import { useNavigate } from "react-router-dom"
import CartEmpty from "@/components/checkout/empty-view"
import { AnimatePresence, motion } from "framer-motion"
import ListView from "@/components/checkout/list-view"
import TableView from "@/components/checkout/table-view"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useBullseyeStore } from "@/stores/bullseyeStore"
import VariantToggle from "@/components/header/variant-toggle"
import DocumentsLeverView from "@/components/documentation/documents-lever-view"
import type { DocLever } from "@/components/data/lever-data"
import NoListItem from "@/components/checkout/no-list-item"
import { Filters } from "@/components/header/shopping-cart"
import { exportBullseyeToXLSX } from "@/components/checkout/export-xlsx"
import { exportBullseyeToPDF } from "@/components/checkout/export-pdf"
import { navigateWithRedirect } from "@/lib/redirect-base-url"

export default function BullseyeCheckoutPage() {
  const navigate = useNavigate()

  const [view, setView] = useState<"list" | "table">("list")
  const { getCurrentCartItems } = useBullseyeStore()

  // Get current variant's cart items
  const currentCartItems = getCurrentCartItems()

  const [current, setCurrent] = useState<DocLever | null>(null)
  const toggleLever = (lever: DocLever) => {
    setCurrent(current && current.title === lever.title ? null : lever)
  }

  return (
      <main className="h-screen w-full overflow-clip">
        <AppHeader>
          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigateWithRedirect("/", navigate)}>
                <ArrowLeft />
                Back to Bullseye
              </Button>
              <ToggleView setView={setView} view={view} />
            </div>
            <div className="flex justify-end gap-2">
              <VariantToggle />
            </div>
          </div>
        </AppHeader>
        <div className="w-full flex gap-8 overflow-hidden px-8 relative">
          {currentCartItems.length === 0 ? (
            <CartEmpty />
          ) : (
            <>
              <motion.div
                className={`${view === "list" ? "w-1/2" : "w-full"} h-full overflow-hidden`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">

                  <div className="w-full overflow-hidden" style={{ height: "calc(100vh - 3.2rem)" }}>
                    {view === "list" ? (
                      <ScrollArea style={{ height: "calc(100vh - 3.2rem)" }}>
                        <motion.div
                          key="list-view"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="pb-16"
                        >
                          <ListView toggleLever={toggleLever} />
                        </motion.div>
                      </ScrollArea>
                    ) : (
                      <motion.div
                        key="table-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="pb-16"
                      >
                        <div className="flex gap-2 overflow-hidden flex-1">
                          <ScrollArea
                            className="w-1/3 border-r shrink-0"
                            style={{ height: "calc(100vh - 4rem)" }}>
                            <Filters />
                          </ScrollArea>
                          <ScrollArea
                            className="w-full"
                            style={{ height: "calc(100vh - 8.2rem)" }}
                          >
                            <TableView />
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>
              </motion.div>
              {view === "list" && (
                <div className="w-1/2 h-full">
                  {current ? (
                    <ScrollArea style={{ height: "calc(100vh - 8.2rem)" }}>
                      <DocumentsLeverView lever={current} />
                    </ScrollArea>
                  ) : (
                    <NoListItem />
                  )}
                </div>
              )}
              <div className="absolute bottom-8 right-8 flex gap-4">
                <Button
                  onClick={() => exportBullseyeToXLSX()}
                  className="bg-linear-to-tr from-[#4b96d2] to-[#0a1e6e] text-white hover:bg-linear-to-r"
                >
                  <Sheet />
                  Export Table
                </Button>
                <Button
                  onClick={() => exportBullseyeToPDF()}
                  className="bg-linear-to-tr from-head to-hand text-white hover:bg-linear-to-r"
                >
                  <FileText />
                  Export Summary
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
  )
}
