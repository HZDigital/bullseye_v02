import type { DocLever } from "@/components/data/lever-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CategoryIcons from "@/components/lever/category-icons";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBullseyeStore } from "@/stores/bullseyeStore";
import SectionBadge from "@/components/lever/section-badge";


interface ListItemCardProps {
  lever: DocLever
  onRemove: (title: string) => void
  toggleLever: (lever: DocLever) => void
}

export default function ListItemCard({ lever, onRemove, toggleLever }: ListItemCardProps) {
  const { filterCategories } = useBullseyeStore();

  const handleCardClick = (lever: DocLever) => {
    toggleLever(lever)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    // Stop event propagation to prevent the card click handler from firing
    e.stopPropagation()
    onRemove(lever.id)
  }

  return (
      <Card className="overflow-hidden py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => handleCardClick(lever)}>
        <CardHeader className="-mb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-sm">{lever.title}</CardTitle>
              <div className="flex h-fit gap-4 items-center">
              <SectionBadge section={lever.section} />
                <CategoryIcons selectedCategories={filterCategories} categories={lever.categories} size="sm" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-transparent hover:text-destructive"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs"><span>{lever.definition.slice(0, 128)}...</span></CardContent>
      </Card>
  )
}