import { Button } from "@/components/ui/button"
import { GalleryVertical, Rows4 } from "lucide-react"

interface ToggleViewProps {
  setView: (view: "list" | "table") => void
  view: "list" | "table"
}

export default function ToggleView({ setView, view }: ToggleViewProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => setView("table")}
        className={view === "table" ? "bg-muted text-foreground" : ""}
        aria-label="Table view"
      >
        <Rows4 className="h-4 w-4" />
        <span>Table</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => setView("list")}
        className={view === "list" ? "bg-muted text-foreground" : ""}
        aria-label="List view"
      >
        <GalleryVertical className="h-4 w-4" />
        <span>List</span>
      </Button>
    </div>
  )
}

//  variant={view === "table" ? "default" : "ghost"}
//  variant={view === "list" ? "default" : "ghost"}