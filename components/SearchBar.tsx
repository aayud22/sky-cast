import { Search } from "lucide-react";

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

      <div className="flex items-center gap-2">
        {searchValue && (
          <>
            <Search
              onClick={() => onSearch && onSearch(searchValue)}
              className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
            />
          </>
        )}
      </div>
    </div>
  );
}
