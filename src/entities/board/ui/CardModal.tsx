'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAppDispatch } from '@/app/store/hooks';
import { updateCard, deleteCard } from '@/entities/board/model/boardSlice';
import { useTranslation } from '@/shared/lib/useTranslation';
import { LABEL_COLORS, Translations } from '@/shared/lib/i18n';
import { Card as CardType, Attachment, Priority } from '../model/types';
import { X, Calendar, Tag, CheckSquare, FileText, Trash2, Plus, Square, SquareCheckBig, AlertCircle, Paperclip } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CardModalProps {
  card: CardType;
  columnId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CardModal({ card, columnId, open, onOpenChange }: CardModalProps) {
  const dispatch = useAppDispatch();
  const t = useTranslation();

  const [title, setTitle] = useState(card.content);
  const [description, setDescription] = useState(card.description || '');
  const [newItemText, setNewItemText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Sync state when card changes
  React.useEffect(() => {
    setTitle(card.content);
    setDescription(card.description || '');
  }, [card.content, card.description]);

  const handleTitleSave = () => {
    if (title.trim() && title.trim() !== card.content) {
      dispatch(updateCard({ id: card.id, changes: { content: title.trim() } }));
    }
  };

  const handleDescriptionSave = () => {
    if (description !== card.description) {
      dispatch(updateCard({ id: card.id, changes: { description } }));
    }
  };

  const handleToggleLabel = (labelId: string) => {
    const labels = card.labels.includes(labelId)
      ? card.labels.filter(l => l !== labelId)
      : [...card.labels, labelId];
    dispatch(updateCard({ id: card.id, changes: { labels } }));
  };

  const handlePriorityChange = (priority: Priority) => {
    dispatch(updateCard({ id: card.id, changes: { priority } }));
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    dispatch(updateCard({ id: card.id, changes: { dueDate: val ? new Date(val).toISOString() : null } }));
  };

  const handleClearDueDate = () => {
    dispatch(updateCard({ id: card.id, changes: { dueDate: null } }));
  };

  const handleAddChecklistItem = () => {
    if (newItemText.trim()) {
      const newItem = { id: uuidv4(), text: newItemText.trim(), completed: false };
      dispatch(updateCard({ id: card.id, changes: { checklist: [...card.checklist, newItem] } }));
      setNewItemText('');
    }
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const filtered = card.checklist.filter(i => i.id !== itemId);
    dispatch(updateCard({ id: card.id, changes: { checklist: filtered } }));
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const checklist = card.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    dispatch(updateCard({ id: card.id, changes: { checklist } }));
  };

  // Upload attachment via API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/board/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.file) {
        dispatch(updateCard({
          id: card.id,
          changes: { attachments: [...(card.attachments || []), data.file] },
        }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    const filtered = card.attachments.filter(a => a.id !== attachmentId);
    dispatch(updateCard({ id: card.id, changes: { attachments: filtered } }));
  };

  const handleDelete = () => {
    if (confirm(t.deleteCardConfirm)) {
      dispatch(deleteCard({ columnId, cardId: card.id }));
      onOpenChange(false);
    }
  };

  const completedCount = card.checklist ? card.checklist.filter(i => i.completed).length : 0;
  const totalCount = card.checklist ? card.checklist.length : 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const dueDateFormatted = card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content
          className="fixed z-50 w-full max-w-xl max-h-[85vh] overflow-y-auto bg-white/98 dark:bg-[#0a0a0c]/98 border border-black/8 dark:border-white/8 rounded-2xl p-0 shadow-2xl outline-none animate-in fade-in zoom-in-95"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-0">
            <div className="flex-1 pr-4">
              {/* Labels preview */}
              {card.labels && card.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {card.labels.map(labelId => {
                    const lc = LABEL_COLORS.find(l => l.id === labelId);
                    return lc ? (
                      <span key={labelId} className="h-2 w-10 rounded-full" style={{ backgroundColor: lc.color }} />
                    ) : null;
                  })}
                </div>
              )}
              <input
                className="w-full text-xl font-bold bg-transparent outline-none text-gray-800 dark:text-white/90 placeholder:text-gray-400"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={e => { if (e.key === 'Enter') { handleTitleSave(); (e.target as HTMLInputElement).blur(); } }}
              />
            </div>
            <Dialog.Close asChild>
              <button className="rounded-lg p-1.5 text-gray-400 dark:text-white/30 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-white/60 transition-all mt-1 cursor-pointer">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-5 space-y-6">
            {/* Priority Selection */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-gray-400 dark:text-white/30" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">{t.priority}</h4>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'high', color: 'bg-red-500 text-white', label: t.priorityHigh },
                  { id: 'medium', color: 'bg-amber-500 text-white', label: t.priorityMedium },
                  { id: 'low', color: 'bg-green-500 text-white', label: t.priorityLow },
                ].map(p => {
                  const isActive = card.priority === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePriorityChange(isActive ? null : (p.id as Priority))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? `${p.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0c]`
                          : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Labels */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-gray-400 dark:text-white/30" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">{t.labels}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {LABEL_COLORS.map(lc => {
                  const isActive = card.labels && card.labels.includes(lc.id);
                  return (
                    <button
                      key={lc.id}
                      onClick={() => handleToggleLabel(lc.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#0a0a0c] shadow-sm'
                          : 'opacity-65 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isActive ? lc.color : `${lc.color}25`,
                        color: isActive ? 'white' : lc.color,
                        ringColor: lc.color,
                      }}
                    >
                      {t[lc.labelKey as keyof Translations] as string}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Due Date */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-gray-400 dark:text-white/30" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">{t.dueDate}</h4>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="h-9 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-700 dark:text-white/80 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
                  value={dueDateFormatted}
                  onChange={handleDueDateChange}
                />
                {card.dueDate && (
                  <button onClick={handleClearDueDate} className="text-xs text-gray-400 dark:text-white/30 hover:text-red-500 transition-colors cursor-pointer">
                    <X size={16} />
                  </button>
                )}
                {card.dueDate && <DueBadge dueDate={card.dueDate} t={t} />}
              </div>
            </section>

            {/* Description */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-gray-400 dark:text-white/30" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">{t.description}</h4>
              </div>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-700 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/20 outline-none focus:ring-1 focus:ring-indigo-500/50 resize-y transition-all"
                placeholder={t.descriptionPlaceholder}
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleDescriptionSave}
              />
            </section>

            {/* Attachments Section */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Paperclip size={16} className="text-gray-400 dark:text-white/30" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">{t.attachments}</h4>
                {isUploading && <span className="text-xs text-gray-400 dark:text-white/30 ml-auto animate-pulse">{t.uploading}</span>}
              </div>

              {/* Upload Input Button */}
              <label className="flex items-center justify-center gap-2 rounded-xl p-3 border border-dashed border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-400 dark:text-white/30 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-white/60 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer select-none">
                <Plus size={14} />
                {t.addAttachment}
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>

              {/* Attachments Grid */}
              {card.attachments && card.attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {card.attachments.map(att => {
                    const isImg = att.type.startsWith('image/');
                    return (
                      <div key={att.id} className="relative group flex flex-col rounded-xl overflow-hidden border border-gray-200/50 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                        {isImg ? (
                          <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${att.url})` }} />
                        ) : (
                          <div className="h-24 flex items-center justify-center bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-500">
                            <Paperclip size={24} />
                          </div>
                        )}
                        <div className="p-2.5 flex items-center justify-between gap-2 min-w-0">
                          <a href={att.url} download={att.name} className="flex-1 min-w-0 text-xs font-bold text-gray-700 dark:text-white/70 truncate hover:text-indigo-500 transition-colors">
                            {att.name}
                          </a>
                          <button onClick={() => handleDeleteAttachment(att.id)} className="text-gray-300 dark:text-white/15 hover:text-red-500 transition-colors cursor-pointer">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Checklist */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare size={16} className="text-gray-400 dark:text-white/30" />
                <h4 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">{t.checklist}</h4>
                {totalCount > 0 && (
                  <span className="text-xs text-gray-400 dark:text-white/30 ml-auto">{completedCount}/{totalCount}</span>
                )}
              </div>

              {/* Progress bar */}
              {totalCount > 0 && (
                <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: progress === 100 ? '#4CAF50' : '#6366f1',
                    }}
                  />
                </div>
              )}

              {/* Items */}
              <div className="space-y-1">
                {card.checklist && card.checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-2 group rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <button
                      onClick={() => handleToggleChecklistItem(item.id)}
                      className="shrink-0 text-gray-400 dark:text-white/30 hover:text-indigo-500 transition-colors cursor-pointer"
                    >
                      {item.completed ? <SquareCheckBig size={18} className="text-green-500" /> : <Square size={18} />}
                    </button>
                    <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400 dark:text-white/25' : 'text-gray-700 dark:text-white/80'}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-white/15 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add item */}
              <div className="flex items-center gap-2 mt-2">
                <Plus size={16} className="text-gray-300 dark:text-white/20 shrink-0" />
                <input
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/20"
                  placeholder={t.addChecklistItem}
                  value={newItemText}
                  onChange={e => setNewItemText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddChecklistItem(); }}
                />
              </div>
            </section>

            {/* Delete */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                {t.deleteCard}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Due date badge helper
function DueBadge({ dueDate, t }: { dueDate: string; t: Translations }) {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let label: string;
  let className: string;

  if (diffDays < 0) {
    label = t.overdue;
    className = 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
  } else if (diffDays === 0) {
    label = t.dueToday;
    className = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
  } else if (diffDays === 1) {
    label = t.dueTomorrow;
    className = 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400';
  } else {
    label = t.dueSoon;
    className = 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-white/40';
  }

  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${className}`}>
      {label}
    </span>
  );
}
