import { Checkbox } from "../ui/CheckBox";

export function GroupingOption({
  checked,
  onCheck,
}: {
  checked: boolean;
  onCheck: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="group-by-type"
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
      >
        <Checkbox
          id="group-by-type"
          checked={checked}
          onCheckedChange={(checked) => onCheck(!!checked)}
        />
        Group by type
      </label>
    </div>
  );
}
