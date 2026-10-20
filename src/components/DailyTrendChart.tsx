import React, { useState } from 'react';
import { DailyStat } from '../types/finance';
import { formatRupiah, formatCompactRupiah } from '../utils/formatters';

interface DailyTrendChartProps {
  dailyStats: DailyStat[];
  highestDay?: { date: string; amount: number; dayName: string } | null;
  onSelectDate?: (date: string) => void;
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({
  dailyStats,
  highestDay,
  onSelectDate,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DailyStat | null>(null);

  if (dailyStats.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-xs">
        Tidak ada data harian untuk ditampilkan.
      </div>
    );
  }

  const maxExpense = Math.max(...dailyStats.map((d) => d.expense), 100000);

  return (
    <div className="w-full">
      {/* Tooltip or Summary display */}
      <div className="h-9 flex items-center justify-between text-xs mb-2">
        {hoveredDay ? (
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs animate-fadeIn">
            <span className="font-bold">{hoveredDay.dayName}, {hoveredDay.formattedDate}:</span>
            <span className="text-amber-300 font-extrabold">{formatRupiah(hoveredDay.expense)}</span>
            <span className="text-slate-400">({hoveredDay.transactionCount} transaksi)</span>
          </div>
        ) : (
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <span>Arahkan kursor pada batang grafik untuk melihat rincian per hari</span>
          </div>
        )}

        {highestDay && highestDay.amount > 0 && (
          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            Puncak: {highestDay.dayName} ({formatCompactRupiah(highestDay.amount)})
          </span>
        )}
      </div>

      {/* SVG / Bar container */}
      <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-4 pb-2 px-1 border-b border-slate-200 overflow-x-auto">
        {dailyStats.map((d) => {
          const heightPercent = Math.max(6, Math.round((d.expense / maxExpense) * 100));
          const isHighest = highestDay && highestDay.date === d.date && d.expense > 0;
          const isHovered = hoveredDay?.date === d.date;

          return (
            <div
              key={d.date}
              className="flex-1 min-w-[20px] max-w-[42px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
              onMouseEnter={() => setHoveredDay(d)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => onSelectDate?.(d.date)}
            >
              {/* Bar */}
              <div
                className={`w-full rounded-t-md transition-all duration-200 ${
                  isHighest
                    ? 'bg-rose-500 group-hover:bg-rose-600 shadow-sm'
                    : d.expense > 0
                    ? 'bg-emerald-500 group-hover:bg-emerald-600'
                    : 'bg-slate-200'
                } ${isHovered ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                style={{ height: `${heightPercent}%` }}
              />

              {/* Day label */}
              <div className="mt-2 text-center">
                <span className="block text-[10px] font-bold text-slate-600 truncate">
                  {d.dayName.slice(0, 3)}
                </span>
                <span className="block text-[9px] text-slate-400">
                  {d.formattedDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
