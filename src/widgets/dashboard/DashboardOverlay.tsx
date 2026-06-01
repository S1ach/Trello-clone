'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAppSelector } from '@/app/store/hooks';
import { useTranslation } from '@/shared/lib/useTranslation';
import { X, CheckCircle2, Clock, AlertCircle, BarChart3, TrendingDown } from 'lucide-react';
import { Priority } from '@/entities/board/model/types';

interface DashboardOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardOverlay({ open, onOpenChange }: DashboardOverlayProps) {
  const t = useTranslation();
  const board = useAppSelector(state => state.board);

  const cards = Object.values(board.cards);
  const columns = Object.values(board.columns);

  // Done Column Search: Find columns containing "done" or "готово" or column-3
  const doneColumnIds = columns
    .filter(col => {
      const title = col.title.toLowerCase();
      return title.includes('done') || title.includes('готово') || col.id === 'column-3';
    })
    .map(col => col.id);

  const totalCount = cards.length;
  const completedCount = cards.filter(card => {
    // A card is completed if it's currently inside a Done column
    const column = columns.find(col => col.cardIds.includes(card.id));
    return column ? doneColumnIds.includes(column.id) : false;
  }).length;

  const pendingCount = totalCount - completedCount;

  // Overdue count: Due date in past, and not completed
  const overdueCount = cards.filter(card => {
    if (!card.dueDate) return false;
    const isCompleted = (() => {
      const column = columns.find(col => col.cardIds.includes(card.id));
      return column ? doneColumnIds.includes(column.id) : false;
    })();
    return new Date(card.dueDate).getTime() < Date.now() && !isCompleted;
  }).length;

  // Priority Distribution
  const priorityData: Record<Exclude<Priority, null>, number> = {
    high: cards.filter(c => c.priority === 'high').length,
    medium: cards.filter(c => c.priority === 'medium').length,
    low: cards.filter(c => c.priority === 'low').length,
  };

  const priorityTotal = priorityData.high + priorityData.medium + priorityData.low;

