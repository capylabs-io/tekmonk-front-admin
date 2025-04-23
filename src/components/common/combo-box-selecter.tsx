"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
  value: string;
  label: string;
};

interface ComboBoxSelectorProps {
  data: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  error?: string;
}

export const ComboboxSelector = ({
  data = [],
  value,
  onChange,
  placeholder = "Chọn loại hành động",
  searchPlaceholder = "Tìm kiếm loại hành động...",
  className,
  error,
}: ComboBoxSelectorProps) => {
  const [open, setOpen] = React.useState(false);

  // Safely access data
  const options = React.useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between w-full h-[50px] rounded-xl bg-grey-50 border border-grey-300",
              !value && "text-gray-500",
              className
            )}
          >
            {value
              ? options.find((option) => option.value === value)?.label ||
                placeholder
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 flex-1 w-[430px]"
          align="start"
          sideOffset={4}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2 px-4 w-full"
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-BodySm mt-1">{error}</p>}
    </div>
  );
};
