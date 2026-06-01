import React, { forwardRef } from 'react';
import { Card as CardType } from '../model/types';
import { cn } from '@/shared/lib/utils';
import { LABEL_COLORS } from '@/shared/lib/i18n';
import { GripVertical, Pencil, Trash2, Calendar, CheckSquare, Paperclip, AlertCircle } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardType;
  isDragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  dragHandleProps?: Record<string, any> | null;
}

export const CardItem = forwardRef<HTMLDivElement, CardProps>(
  ({ card, isDragging, onEdit, onDelete, onClick, dragHandleProps, className, style, ...props }, ref) => {
    const hasLabels = card.labels && card.labels.length > 0;
    const hasChecklist = card.checklist && card.checklist.length > 0;
    const hasDueDate = !!card.dueDate;
    const hasAttachments = card.attachments && card.attachments.length > 0;
    const hasPriority = !!card.priority;

    const completedCount = hasChecklist ? card.checklist.filter(i => i.completed).length : 0;
    const totalCount = hasChecklist ? card.checklist.length : 0;

    // Due date status
    let dueBadgeClass = '';
    let dueBadgeText = '';
    if (hasDueDate) {
      const due = new Date(card.dueDate!);
      const now = new Date();
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const dateStr = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      if (diffDays < 0) {
        dueBadgeClass = 'text-red-500 dark:text-red-400';
        dueBadgeText = dateStr;
      } else if (diffDays <= 1) {
        dueBadgeClass = 'text-yellow-600 dark:text-yellow-400';
        dueBadgeText = dateStr;
      } else {
        dueBadgeClass = 'text-gray-400 dark:text-white/30';
        dueBadgeText = dateStr;
      }
    }

    // Priority color matching
    let priorityColor = '';
    if (hasPriority) {
      if (card.priority === 'high') priorityColor = 'text-red-500';
      else if (card.priority === 'medium') priorityColor = 'text-amber-500';
      else if (card.priority === 'low') priorityColor = 'text-green-500';
    }

    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex flex-col rounded-xl glass-card cursor-pointer',
          isDragging && 'shadow-lg ring-1 ring-indigo-500/40 opacity-95',
          className
        )}
        style={style}
        onClick={onClick}
        {...props}
      >
        {/* Label color strips */}
        {hasLabels && (
          <div className="flex gap-1 px-2.5 pt-2">
            {card.labels.map(labelId => {
              const lc = LABEL_COLORS.find(l => l.id === labelId);
              return lc ? (
                <span key={labelId} className="h-1.5 w-8 rounded-full" style={{ backgroundColor: lc.color }} />
              ) : null;
            })}
          </div>
        )}

        {/* Main content */}
        <div className="flex items-start gap-2 p-2.5">
          <div
            {...dragHandleProps}
            onClick={e => e.stopPropagation()}
            className="mt-0.5 cursor-grab text-gray-300 dark:text-white/15 hover:text-gray-500 dark:hover:text-white/40 active:cursor-grabbing transition-colors"
          >
            <GripVertical size={14} />
          </div>
          <div className="flex-1 break-words text-sm text-gray-700 dark:text-white/80 leading-snug">{card.content}</div>
          <div className="absolute right-2.5 top-2.5 hidden space-x-1 group-hover:flex" onClick={e => e.stopPropagation()}>
            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded-lg p-1.5 text-gray-300 dark:text-white/20 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all cursor-pointer"
              >
                <Pencil size={13} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-lg p-1.5 text-gray-300 dark:text-white/20 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Footer badges */}
        {(hasDueDate || hasChecklist || card.description || hasAttachments || hasPriority) && (
          <div className="flex items-center gap-3 px-2.5 pb-2.5 text-[11px] font-semibold">
            {hasPriority && (
              <span className={`flex items-center gap-0.5 ${priorityColor}`} title={`Priority: ${card.priority}`}>
                <AlertCircle size={12} className="fill-current stroke-[3]" />
              </span>
            )}
            {hasDueDate && (
              <span className={`flex items-center gap-1 ${dueBadgeClass}`}>
                <Calendar size={12} />
                {dueBadgeText}
              </span>
            )}
            {card.description && (
              <span className="text-gray-400 dark:text-white/25" title="Has description">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h10M4 18h14" /></svg>
              </span>
            )}
            {hasAttachments && (
              <span className="flex items-center gap-0.5 text-gray-400 dark:text-white/30" title={`${card.attachments.length} attachments`}>
                <Paperclip size={12} />
                {card.attachments.length}
              </span>
            )}
            {hasChecklist && (
              <span className={`flex items-center gap-1 ${completedCount === totalCount ? 'text-green-500' : 'text-gray-400 dark:text-white/30'}`}>
                <CheckSquare size={12} />
                {completedCount}/{totalCount}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
CardItem.displayName = 'CardItem';
