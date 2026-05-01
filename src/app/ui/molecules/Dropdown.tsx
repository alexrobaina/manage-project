"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DropdownItem {
  id: string | number;
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  onSelectionChange?: (value: string | number, item: DropdownItem) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  placeholder = "Select an option",
  disabled = false,
  onSelectionChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === selectedValue);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    setSelectedValue(item.value);
    setIsOpen(false);
    onSelectionChange?.(item.value, item);
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 text-left bg-white border border-neutral-300 rounded-lg shadow-sm",
          "flex items-center justify-between",
          "text-sm text-neutral-900",
          "hover:border-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/20",
          "transition-colors duration-150",
          "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-neutral-900 ring-2 ring-neutral-900/20"
        )}
      >
        <span
          className={cn(
            selectedItem
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 dark:text-neutral-400"
          )}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-neutral-500 transition-transform duration-150",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg",
            "dark:bg-neutral-900 dark:border-neutral-700",
            "max-h-60 overflow-auto"
          )}
        >
          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                disabled={item.disabled}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "flex items-center justify-between",
                  "hover:bg-neutral-50 dark:hover:bg-neutral-800",
                  "text-neutral-900 dark:text-neutral-100",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  selectedValue === item.value &&
                    "bg-neutral-100 dark:bg-neutral-800"
                )}
              >
                <span>{item.label}</span>
                {selectedValue === item.value && (
                  <Check className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
