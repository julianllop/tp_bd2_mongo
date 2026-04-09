import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * options: string[] | { value: string; label: string }[]
 * value: string[]  (array of selected values / strings)
 */
export default function MultiSelect({ label, options, value, onChange, placeholder = "Todos" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function toggle(val) {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  }

  const selectedLabels = normalized
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  const display =
    selectedLabels.length === 0 ? null
    : selectedLabels.length === 1 ? selectedLabels[0]
    : `${selectedLabels.length} seleccionados`;

  return (
    <div className="relative" ref={ref}>
      {label && <label className="label">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input flex items-center justify-between gap-2 w-full text-left"
      >
        <span className="truncate text-sm">
          {display ? display : <span className="text-slate-400">{placeholder}</span>}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[160px] bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-56 overflow-auto">
          {normalized.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-sm select-none"
            >
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="rounded accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
