import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryIcons from "@/components/lever/category-icons"
import type { DocLever } from "@/components/data/lever-data"
import SectionBadge from "../lever/section-badge"

interface DocumentsMenuItemProps {
  lever: DocLever
  filterCategories: string[]
  setLever?: (lever: DocLever) => void
}

export default function DocumentsMenuItem({ lever, filterCategories, setLever }: DocumentsMenuItemProps) {
  const handleCardClick = () => {
    if (setLever) {
      setLever(lever)
    }
  }

  return (
    <>
      <Card
        className="overflow-hidden py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => handleCardClick()}
      >
        <CardHeader className="-mb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-sm">{lever.title}</CardTitle>
              <div className="flex h-fit gap-4 items-center">
                <SectionBadge section={lever.section} />
                <CategoryIcons selectedCategories={filterCategories} categories={lever.categories} size="sm" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          <span>{lever.definition.slice(0, 128)}...</span>
        </CardContent>
      </Card>
    </>
  )
}