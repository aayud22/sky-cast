import { CircleX, Search } from "lucide-react";

interface SearchBarProps {
  searchValue: string;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  setSearchValue: (value: string) => void;
}

export default function SearchBar({
  onClear,
  onSearch,
  searchValue,
  setSearchValue,
}: SearchBarProps) {
  return (
    <div className="flex items-center bg-secondary rounded-full px-3.5 w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transition-all py-1">
      <Search className="w-5 h-5 text-muted-foreground" />

      <input
        type="text"
        value={searchValue}
        placeholder="Search your location"
        onChange={(e) => {
          if (e.target.value === "") {
            if (onClear) onClear();
          }
          setSearchValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSearch) {
            onSearch(e.currentTarget.value);
          }
        }}
        className="bg-transparent outline-none border-none text-base font-normal focus:ring-0 flex-1 placeholder:text-muted-foreground px-2 min-w-0"
      />

      {searchValue && (
        <CircleX
          onClick={() => {
            setSearchValue("");
            if (onClear) onClear();
          }}
          className="w-5 h-5 cursor-pointer transition-colors hover:text-primary"
        />
      )}
    </div>
  );
}
