"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import classNames from "classnames"

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps {
  value?: string
  onChange?: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  className?: string
  selectClassName?: string
  disabled?: boolean
}

export const CommonSelect = ({
  value,
  onChange,
  options,
  selectClassName,
  placeholder = "Chọn loại bài viết",
  className = "w-full max-w-sm",
  disabled = false,
}: SelectProps) => {
  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={classNames("w-full", selectClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options && options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

