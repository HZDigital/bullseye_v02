import { Badge } from "@/components/ui/badge";
import { sectionColors } from "@/components/data/lever-data";

export default function SectionBadge({ section }: { section: string }) {
  return (
    <Badge
      className="text-white border-0 w-fit"
      style={{
        backgroundColor: sectionColors[section as keyof typeof sectionColors] ?? "#cccccc",
      }}
    >
      {section}
    </Badge>
  )
}