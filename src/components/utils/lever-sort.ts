import type { DocLever } from "@/components/data/lever-data"
import type { SelectedDimension } from "@/stores/bullseyeStore"

// Types for KPIs to match the store structure
interface KPIs {
  valueCreation: string[]
  sustainability: string[]
  resilience: string[]
}

/**
 * Filter and sort levers for a specific dimension
 */
export function getRelevantLevers({
  levers,
  selectedDimension,
  calculateLeverWeight,
  selectedCategories,
  kpis,
}: {
  levers: DocLever[]
  selectedDimension: SelectedDimension | null
  calculateLeverWeight: (lever: DocLever) => number
  selectedCategories: string[]
  kpis: KPIs
}): DocLever[] {
  if (!selectedDimension) return []

  // Filter levers by dimension
  let filteredLevers = levers.filter(
    (lever) => lever.section === selectedDimension.section && lever.dimension === selectedDimension.dimension,
  )

  // Apply KPI filtering
  filteredLevers = filterLeversByKpis(filteredLevers, kpis)

  // Sort levers by weight and category matches
  return sortLeversCompletlyKPIsFirst(filteredLevers, calculateLeverWeight, selectedCategories, kpis)
}

/**
 * Sort levers by all of the needed criteria
 */

export function sortLeversCompletlyWeightFirst(
  levers: DocLever[],
  calculateLeverWeight: (lever: DocLever) => number,
  selectedCategories: string[],
  kpis: KPIs
): DocLever[] {

  const kpisSelected = kpis.valueCreation.length > 0 || kpis.sustainability.length > 0 || kpis.resilience.length > 0

  // Pre-process each lever to gather sorting metrics.
  const processedLevers = levers.map(lever => {
    const leverCategories = lever.categories || []
    const matchCount = leverCategories.filter(category =>
      selectedCategories.includes(category)
    ).length
    const onlySelectedCategories = selectedCategories.length > 0 
      ? (matchCount === leverCategories.length && matchCount > 0)
      : false
    const weight = calculateLeverWeight(lever)
    const kpiMatches = countMatchingKpis(lever, kpis)
    
    return { lever, matchCount, onlySelectedCategories, weight, kpiMatches }
  })

  // Sort levers with combined criteria:
  // 1. If filtering by categories, prioritize levers having only selected categories.
  // 2. Then sort by matchCount (if applicable).
  // 3. Then by weight.
  // 4. Finally, sort by KPI matches.
  const sortedLevers = processedLevers.sort((a, b) => {
    if (selectedCategories.length > 0) {
      if (a.onlySelectedCategories && !b.onlySelectedCategories) return -1
      if (!a.onlySelectedCategories && b.onlySelectedCategories) return 1
      
      if (a.matchCount !== b.matchCount) return b.matchCount - a.matchCount
    }

    if (a.weight !== b.weight) return b.weight - a.weight

    if (kpisSelected) {
      if (a.kpiMatches !== b.kpiMatches) return b.kpiMatches - a.kpiMatches
    }

    return 0
  }).map(item => item.lever)

  return sortedLevers
}

export function sortLeversCompletlyKPIsFirst(
  levers: DocLever[],
  calculateLeverWeight: (lever: DocLever) => number,
  selectedCategories: string[],
  kpis: KPIs
): DocLever[] {
  // Determine if any KPIs have been selected for sorting.
  const kpisSelected = kpis.valueCreation.length > 0 || kpis.sustainability.length > 0 || kpis.resilience.length > 0

  // Pre-process each lever to gather sorting metrics.
  const processedLevers = levers.map(lever => {
    const leverCategories = lever.categories || []
    const matchCount = leverCategories.filter(category =>
      selectedCategories.includes(category)
    ).length
    const onlySelectedCategories = selectedCategories.length > 0 
      ? (matchCount === leverCategories.length && matchCount > 0)
      : false
    const weight = calculateLeverWeight(lever)
    const kpiMatches = countMatchingKpis(lever, kpis)
    
    return { lever, matchCount, onlySelectedCategories, weight, kpiMatches }
  })

  // Sort levers with combined criteria:
  // 1. If filtering by categories, prioritize levers having only selected categories.
  // 2. Then sort by matchCount (if applicable).
  // 3. If KPIs are selected, sort by KPI matches.
  // 4. Then sort by weight.
  const sortedLevers = processedLevers.sort((a, b) => {
    if (selectedCategories.length > 0) {
      if (a.onlySelectedCategories && !b.onlySelectedCategories) return -1
      if (!a.onlySelectedCategories && b.onlySelectedCategories) return 1
      
      if (a.matchCount !== b.matchCount) return b.matchCount - a.matchCount
    }

    if (kpisSelected) {
      if (a.kpiMatches !== b.kpiMatches) return b.kpiMatches - a.kpiMatches
    }

    if (a.weight !== b.weight) return b.weight - a.weight

    return 0
  }).map(item => item.lever)

  return sortedLevers
}

