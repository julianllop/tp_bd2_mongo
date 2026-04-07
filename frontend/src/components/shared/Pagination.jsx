import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1) return null;

  // Genera el rango de páginas a mostrar (máximo 5 botones)
  const delta = 2;
  const start = Math.max(1, page - delta);
  const end = Math.min(totalPages, start + delta * 2);
  const adjustedStart = Math.max(1, end - delta * 2);

  const pages = [];
  for (let i = adjustedStart; i <= end; i++) pages.push(i);

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white">
      <p className="text-xs text-slate-400">
        Mostrando <span className="font-medium text-slate-600">{from}–{to}</span> de{" "}
        <span className="font-medium text-slate-600">{total}</span> registros
      </p>

      <div className="flex items-center gap-1">
        {/* Anterior */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
          Anterior
        </button>

        {/* Primera página si está lejos */}
        {adjustedStart > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="w-8 h-8 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              1
            </button>
            {adjustedStart > 2 && <span className="text-slate-400 text-xs px-1">…</span>}
          </>
        )}

        {/* Páginas del rango */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              p === page
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Última página si está lejos */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-slate-400 text-xs px-1">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              {totalPages}
            </button>
          </>
        )}

        {/* Siguiente */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
