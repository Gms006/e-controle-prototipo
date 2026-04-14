import { useState, useRef, useEffect } from "react";
import { Search, LayoutGrid, List, X, ChevronDown } from "lucide-react";

export type ViewMode = "table" | "cards";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
  multi?: boolean;
}

export interface ActiveFilters {
  [key: string]: string[];
}

interface TabFiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters: FilterDef[];
  activeFilters: ActiveFilters;
  onFilterChange: (key: string, values: string[]) => void;
  resultCount?: number;
}

function FilterDropdown({
  def,
  active,
  onChange,
}: {
  def: FilterDef;
  active: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(value: string) {
    if (def.multi) {
      onChange(active.includes(value) ? active.filter(v => v !== value) : [...active, value]);
    } else {
      onChange(active.includes(value) ? [] : [value]);
      setOpen(false);
    }
  }

  const hasActive = active.length > 0;
  const label = hasActive
    ? active.length === 1
      ? def.options.find(o => o.value === active[0])?.label ?? active[0]
      : `${def.label} (${active.length})`
    : def.label;

  return (
    <div className="ec-filter-dd" ref={ref}>
      <button
        className={`ec-filter-dd-btn ${hasActive ? "active" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        {label}
        {hasActive ? (
          <span
            className="ec-filter-dd-clear"
            onClick={e => { e.stopPropagation(); onChange([]); }}
          >
            <X size={11} strokeWidth={2.5} />
          </span>
        ) : (
          <ChevronDown size={13} strokeWidth={2} className={`ec-filter-dd-chevron ${open ? "open" : ""}`} />
        )}
      </button>
      {open && (
        <div className="ec-filter-dd-menu">
          {def.options.map(opt => (
            <div
              key={opt.value}
              className={`ec-filter-dd-item ${active.includes(opt.value) ? "selected" : ""}`}
              onClick={() => toggle(opt.value)}
            >
              <span className="ec-filter-dd-check">{active.includes(opt.value) ? "✓" : ""}</span>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TabFilters({
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  searchPlaceholder = "Buscar…",
  filters,
  activeFilters,
  onFilterChange,
  resultCount,
}: TabFiltersProps) {
  const hasAnyFilter = search.length > 0 || Object.values(activeFilters).some(v => v.length > 0);

  function clearAll() {
    onSearchChange("");
    filters.forEach(f => onFilterChange(f.key, []));
  }

  return (
    <div className="ec-tab-filters">
      <div className="ec-tab-filters-row">
        {/* Search */}
        <div className="ec-tab-search">
          <Search size={14} strokeWidth={2} className="ec-tab-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
          {search && (
            <button className="ec-tab-search-clear" onClick={() => onSearchChange("")}>
              <X size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="ec-filter-dds">
          {filters.map(f => (
            <FilterDropdown
              key={f.key}
              def={f}
              active={activeFilters[f.key] ?? []}
              onChange={v => onFilterChange(f.key, v)}
            />
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Clear all */}
        {hasAnyFilter && (
          <button className="ec-filter-clear-all" onClick={clearAll}>
            <X size={12} strokeWidth={2.5} /> Limpar
          </button>
        )}

        {/* Result count */}
        {resultCount !== undefined && (
          <span className="ec-filter-count">{resultCount} resultado{resultCount !== 1 ? "s" : ""}</span>
        )}

        {/* View toggle */}
        <div className="ec-view-toggle">
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => onViewModeChange("table")}
            title="Tabela"
          >
            <List size={15} strokeWidth={2} />
          </button>
          <button
            className={viewMode === "cards" ? "active" : ""}
            onClick={() => onViewModeChange("cards")}
            title="Cards"
          >
            <LayoutGrid size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
