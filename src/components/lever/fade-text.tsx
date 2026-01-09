interface FadeTextProps {
  text: string
  className?: string
}

export default function FadeText({ text, className = "" }: FadeTextProps) {
  return (
    <div className={className}>
      <span className="text-xs text-muted-foreground">{text.slice(0, 192)}...</span>
    </div>
  )
}