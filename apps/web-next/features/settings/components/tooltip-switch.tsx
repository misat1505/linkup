import Tooltip from "@/components/shared/tooltip";
import { Switch } from "@/components/ui/switch";
import useLocalStorage from "use-local-storage";

export default function TooltipSwitch() {
  const [showTooltips, setShowTooltips] = useLocalStorage(
    "show-tooltips",
    true,
  );

  const tooltipText = showTooltips ? "Hide tooltips" : "Show tooltips";

  const toggleTooltips = () => setShowTooltips((prev) => !prev);

  return (
    <Tooltip content={tooltipText}>
      <span>
        <Switch onClick={toggleTooltips} checked={showTooltips} />
      </span>
    </Tooltip>
  );
}
