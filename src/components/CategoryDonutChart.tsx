import React, { useState } from 'react';
import { CategoryStat } from '../types/finance';
import { formatRupiah } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface CategoryDonutChartProps {
  categories: CategoryStat[];
  totalExpense: number;
  onSelectCategory?: (category: string) => void;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categories,
  totalExpense,
  onSelectCategory,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (categories.length === 0 || totalExpense === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          📊
        </div>
        <p className="text-sm font-medium">Belum ada pengeluaran pada periode ini</p>
      </div>
    );
  }

  // Calculate SVG stroke dashes for donut segments
  const size = 200;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const activeCategory = hoveredIndex !== null ? categories[hoveredIndex] : null;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* SVG Donut */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Base background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {categories.map((cat, idx) => {
            const percent = cat.percentage / 100;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * cumulativePercent;
            cumulativePercent += percent;

            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={cat.category}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectCategory?.(cat.category)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {activeCategory ? activeCategory.category : 'Total Beban'}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight leading-tight mt-0.5">
            {activeCategory ? formatRupiah(activeCategory.amount) : formatRupiah(totalExpense)}
          </span>
          {activeCategory && (
            <span className="text-xs font-semibold text-emerald-600">
              {activeCategory.percentage}% dari total
            </span>
          )}
        </div>
      </div>

      {/* Legend & Breakdown List */}
      <div className="flex-1 w-full space-y-2 max-h-64 overflow-y-auto pr-1">
        {categories.map((cat, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <div
              key={cat.category}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelectCategory?.(cat.category)}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                isHovered
                  ? 'bg-slate-50 border-slate-300 shadow-xs'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-3.5 h-3.5 rounded-md shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800 truncate">{cat.category}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-slate-900">{formatRupiah(cat.amount)}</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
