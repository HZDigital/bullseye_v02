import { useEffect, useState, useRef } from "react"
import { createArcPath, getTextPosition, wrapText } from "./bullseye-utils"
import { useSegmentAnimation } from "./bullseye-animations"
import { type SelectedDimension, useBullseyeStore } from "@/stores/bullseyeStore"
import { LEVER_DATA, sectionColors } from "@/components/data/lever-data"
import { Expand } from "lucide-react"

// Helper function to get unique sections from the data
const getSections = () => {
  return [...new Set(LEVER_DATA.map((lever) => lever.section))]
}

// Helper function to get dimensions for each section
const getDimensionsForSection = (section: string) => {
  return [...new Set(LEVER_DATA.filter((lever) => lever.section === section).map((lever) => lever.dimension))]
}

// Helper function to get all outer segments (dimensions) from the data structure
const getAllOuterSegments = () => {
  const allOuterSegments: Array<{
    title: string
    section: string
    dimension: string
  }> = []

  const sections = getSections()

  sections.forEach((section) => {
    const dimensions = getDimensionsForSection(section)
    dimensions.forEach((dimension) => {
      allOuterSegments.push({
        title: dimension,
        section: section,
        dimension: dimension,
      })
    })
  })

  return allOuterSegments
}

// Update the Bullseye component to include badges
export default function Bullseye() {
  const {
    activeSegment,
    isOuterVisible,
    initialAnimationComplete,
    containerAnimationProgress,
    selectedDimension,
    setActiveSegment,
    toggleCategory,
    toggleOuterVisibility,
    setInitialAnimationComplete,
    setContainerAnimationProgress,
    updateAnimationProgress,
    setSelectedDimension,
    setSelectedCategories,
    getCurrentSelectedCategories,
    badgeVisible,
    getLeversCountInDimension,
  } = useBullseyeStore()

  // State to track badge animations
  const [animatingBadges, setAnimatingBadges] = useState<Record<string, boolean>>({})

  // Ref to store previous counts for comparison
  const prevCountsRef = useRef<Record<string, number>>({})

  // Get all outer segments for tracking badge animations
  const allOuterSegments = getAllOuterSegments()

  // Initialize previous counts on mount
  useEffect(() => {
    const initialCounts: Record<string, number> = {}
    allOuterSegments.forEach((segment) => {
      const key = `${segment.section}-${segment.dimension}`
      initialCounts[key] = getLeversCountInDimension(segment.section, segment.dimension)
    })
    prevCountsRef.current = initialCounts
  }, []) // Only run once on mount

  // Track cart changes to trigger badge animations
  useEffect(() => {
    // Create a map of current dimension counts
    const currentCounts: Record<string, number> = {}
    const changedBadges: Record<string, boolean> = {}

    // For each outer segment, check if its count has changed
    allOuterSegments.forEach((segment) => {
      const key = `${segment.section}-${segment.dimension}`
      const currentCount = getLeversCountInDimension(segment.section, segment.dimension)
      currentCounts[key] = currentCount

      // Compare with previous count
      if (prevCountsRef.current[key] !== currentCount) {
        changedBadges[key] = true
      }
    })

    // Update animation state only for changed badges
    if (Object.keys(changedBadges).length > 0) {
      setAnimatingBadges(changedBadges)

      // Store the new counts as previous for next comparison
      prevCountsRef.current = { ...currentCounts }

      // Clear animations after a delay
      const timer = setTimeout(() => {
        setAnimatingBadges({})
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [useBullseyeStore.getState().getCurrentCartItems()]) // Re-run when cart items change

  // Get current variant's selected categories
  const selectedCategories = getCurrentSelectedCategories()

  // Get all sections (previously categories)
  const sections = getSections()

  // Calculate total segments in inner circle
  const totalInnerSegments = sections.length

  // Calculate angles for equal distribution
  const anglePerInnerSegment = 360 / totalInnerSegments

  // Offset angle to start from top (180 degrees)
  const startOffset = 180

  // SVG dimensions
  const svgSize = 700
  const centerX = svgSize / 2
  const centerY = svgSize / 2

  // Radii with center circle
  const centerRadius = 60
  const padding = 20
  const innerRadius = centerRadius + padding
  const outerThickness = 100 // Increased thickness for outer circle
  const containerRadius = innerRadius + 80 + outerThickness + 20 // Additional container circle radius

  // Get all outer segments for animation
  const totalOuterSegments = allOuterSegments.length

  // Animation state for outer segments
  const visibleSegments = useSegmentAnimation(totalOuterSegments, 1500, 300)

  // Animation timing constants
  const initialDelay = 1500 // Same as outer segments
  const segmentDelay = 300 // Same as outer segments

  // Container circle animation synchronized with outer segments
  useEffect(() => {
    if (initialAnimationComplete) return

    // Start the animation after the same initial delay as the outer segments
    const timer = setTimeout(() => {
      const startTime = Date.now()

      const animateContainer = () => {
        const elapsed = Date.now() - startTime

        // Calculate progress based on the same timing as the outer segments
        // This ensures the container fills at the same rate as segments appear
        const progress = Math.min(elapsed / (totalOuterSegments * segmentDelay), 1)
        setContainerAnimationProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animateContainer)
        }
      }

      requestAnimationFrame(animateContainer)
    }, initialDelay)

    return () => clearTimeout(timer)
  }, [initialAnimationComplete, totalOuterSegments, segmentDelay, setContainerAnimationProgress])

  // Set initial animation complete after all segments are visible
  useEffect(() => {
    if (visibleSegments >= totalOuterSegments && containerAnimationProgress >= 1 && !initialAnimationComplete) {
      setInitialAnimationComplete(true)
    }
  }, [
    visibleSegments,
    totalOuterSegments,
    containerAnimationProgress,
    initialAnimationComplete,
    setInitialAnimationComplete,
  ])

  // Update visible categories based on container animation progress
  useEffect(() => {
    if (initialAnimationComplete) {
      // After animation is complete, all sections are visible
      updateAnimationProgress(sections)
      return
    }

    // Calculate which sections are currently visible based on animation progress
    const filledAngle = containerAnimationProgress * 360
    const newVisibleCategories: string[] = []

    sections.forEach((section, index) => {
      const sectionStartAngle = index * anglePerInnerSegment
      // If the filled angle has reached this section's start angle, it should be visible
      if (filledAngle > sectionStartAngle) {
        newVisibleCategories.push(section)
      }
    })

    updateAnimationProgress(newVisibleCategories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerAnimationProgress, initialAnimationComplete, anglePerInnerSegment, updateAnimationProgress])

  // Function to handle segment hover
  let scaleIcon = false
  const handleSegmentHover = (title: string) => {
    if (!initialAnimationComplete) return
    setActiveSegment(title)
    if (title === "center") {
      scaleIcon = true
    }
  }

  // Function to handle mouse leave
  const handleMouseLeave = () => {
    if (!initialAnimationComplete) return
    setActiveSegment(null)
    scaleIcon = false
  }

  // Function to handle inner circle click
  const handleInnerCircleClick = (title: string) => {
    // Block clicks during initial animation
    if (!initialAnimationComplete) return

    // Clear selected subcategory when clicking on inner circle
    setSelectedDimension(null)
    toggleCategory(title)
  }

  // Function to handle outer segment click
  const handleOuterSegmentClick = (subcategory: SelectedDimension) => {
    // Block clicks during initial animation
    if (!initialAnimationComplete) return

    // Toggle subcategory selection
    if (
      selectedDimension &&
      selectedDimension.title === subcategory.title &&
      selectedDimension.section === subcategory.section
    ) {
      // If clicking the same subcategory, deselect it
      setSelectedDimension(null)
    } else {
      // Otherwise, select the new subcategory
      setSelectedDimension(subcategory)

      // Ensure the parent section is selected (if not already)
      if (!selectedCategories.includes(subcategory.section)) {
        // Instead of toggling, directly add this section to the selected categories
        const newSelectedCategories = [...selectedCategories, subcategory.section]
        // We need to update the selectedCategories state directly instead of using toggleCategory
        // to avoid the toggle behavior that might deselect the category
        setSelectedCategories(newSelectedCategories)
      }
    }
  }

  // Function to reset the view to initial state
  const handleResetView = () => {
    // Block clicks during initial animation
    if (!initialAnimationComplete) return

    // Clear selected subcategory
    setSelectedDimension(null)

    // Clear selected categories
    setSelectedCategories([])

    // Ensure outer segments are visible
    if (!isOuterVisible) {
      toggleOuterVisibility()
    }
  }

  // Function to get color with opacity
  const getColorWithOpacity = (color: string, opacity: number) => {
    // For hex colors
    if (color.startsWith("#")) {
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
    // For CSS variables or other formats, return as is with opacity
    return color
  }

  // Function to determine if an outer segment should be visible
  const isOuterSegmentVisible = (section: string, segmentIndex: number) => {
    // During initial animation, follow the animation sequence
    if (!initialAnimationComplete) {
      return segmentIndex < visibleSegments
    }

    // After initial animation, check if outer circle is visible and if segment belongs to any selected category
    return isOuterVisible && (selectedCategories.length === 0 || selectedCategories.includes(section))
  }

  // Function to determine if a section container should be visible
  const isSectionContainerVisible = (section: string, index: number) => {
    // During initial animation, show based on animation progress
    if (!initialAnimationComplete) {
      // Calculate the angle range for this section
      const sectionStartAngle = index * anglePerInnerSegment
      const sectionEndAngle = (index + 1) * anglePerInnerSegment

      // Calculate how much of the circle has been filled (0 to 360 degrees)
      const filledAngle = containerAnimationProgress * 360

      // If the filled angle is past the start of this section
      if (filledAngle > sectionStartAngle) {
        // If the filled angle is past the end of this section, show fully
        if (filledAngle >= sectionEndAngle) {
          return true
        }
        // Otherwise, this section is partially filled
        return true
      }
      return false
    }

    // After initial animation, check if outer circle is visible and if section is selected
    return isOuterVisible && (selectedCategories.length === 0 || selectedCategories.includes(section))
  }

  // Calculate the end angle for the container animation
  const getContainerEndAngle = (index: number) => {
    if (initialAnimationComplete) {
      return startOffset + (index + 1) * anglePerInnerSegment
    }

    // During animation, calculate how much of this segment should be shown
    const sectionStartAngle = index * anglePerInnerSegment
    const sectionEndAngle = (index + 1) * anglePerInnerSegment
    const filledAngle = containerAnimationProgress * 360

    if (filledAngle <= sectionStartAngle) {
      // This segment hasn't started filling yet
      return startOffset + index * anglePerInnerSegment
    } else if (filledAngle >= sectionEndAngle) {
      // This segment is completely filled
      return startOffset + (index + 1) * anglePerInnerSegment
    } else {
      // This segment is partially filled
      return startOffset + index * anglePerInnerSegment + (filledAngle - sectionStartAngle)
    }
  }

  // Calculate which segments should be visible based on container progress
  const getSegmentVisibilityFromContainer = (segmentIndex: number) => {
    if (initialAnimationComplete) return true

    // Map segment index to section and dimension
    let currentSectionIndex = 0
    let segmentCounter = 0

    for (let i = 0; i < sections.length; i++) {
      const dimensionsInSection = getDimensionsForSection(sections[i]).length
      if (segmentIndex < segmentCounter + dimensionsInSection) {
        currentSectionIndex = i
        break
      }
      segmentCounter += dimensionsInSection
    }

    // Calculate how far through this section we should be
    const sectionStartAngle = currentSectionIndex * anglePerInnerSegment
    const sectionEndAngle = (currentSectionIndex + 1) * anglePerInnerSegment
    const sectionAngleRange = sectionEndAngle - sectionStartAngle

    // Calculate the segment's position within its section
    const segmentPosition = segmentIndex - segmentCounter
    const segmentsInSection = getDimensionsForSection(sections[currentSectionIndex]).length
    const segmentStartPercent = segmentPosition / segmentsInSection

    // Calculate the angles for this segment within the section
    const segmentStartAngle = sectionStartAngle + sectionAngleRange * segmentStartPercent

    // Calculate how much of the circle has been filled (0 to 360 degrees)
    const filledAngle = containerAnimationProgress * 360

    // If the filled angle has reached this segment's start angle, it should be visible
    return filledAngle >= segmentStartAngle
  }

  // Check if a subcategory is selected
  const isSubcategorySelected = (title: string, section: string) => {
    return selectedDimension !== null && selectedDimension.title === title && selectedDimension.section === section
  }

  // Map sections to their dimensions for rendering
  const sectionDimensionsMap = sections.reduce(
    (acc, section) => {
      acc[section] = getDimensionsForSection(section)
      return acc
    },
    {} as Record<string, string[]>,
  )

  // Inside the render function, update the outer segments rendering to include badges
  return (
    <div className="flex justify-center items-center w-full h-full">
      <svg
        className="w-full h-full max-w-[700px] max-h-[700px]"
        viewBox="0 0 700 700"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Section container circles */}
        {sections.map((section, index) => {
          const startAngle = startOffset + index * anglePerInnerSegment
          const endAngle = getContainerEndAngle(index)
          const segmentColor = sectionColors[section as keyof typeof sectionColors]
          const isVisible = isSectionContainerVisible(section, index)

          return (
            <g
              key={`container-${index}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              <path
                d={createArcPath(
                  centerX,
                  centerY,
                  startAngle,
                  endAngle,
                  innerRadius + 80 + outerThickness,
                  containerRadius,
                )}
                fill={getColorWithOpacity(segmentColor, 0.8)}
                stroke="var(--background)"
                strokeWidth={2}
                className="transition-colors duration-200"
              />
            </g>
          )
        })}

        {/* Outer segments with animation */}
        {allOuterSegments.map((outerSegment, segmentIndex) => {
          const { title, section, dimension } = outerSegment

          // Find the section index
          const sectionIndex = sections.indexOf(section)

          // Find the dimension index within its section
          const dimensionsInSection = sectionDimensionsMap[section]
          const dimensionIndex = dimensionsInSection.indexOf(dimension)

          const startAngle = startOffset + sectionIndex * anglePerInnerSegment

          // Calculate total dimensions in this section
          const totalDimensionsInSection = dimensionsInSection.length

          const outerAngleSize = anglePerInnerSegment / totalDimensionsInSection
          const outerStartAngle = startAngle + dimensionIndex * outerAngleSize
          const outerEndAngle = outerStartAngle + outerAngleSize
          const outerMidAngle = outerStartAngle + outerAngleSize / 2

          // Position text in the middle of the outer segment
          const outerTextPos = getTextPosition(centerX, centerY, outerMidAngle, innerRadius + 80 + outerThickness / 2)

          const isOuterActive = activeSegment === title
          const isSelected = isSubcategorySelected(title, section)

          // Use both the standard visibility check and the container-based check
          const isVisibleByStandard = isOuterSegmentVisible(section, segmentIndex)
          const isVisibleByContainer = getSegmentVisibilityFromContainer(segmentIndex)
          const isVisible = initialAnimationComplete ? isVisibleByStandard : isVisibleByStandard && isVisibleByContainer

          // Wrap text and determine if it needs multiple lines
          const textLines = wrapText(title, outerThickness - 20, 10)
          const isSingleLine = textLines.length === 1

          // Calculate animation properties
          const scale = isVisible ? 1 : 0.8
          const opacity = isVisible ? 1 : 0

          // Get the count of levers in this dimension
          const leverCount = getLeversCountInDimension(section, dimension)

          // Determine if badge should be visible
          const showBadge = badgeVisible && leverCount > 0 && isVisible

          // Calculate badge position - slightly above the text
          const badgePos = {
            x: outerTextPos.x,
            y: outerTextPos.y - (isSingleLine ? 15 : 25) - 5,
          }

          // Get animation state for this badge
          const badgeKey = `${section}-${dimension}`
          const isAnimating = animatingBadges[badgeKey] || false

          return (
            <g
              key={`outer-${sectionIndex}-${dimensionIndex}`}
              style={{
                opacity: opacity,
                transform: `scale(${scale})`,
                transformOrigin: `${centerX}px ${centerY}px`,
                transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
              }}
            >
              <path
                d={createArcPath(
                  centerX,
                  centerY,
                  outerStartAngle,
                  outerEndAngle,
                  innerRadius + 80,
                  innerRadius + 80 + outerThickness,
                )}
                fill="var(--muted)"
                stroke="var(--background)"
                strokeWidth={2}
                onMouseEnter={() => handleSegmentHover(title)}
                onMouseLeave={handleMouseLeave}
                onClick={() =>
                  handleOuterSegmentClick({
                    title,
                    section,
                    dimension,
                  })
                }
                className={`transition-colors duration-200 ${initialAnimationComplete ? "cursor-pointer" : "cursor-default"} focus:outline-none focus:ring-2 focus:ring-primary`}
                role="button"
                aria-label={title}
                aria-pressed={isSelected}
                tabIndex={isVisible && initialAnimationComplete ? 0 : -1}
              />

              {/* Badge showing lever count with animation */}
              {showBadge && (
                <g>
                  <circle
                    cx={badgePos.x}
                    cy={badgePos.y}
                    r={10}
                    fill={sectionColors[section as keyof typeof sectionColors] || "var(--primary)"}
                    className="drop-shadow-sm pointer-events-none select-none"
                    style={{
                      transform: isAnimating ? "scale(1.5)" : "scale(1)",
                      transformOrigin: `${badgePos.x}px ${badgePos.y}px`,
                      transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                  <text
                    x={badgePos.x}
                    y={badgePos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={10}
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                    style={{
                      transform: isAnimating ? "scale(1.2)" : "scale(1)",
                      transformOrigin: `${badgePos.x}px ${badgePos.y}px`,
                      transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {leverCount}
                  </text>
                </g>
              )}

              <text
                x={outerTextPos.x}
                y={outerTextPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--foreground)"
                fontSize={16}
                fontWeight={isOuterActive || isSelected ? "bold" : "normal"}
                className="pointer-events-none select-none"
              >
                {isSingleLine ? (
                  // Single line text - centered properly
                  <tspan x={outerTextPos.x} dy="0">
                    {textLines[0]}
                  </tspan>
                ) : (
                  // Multi-line text - adjust position for multiple lines
                  textLines.map((line, lineIndex) => (
                    <tspan
                      key={lineIndex}
                      x={outerTextPos.x}
                      dy={lineIndex === 0 ? "-0.5em" : "1.2em"}
                      textAnchor="middle"
                    >
                      {line}
                    </tspan>
                  ))
                )}
              </text>
            </g>
          )
        })}

        {/* Inner segments */}
        {sections.map((section, index) => {
          const startAngle = startOffset + index * anglePerInnerSegment
          const endAngle = startOffset + (index + 1) * anglePerInnerSegment
          const midAngle = startAngle + anglePerInnerSegment / 2

          // Adjust text position to be more centered in the segment
          const textRadius = innerRadius + 25
          const textPos = getTextPosition(centerX, centerY, midAngle, textRadius)

          const isActive = activeSegment === section
          const isSelected = selectedCategories.includes(section)
          const segmentColor = sectionColors[section as keyof typeof sectionColors]

          return (
            <g key={`inner-${index}`}>
              <path
                d={createArcPath(centerX, centerY, startAngle, endAngle, centerRadius, innerRadius + 80)}
                fill={getColorWithOpacity(segmentColor, 0.8)}
                stroke="var(--background)"
                strokeWidth={2}
                onMouseEnter={() => handleSegmentHover(section)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleInnerCircleClick(section)}
                className={`transition-colors duration-200 ${initialAnimationComplete ? "cursor-pointer" : "cursor-default"} focus:outline-none focus:ring-2 focus:ring-primary`}
                role="button"
                aria-label={`Select ${section}`}
                aria-pressed={isSelected}
                tabIndex={initialAnimationComplete ? 0 : -1}
              />
              <text
                x={textPos.x}
                y={textPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={16}
                fontWeight={isActive || isSelected ? "bold" : "normal"}
                className="pointer-events-none select-none"
              >
                {section}
              </text>
            </g>
          )
        })}

        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={centerRadius}
          fill="var(--muted)"
          stroke="var(--background)"
          strokeWidth={2}
          className={`${initialAnimationComplete ? "cursor-pointer" : "cursor-default"} focus:outline-none focus:ring-2 focus:ring-primary`}
          onClick={() => initialAnimationComplete && handleResetView()}
          onMouseEnter={() => handleSegmentHover("center")}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-label="Reset view"
          tabIndex={initialAnimationComplete ? 0 : -1}
        />
        {/* Add Expand icon to center */}
        {selectedCategories.length > 0 && (
          <Expand
            className="pointer-events-none"
            x={centerX - 12}
            y={centerY - 12}
            width={scaleIcon ? 32 : 24}
            height={scaleIcon ? 32 : 24}
            color="var(--foreground)"
          />
        )}
      </svg>
    </div>
  )
}