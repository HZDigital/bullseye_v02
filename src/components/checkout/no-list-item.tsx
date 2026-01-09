import { Card } from "@/components/ui/card";
import { MousePointerClick } from "lucide-react";

export default function NoListItem() {
  return (
    <div className="w-full flex items-center justify-center" style={{ height: "calc(100vh - 3.2rem)" }}>
      <div className="flex flex-col items-center pb-20 gap-4">
        <Card className="px-16 py-4">
          <MousePointerClick className="" />
        </Card>
        <span className="text-sm text-muted-foreground">Select a lever to see detailed information.</span>
      </div>
    </div>
  )
}