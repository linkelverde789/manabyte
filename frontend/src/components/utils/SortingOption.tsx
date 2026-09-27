import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SortingOption({
  sort,
  onSort,
}: {
  sort: string;
  onSort: (sort: string) => void;
}) {
  return (
    <Select value={sort} onValueChange={onSort}>
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="recent">Recently added</SelectItem>
        <SelectItem value="name">Name</SelectItem>
        <SelectItem value="quantity">Quantity</SelectItem>
        <SelectItem value="price">Price</SelectItem>
      </SelectContent>
    </Select>
  );
}