  // Donut Chart Math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const priorities: { id: Exclude<Priority, null>; color: string; label: string }[] = [
    { id: 'high', color: '#EF5350', label: t.priorityHigh },
    { id: 'medium', color: '#FFB300', label: t.priorityMedium },
    { id: 'low', color: '#4CAF50', label: t.priorityLow },
  ];

  let accumulatedOffset = 0;
  const donutSlices = priorities.map(p => {
    const val = priorityData[p.id];
    const pct = priorityTotal > 0 ? val / priorityTotal : 0;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = circumference - accumulatedOffset;
    accumulatedOffset += pct * circumference;
    return { ...p, strokeDasharray, strokeDashoffset, val, pct };
  });

  // Burndown Chart computation for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  // Calculate actual tasks remaining at the start/end of each day
  const burndownData = last7Days.map((day, idx) => {
    const dayTimestamp = day.getTime();

    // Ideal tasks: linear decrease from total tasks to completed tasks
    const ideal = totalCount - (totalCount / 6) * idx;

    // Remaining tasks calculation
    // Count all tasks created before/on this day, minus tasks that were marked done before/on this day.
    // If the creation date isn't exact, we can use our dummy creation dates.
    const remaining = cards.filter(card => {
      const createdTime = new Date(card.createdAt).getTime();
      if (createdTime > dayTimestamp) return false; // not created yet

      // Check completed time (approximated by creation date if done, otherwise we consider it active)
      const column = columns.find(col => col.cardIds.includes(card.id));
      const isCompleted = column ? doneColumnIds.includes(column.id) : false;
      if (isCompleted) {
        // If it's completed, let's pretend it was completed 1 day after creation or today if creation was today
        const completedTime = createdTime + 3600000 * 24;
        if (completedTime <= dayTimestamp) return false; // completed before this day
      }
      return true;
    }).length;

    return {
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      ideal: Math.max(0, parseFloat(ideal.toFixed(1))),
      actual: remaining,
    };
  });

  // Line chart coordinates math
  const chartWidth = 500;
  const chartHeight = 220;
  const padding = 35;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  const maxVal = Math.max(totalCount, 5);

  const getX = (index: number) => padding + (index / 5) * graphWidth;
  const getY = (val: number) => padding + graphHeight - (val / maxVal) * graphHeight;

  // SVG Paths
  const idealPath = burndownData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.ideal)}`).join(' ');
  const actualPath = burndownData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.actual)}`).join(' ');

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl animate-in fade-in" />
        <Dialog.Content
          className="fixed z-50 w-[92vw] max-w-5xl h-[90vh] md:h-[85vh] overflow-y-auto bg-white/98 dark:bg-[#0a0a0c]/98 border border-black/8 dark:border-white/8 rounded-3xl p-6 md:p-8 shadow-2xl outline-none flex flex-col animate-in fade-in zoom-in-95"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-5">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-indigo-500 dark:text-indigo-400" size={28} />
              <div>
                <Dialog.Title className="text-2xl font-extrabold text-gray-800 dark:text-white/90 tracking-tight">{t.analytics}</Dialog.Title>
                <p className="text-sm text-gray-400 dark:text-white/30">{board.title}</p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="rounded-xl p-2 text-gray-400 dark:text-white/30 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-white/60 transition-all cursor-pointer">
                <X size={22} />
              </button>
            </Dialog.Close>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10 flex items-center gap-4">
              <div className="p-3 bg-indigo-500 rounded-xl text-white"><BarChart3 size={20} /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white/90">{totalCount}</div>
                <div className="text-xs font-semibold text-indigo-500 dark:text-indigo-400/80 uppercase">{t.totalTasks}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-green-50/40 dark:bg-green-500/5 border border-green-100/50 dark:border-green-500/10 flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-xl text-white"><CheckCircle2 size={20} /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white/90">{completedCount}</div>
                <div className="text-xs font-semibold text-green-600 dark:text-green-400/80 uppercase">{t.completedTasks}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/10 flex items-center gap-4">
              <div className="p-3 bg-amber-500 rounded-xl text-white"><Clock size={20} /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white/90">{pendingCount}</div>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400/80 uppercase">{t.pendingTasks}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/40 dark:bg-red-500/5 border border-red-100/50 dark:border-red-500/10 flex items-center gap-4">
              <div className="p-3 bg-red-500 rounded-xl text-white"><AlertCircle size={20} /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white/90">{overdueCount}</div>
                <div className="text-xs font-semibold text-red-500 dark:text-red-400/80 uppercase">{t.overdueTasks}</div>
              </div>
            </div>
          </div>

          {/* Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-[350px]">
            {/* Burndown Chart */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="text-indigo-500" size={20} />
                <h3 className="font-bold text-gray-800 dark:text-white/90 text-lg">{t.burndownChart}</h3>
              </div>
              <div className="flex-1 w-full relative flex items-center justify-center">
                <svg className="w-full h-full min-h-[220px]" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  {/* Grid Lines */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    const yVal = graphHeight - (i / 4) * graphHeight + padding;
                    return (
                      <line
                        key={i}
                        x1={padding}
                        y1={yVal}
                        x2={chartWidth - padding}
                        y2={yVal}
                        className="stroke-gray-100 dark:stroke-white/5"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Ideal Path */}
                  <path
                    d={idealPath}
                    fill="none"
                    className="stroke-indigo-400/50 dark:stroke-indigo-400/30"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />

                  {/* Actual Path */}
                  <path
                    d={actualPath}
                    fill="none"
                    className="stroke-indigo-500 dark:stroke-indigo-400"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Nodes & Labels */}
                  {burndownData.map((d, i) => {
                    const cx = getX(i);
                    const cy = getY(d.actual);
                    return (
                      <g key={i} className="group cursor-pointer">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          className="fill-indigo-500 stroke-white dark:stroke-[#0a0a0c]"
                          strokeWidth={2}
                        />
                        <text
                          x={cx}
                          y={chartHeight - 10}
                          textAnchor="middle"
                          className="text-[10px] font-semibold fill-gray-400 dark:fill-white/20"
                        >
                          {d.label}
                        </text>
                        {/* Hover Tooltip Box */}
                        <text
                          x={cx}
                          y={cy - 12}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        >
                          {d.actual}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="flex items-center gap-4 justify-center text-xs mt-3">
                <span className="flex items-center gap-1.5 font-semibold text-gray-500 dark:text-white/40">
                  <span className="w-3 h-1 border-t-2 border-dashed border-indigo-400" />
                  {t.idealBurn}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-indigo-500">
                  <span className="w-3 h-1 bg-indigo-500 rounded-full" />
                  {t.remainingTasks}
                </span>
              </div>
            </div>

            {/* Priority distribution Donut chart */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 p-6 flex flex-col items-center">
              <h3 className="font-bold text-gray-800 dark:text-white/90 text-lg w-full text-left mb-6">{t.priorityDistribution}</h3>
              {priorityTotal > 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      {donutSlices.map((slice, i) => (
                        <circle
                          key={slice.id}
                          cx="60"
                          cy="60"
                          r={radius}
                          fill="none"
                          stroke={slice.color}
                          strokeWidth="14"
                          strokeDasharray={slice.strokeDasharray}
                          strokeDashoffset={slice.strokeDashoffset}
                          className="transition-all duration-300 hover:stroke-[16] cursor-pointer"
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-gray-800 dark:text-white/90">{priorityTotal}</span>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-white/20 uppercase tracking-widest">{t.priority}</span>
                    </div>
                  </div>

                  {/* Legends */}
                  <div className="w-full space-y-2 mt-6">
                    {donutSlices.map(slice => (
                      <div key={slice.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-gray-600 dark:text-white/60">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                          {slice.label}
                        </span>
                        <span className="font-bold text-gray-800 dark:text-white/80">
                          {slice.val} <span className="text-xs font-normal text-gray-400">({Math.round(slice.pct * 100)}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-white/25 text-sm font-medium">
                  {t.noNotifications}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
