import { Input } from "../ui/input";

export function SearchingOption({
  term,
  onSearch,
}: {
  term: string;
  onSearch: (text: string) => void;
}) {
  return (
    <Input
      value={term}
      onChange={(event) => onSearch(event.target.value)}
      placeholder="Filter by name or set"
      className="max-w-xs"
    />
  );
}
