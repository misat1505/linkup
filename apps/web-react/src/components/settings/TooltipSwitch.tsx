import useLocalStorage from "use-local-storage";
import { Switch } from "../ui/switch";
import Tooltip from "../common/Tooltip";

export default function TooltipSwitch() {
  const [showTooltips, setShowTooltips] = useLocalStorage(
    "show-tooltips",
    true
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
