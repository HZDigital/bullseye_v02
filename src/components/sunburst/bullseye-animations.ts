"use client"

import { useEffect, useState } from "react"

// Custom hook to manage the animation of outer segments
export const useSegmentAnimation = (totalSegments: number, initialDelay = 0, segmentDelay = 300) => {
  const [visibleSegments, setVisibleSegments] = useState<number>(0)

  useEffect(() => {
    // Start with no segments visible
    setVisibleSegments(0)

    // Initial delay before starting animations
    const initialTimer = setTimeout(() => {
      // Animate each segment one by one
      const animateSegments = (currentSegment: number) => {
        if (currentSegment <= totalSegments) {
          setVisibleSegments(currentSegment)

          // Schedule the next segment animation
          setTimeout(() => {
            animateSegments(currentSegment + 1)
          }, segmentDelay)
        }
      }

      // Start the animation sequence
      animateSegments(1)
    }, initialDelay)

    // Clean up timers on unmount
    return () => {
      clearTimeout(initialTimer)
    }
  }, [totalSegments, initialDelay, segmentDelay])

  return visibleSegments
}

// Calculate opacity for animated segments
export const getSegmentOpacity = (segmentIndex: number, visibleSegments: number, isHovered: boolean) => {
  if (segmentIndex < visibleSegments) {
    return isHovered ? 1 : 0.8
  }
  return 0
}

// Calculate transform for animated segments
export const getSegmentTransform = (
  segmentIndex: number,
  visibleSegments: number,
  centerX: number,
  centerY: number,
) => {
  if (segmentIndex < visibleSegments) {
    return ""
  }
  return `translate(${centerX - centerX * 0.9} ${centerY - centerY * 0.9}) scale(0.8)`
}