/**
 * Filter levers based on selected KPIs
 */
function filterLeversByKpis(levers: DocLever[], kpis: KPIs): DocLever[] {
  const hasSelectedKpis = kpis.valueCreation.length > 0 || kpis.sustainability.length > 0 || kpis.resilience.length > 0

  if (!hasSelectedKpis) {
    return levers
  }

  // Define the KPI options in the same order as they appear in the data
  const VALUE_CREATION_OPTIONS = ["PPC", "MCP", "VAM", "CTG", "ANR"]
  const SUSTAINABILITY_OPTIONS = ["CO2", "Circularity rating", "CoC adherence", "Supplier risk score"]
  const RESILIENCE_OPTIONS = ["OTIF", "AVG Lead Time", "Safety Stock", "% single-source supplier"]

  return levers.filter((lever) => {
    // Skip levers without KPIs
    if (!lever.kpis) return false

    let hasMatchingKpi = false

    // Check value creation KPIs
    if (kpis.valueCreation.length > 0 && lever.kpis.value_creation) {
      for (const selectedKpi of kpis.valueCreation) {
        const index = VALUE_CREATION_OPTIONS.indexOf(selectedKpi)
        if (index >= 0 && index < lever.kpis.value_creation.length && lever.kpis.value_creation[index] === true) {
          hasMatchingKpi = true
          break
        }
      }
    }

    // Check sustainability KPIs (only if no match found yet)
    if (!hasMatchingKpi && kpis.sustainability.length > 0 && lever.kpis.sustainability) {
      for (const selectedKpi of kpis.sustainability) {
        const index = SUSTAINABILITY_OPTIONS.indexOf(selectedKpi)
        if (index >= 0 && index < lever.kpis.sustainability.length && lever.kpis.sustainability[index] === true) {
          hasMatchingKpi = true
          break
        }
      }
    }

    // Check resilience KPIs (only if no match found yet)
    if (!hasMatchingKpi && kpis.resilience.length > 0 && lever.kpis.resilience) {
      for (const selectedKpi of kpis.resilience) {
        const index = RESILIENCE_OPTIONS.indexOf(selectedKpi)
        if (index >= 0 && index < lever.kpis.resilience.length && lever.kpis.resilience[index] === true) {
          hasMatchingKpi = true
          break
        }
      }
    }

    return hasMatchingKpi
  })
}

/**
 * Count matching KPIs for a lever
 */
function countMatchingKpis(lever: DocLever, kpis: KPIs): number {
  const VALUE_CREATION_OPTIONS = ["PPC", "MCP", "VAM", "CTG", "ANR"]
  const SUSTAINABILITY_OPTIONS = ["CO2", "Circularity rating", "CoC adherence", "Supplier risk score"]
  const RESILIENCE_OPTIONS = ["OTIF", "AVG Lead Time", "Safety Stock", "% single-source supplier"]

  let count = 0

  if (lever.kpis) {
    // Count value creation KPIs
    if (kpis.valueCreation.length > 0 && lever.kpis.value_creation) {
      for (const selectedKpi of kpis.valueCreation) {
        const index = VALUE_CREATION_OPTIONS.indexOf(selectedKpi)
        if (index >= 0 && index < lever.kpis.value_creation.length && lever.kpis.value_creation[index] === true) {
          count++
        }
      }
    }

    // Count sustainability KPIs
    if (kpis.sustainability.length > 0 && lever.kpis.sustainability) {
      for (const selectedKpi of kpis.sustainability) {
        const index = SUSTAINABILITY_OPTIONS.indexOf(selectedKpi)
        if (index >= 0 && index < lever.kpis.sustainability.length && lever.kpis.sustainability[index] === true) {
          count++
        }
      }
    }

    // Count resilience KPIs
    if (kpis.resilience.length > 0 && lever.kpis.resilience) {
      for (const selectedKpi of kpis.resilience) {
        const index = RESILIENCE_OPTIONS.indexOf(selectedKpi)
        if (index >= 0 && index < lever.kpis.resilience.length && lever.kpis.resilience[index] === true) {
          count++
        }
      }
    }
  }

  return count
}

/**
 * Get top recommended levers across all dimensions
 */
export function getTopRecommendedLevers({
  levers,
  calculateLeverWeight,
  selectedCategories,
  kpis,
  limit = 10,
}: {
  levers: DocLever[]
  calculateLeverWeight: (lever: DocLever) => number
  selectedCategories: string[]
  kpis: KPIs
  limit?: number
}): DocLever[] {
  // Apply KPI filtering across all levers
  const filteredLevers = filterLeversByKpis(levers, kpis)

  // Sort levers using the complete sorting function that handles KPIs
  const sortedLevers = sortLeversCompletlyKPIsFirst(filteredLevers, calculateLeverWeight, selectedCategories, kpis)

  // Return the top N levers
  return sortedLevers.slice(0, limit)
}