import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SearchOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  searchOptions: SearchOption[];
  searchType: string;
  searchValue: string;
  onSearchTypeChange: (value: string) => void;
  onSearchValueChange: (value: string) => void;
  placeholder?: string;
  customStyle?: string;
}

export function SearchBar({
  searchOptions,
  searchType,
  searchValue,
  onSearchTypeChange,
  onSearchValueChange,
  placeholder = "Tìm kiếm",
  customStyle,
}: SearchBarProps) {
  return (
    <div
      className={`sm:w-[500px] flex items-center border rounded-lg h-12 sm:mx-auto pr-3 overflow-hidden mx-3 ${customStyle}`}
    >
      <Select value={searchType} onValueChange={onSearchTypeChange}>
        <SelectTrigger className="w-[240px] border-0 border-r pl-3 rounded-none focus:outline-none focus:ring-0">
          <SelectValue placeholder="Tìm kiếm theo" />
        </SelectTrigger>
        <SelectContent className="bg-white cursor-pointer">
          <SelectGroup>
            <SelectLabel>Loại</SelectLabel>
            {searchOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer hover:bg-gray-300"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full h-full ml-1 py-2 text-bodyLg border-none rounded-none focus-visible:outline-none focus-visible:ring-0"
        value={searchValue}
        onChange={(e) => onSearchValueChange(e.target.value)}
      />
      <div className="h-8 w-8 ml-2.5">
        <svg
          className="h-full w-full text-gray-400 cursor-pointer"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>
  );
}
