interface MatchIndicatorProps {
  color?: string
  percent: number
}

export default function MatchIndicator({ color, percent }: MatchIndicatorProps) {
  const opacity = 0.2 + (percent / 100) * 0.8

  return (
    <div className="w-full h-2 bg-muted rounded-full border border-border">
      <div
        className={`h-full rounded-full ${color ? "" : "bg-foreground"}`}
        style={{
          width: `${percent}%`,
          backgroundColor: color ? color : undefined,
          opacity: opacity,
        }}
      />
    </div>
  )
}