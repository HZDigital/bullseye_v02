import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookMarked, BookOpen } from "lucide-react"
import { navigateWithRedirect } from "@/lib/redirect-base-url"
import { useNavigate } from "react-router-dom"

export default function DocumentsButton() {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()


  return (
    <Button variant="outline"
      onClick={() => navigateWithRedirect("/docs", navigate)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? <BookOpen className="scale-110" /> : <BookMarked />}
      <span>Collection</span>
    </Button>
  )
}