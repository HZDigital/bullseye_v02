import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from 'lucide-react';
import { useBullseyeStore } from "@/stores/bullseyeStore";

export default function BadgeVisibility() {
  const { badgeVisible, setBadgeVisible } = useBullseyeStore();

  const toggleBadgeVisibility = () => {
    setBadgeVisible(!badgeVisible);
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleBadgeVisibility}
      aria-label={badgeVisible ? "Hide lever count badges" : "Show lever count badges"}
      title={badgeVisible ? "Hide lever count badges" : "Show lever count badges"}
    >
      {badgeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );
}