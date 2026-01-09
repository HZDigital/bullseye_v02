// SVG utility functions for the bullseye/sunburst diagram

// Calculate coordinates on a circle based on angle and radius
export const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

// Create an SVG arc path
export const createArcPath = (
  centerX: number,
  centerY: number,
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
) => {
  const start = polarToCartesian(centerX, centerY, outerRadius, endAngle)
  const end = polarToCartesian(centerX, centerY, outerRadius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle)
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle)

  return [
    `M ${start.x} ${start.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    `L ${start.x} ${start.y}`,
  ].join(" ")
}

// Calculate text position based on angle and radius
export const getTextPosition = (centerX: number, centerY: number, angle: number, radius: number) => {
  return polarToCartesian(centerX, centerY, radius, angle)
}

// Flatten the data structure to get all outer segments in sequence
export const getAllOuterSegments = (data: any) => {
  const allOuterSegments: Array<{
    title: string
    parentTitle: string
    parentIndex: number
    outerIndex: number
  }> = []

  data.inner.forEach((segment: any, parentIndex: number) => {
    segment.outer.forEach((outerSegment: any, outerIndex: number) => {
      allOuterSegments.push({
        title: outerSegment.title,
        parentTitle: segment.title,
        parentIndex,
        outerIndex,
      })
    })
  })

  return allOuterSegments
}

// Function to wrap text for SVG text elements
export const wrapText = (text: string, maxWidth: number, fontSize: number) => {
  // Estimate characters per line (rough approximation)
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6))

  // If text is short enough, return as is
  if (text.length <= charsPerLine) {
    return [text]
  }

  // Split into words
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const testLine = `${currentLine} ${word}`

    // If adding this word exceeds our line length estimate
    if (testLine.length > charsPerLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  // Add the last line
  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

