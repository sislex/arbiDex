import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  label,
  required = false,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const updateDropdownPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;

    updateDropdownPosition();

    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;

      setOpen(false);
      setSearch('');
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const dropdown = open ? (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: dropdownStyle.top,
        left: dropdownStyle.left,
        width: dropdownStyle.width,
      }}
      className="bg-popover border border-border rounded shadow-lg z-[100] max-h-60 overflow-hidden flex flex-col"
    >
      <div className="p-2 border-b border-border">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-1.5 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
      </div>
      <div className="overflow-y-auto max-h-48">
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground text-center">No results found</div>
        ) : (
          filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                setSearch('');
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                option.value === value
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setOpen((current) => !current);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 bg-input border border-border rounded text-sm text-foreground transition-colors ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
          }`}
        >
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <X
                className="w-4 h-4 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
              />
            )}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>

        {dropdown && createPortal(dropdown, document.body)}
      </div>
    </div>
  );
}
