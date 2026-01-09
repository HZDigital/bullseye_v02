import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronsUpDown, ChevronUp, Trash2 } from "lucide-react"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SectionBadge from "@/components/lever/section-badge"
import CategoryIcons from "@/components/lever/category-icons"
import WeightDisplay from "@/components/lever/weight-display"
import type { DocLever } from "@/components/data/lever-data"
import { motion } from "framer-motion"
import { useBullseyeStore } from "@/stores/bullseyeStore"

type SortColumn = "title" | "section" | "weight" | null
type SortDirection = "asc" | "desc"

export default function TableView() {
  const { removeFromCart, filterCategories, calculateLeverWeight, getCurrentCartItems } = useBullseyeStore()
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Get current variant's cart items
  const currentCartItems = getCurrentCartItems()

  const handleDeleteClick = (lever: DocLever, e: React.MouseEvent) => {
    // Stop event propagation to prevent the card click handler from firing
    e.stopPropagation()
    removeFromCart(lever.id)
  }

  const handleSort = (column: SortColumn) => {
    // Skip sorting for categories as requested
    if (column === "section" || column === "title" || column === "weight") {
      if (sortColumn === column) {
        // Toggle direction if clicking the same column
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        // Set new column and default to ascending
        setSortColumn(column)
        setSortDirection("asc")
      }
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  // Sort the cart items based on current sort settings
  const sortedItems = [...currentCartItems].sort((a, b) => {
    if (!sortColumn) return 0

    if (sortColumn === "title") {
      const comparison = a.title.localeCompare(b.title)
      return sortDirection === "asc" ? comparison : -comparison
    }

    if (sortColumn === "section") {
      // Using the first section for sorting
      const sectionA = a.section || ""
      const sectionB = b.section || ""
      const comparison = sectionA.localeCompare(sectionB)
      return sortDirection === "asc" ? comparison : -comparison
    }

    if (sortColumn === "weight") {
      // Assuming weight is a number from 1-3
      // You might need to adjust this based on your actual data structure
      const weightA = calculateLeverWeight(a) || 1
      const weightB = calculateLeverWeight(b) || 1

      const comparison = weightA - weightB
      return sortDirection === "asc" ? comparison : -comparison
    }

    return 0
  })

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 15,
      },
    },
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Table className="overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("title")} className="cursor-pointer hover:bg-muted">
              <div className="flex items-center">
                Title
                {getSortIcon("title")}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort("section")} className="cursor-pointer hover:bg-muted">
              <div className="flex items-center">
                Section
                {getSortIcon("section")}
              </div>
            </TableHead>
            <TableHead>Categories</TableHead>
            <TableHead onClick={() => handleSort("weight")} className="cursor-pointer hover:bg-muted">
              <div className="flex items-center">
                Strategic Fit
                {getSortIcon("weight")}
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody variants={tableVariants} initial="hidden" animate="visible">
          {sortedItems.map((lever) => (
            <motion.tr
              key={lever.title}
              variants={rowVariants}
              className="cursor-pointer"
              whileHover={{
                backgroundColor: "rgba(0,0,0,0.05)",
                transition: { duration: 0.1 },
              }}
            >
              <TableCell className="max-w-64 overflow-hidden">{lever.title}</TableCell>
              <TableCell>
                <SectionBadge section={lever.section} />
              </TableCell>
              <TableCell>
                <CategoryIcons categories={lever.categories} selectedCategories={filterCategories} size="sm" />
              </TableCell>
              <TableCell>
                <WeightDisplay lever={lever} />
              </TableCell>
              <TableCell>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(lever, e)}>
                    <Trash2 />
                  </Button>
                </motion.div>
              </TableCell>
            </motion.tr>
          ))}
        </motion.tbody>
      </Table>
    </motion.div>
  )
}