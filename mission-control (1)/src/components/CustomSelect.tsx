import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  iconSize?: number;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  triggerClassName = "flex w-full items-center justify-between rounded-xl bg-[#2C2C2E] p-3 text-left text-white outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200 active:scale-[0.98]",
  dropdownClassName = "w-full min-w-[140px] right-0 sm:right-auto",
  iconSize = 20
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (selectRef.current && dropdownRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const isRightAligned = dropdownClassName.includes('right-0');
      const isFullWidth = dropdownClassName.includes('w-full');

      const spaceBelow = window.innerHeight - rect.bottom - 16; // 16px padding
      const spaceAbove = rect.top - 16;
      
      let top = 'auto';
      let bottom = 'auto';
      let maxHeight = 240; // default max-h-60 is 240px

      // If not enough space below, and more space above, open upwards
      if (spaceBelow < 240 && spaceAbove > spaceBelow) {
        bottom = `${window.innerHeight - rect.top + 8}px`;
        maxHeight = Math.max(100, spaceAbove);
        dropdownRef.current.style.transformOrigin = 'bottom center';
      } else {
        top = `${rect.bottom + 8}px`;
        maxHeight = Math.max(100, spaceBelow);
        dropdownRef.current.style.transformOrigin = 'top center';
      }

      dropdownRef.current.style.top = top;
      dropdownRef.current.style.bottom = bottom;

      if (isFullWidth) {
        dropdownRef.current.style.width = `${rect.width}px`;
      }

      if (isRightAligned) {
        dropdownRef.current.style.right = `${window.innerWidth - rect.right}px`;
        dropdownRef.current.style.left = 'auto';
      } else {
        dropdownRef.current.style.left = `${rect.left}px`;
        dropdownRef.current.style.right = 'auto';
      }

      // Apply max height to the scrollable container
      const scrollContainer = dropdownRef.current.querySelector('.overflow-y-auto') as HTMLElement;
      if (scrollContainer) {
        scrollContainer.style.maxHeight = `${Math.min(maxHeight, 300)}px`;
      }
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      // If the scroll happened inside the dropdown, do nothing (let it scroll)
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      // Directly update the DOM position for zero-latency scroll tracking
      updatePosition();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current && !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <button
        ref={selectRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={triggerClassName}
      >
        <span className={`truncate ${selectedOption && selectedOption.value !== '' ? 'text-white' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={iconSize} className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ position: 'fixed', zIndex: 99999 }}
              className={`overflow-hidden rounded-xl bg-[#2C2C2E] p-1 shadow-2xl border border-[#3A3A3C] ${dropdownClassName.replace('right-0', '').replace('w-full', '').replace('sm:right-auto', '')}`}
            >
              <div className="overflow-y-auto overscroll-contain">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white transition-colors hover:bg-[#3A3A3C] active:bg-[#48484A]"
                  >
                    <span className="truncate pr-4">{option.label}</span>
                    {value === option.value && <Check className="h-4 w-4 shrink-0 text-[#0A84FF]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
