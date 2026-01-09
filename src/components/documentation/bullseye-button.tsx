import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Goal, Target } from "lucide-react"
import { navigateWithRedirect } from "@/lib/redirect-base-url"
import { useNavigate } from "react-router-dom"

export default function BullseyeButton() {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <Button 
      variant="outline" 
      onClick={() => navigateWithRedirect("/", navigate)} 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      >
      {hovered ? <Goal /> : <Target />}
      <span>Bullseye</span>
    </Button>
  )
}