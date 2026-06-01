'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { moveCard, moveColumn, addColumn, addCard, deleteCard, editCard, deleteColumn } from '@/entities/board/model/boardSlice';
import { BOARD_BACKGROUNDS } from '@/entities/settings/model/settingsSlice';
import { ColumnItem } from '@/entities/board/ui/Column';
import { CardItem } from '@/entities/board/ui/Card';
import { CardModal } from '@/entities/board/ui/CardModal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/shared/lib/useTranslation';
import { Card as CardType } from '@/entities/board/model/types';

export function BoardWidget() {
  const board = useAppSelector((state) => state.board);
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();
  const t = useTranslation();
  const isDark = resolvedTheme === 'dark';
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [addingCardToColumn, setAddingCardToColumn] = useState<string | null>(null);
  const [newCardContent, setNewCardContent] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editCardContent, setEditCardContent] = useState('');

  // Modal state
  const [modalCard, setModalCard] = useState<{ card: CardType; columnId: string } | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'column') {
      dispatch(moveColumn({ sourceIndex: source.index, destinationIndex: destination.index, columnId: draggableId }));
      return;
    }
    dispatch(moveCard({ sourceColumnId: source.droppableId, destinationColumnId: destination.droppableId, sourceIndex: source.index, destinationIndex: destination.index, cardId: draggableId }));
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      dispatch(addColumn({ id: `column-${uuidv4()}`, title: newColumnTitle.trim(), cardIds: [], sortBy: 'none' }));
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleAddCard = (columnId: string) => {
    if (newCardContent.trim()) {
      dispatch(addCard({
        columnId,
        card: {
          id: `card-${uuidv4()}`,
          content: newCardContent.trim(),
          description: '',
          labels: [],
          dueDate: null,
          checklist: [],
          priority: null,
          attachments: [],
          createdAt: new Date().toISOString(),
        },
      }));
      setNewCardContent('');
      setAddingCardToColumn(null);
    }
  };

  const handleEditCard = (cardId: string) => {
    if (editCardContent.trim()) {
      dispatch(editCard({ id: cardId, content: editCardContent.trim() }));
      setEditingCardId(null);
      setEditCardContent('');
    }
  };

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  const isCustomBg = settings.backgroundId === 'custom' && settings.customImage;
  const currentBg = BOARD_BACKGROUNDS.find(bg => bg.id === settings.backgroundId) || BOARD_BACKGROUNDS[0];
  const boardBg = isDark ? '#0a0a0c' : '#f0f0f5';

  // Get modal card from latest Redux state
  const activeModalCard = modalCard ? board.cards[modalCard.card.id] : null;

  return (
    <div
      className="relative flex h-full w-full min-h-screen overflow-hidden transition-colors duration-300"
      style={
        isCustomBg
          ? { background: boardBg, backgroundImage: `url(${settings.customImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: boardBg }
      }
    >
      {!isCustomBg && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[70%] pointer-events-none z-0"
          style={{ background: currentBg.aurora, filter: 'blur(80px)', opacity: isDark ? 0.85 : 0.65 }}
        />
      )}
      <div className="relative z-10 flex w-full p-6 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex h-full items-start gap-5">
                {board.columnOrder.map((columnId, index) => {
                  const column = board.columns[columnId];
                  if (!column) return null;
                  const searchQuery = board.searchQuery || '';
                  
                  // Base search filtering
                  let cards = column.cardIds
                    .map((cardId) => board.cards[cardId])
                    .filter(Boolean)
                    .filter((card) => card.content.toLowerCase().includes(searchQuery.toLowerCase()));

                  // Apply client-side sorting if column.sortBy is configured
                  const sortBy = column.sortBy || 'none';
                  if (sortBy === 'alphabetical') {
                    cards = [...cards].sort((a, b) => a.content.localeCompare(b.content));
                  } else if (sortBy === 'dueDate') {
                    cards = [...cards].sort((a, b) => {
                      if (!a.dueDate) return 1;
                      if (!b.dueDate) return -1;
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    });
                  } else if (sortBy === 'createdAt') {
                    cards = [...cards].sort((a, b) => {
                      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    });
                  }

                  return (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided, snapshot) => (
                        <ColumnItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          column={column}
                          isDragging={snapshot.isDragging}
                          cardCount={column.cardIds.length}
                          onAddCard={() => setAddingCardToColumn(column.id)}
                          onDeleteColumn={() => dispatch(deleteColumn(column.id))}
                        >
                          <Droppable droppableId={column.id} type="card">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex flex-col gap-2 min-h-[50px] rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-black/5 dark:bg-white/5' : ''}`}
                              >
                                {cards.map((card, index) => (
                                  <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={sortBy !== 'none'}>
                                    {(provided, snapshot) => (
                                      editingCardId === card.id ? (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="glass-card rounded-xl p-3 ring-1 ring-indigo-500/40">
                                          <Input autoFocus value={editCardContent} onChange={(e) => setEditCardContent(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleEditCard(card.id); if (e.key === 'Escape') setEditingCardId(null); }}
                                            className="bg-transparent border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/90 focus:border-indigo-500/50"
                                          />
                                          <div className="flex gap-2 mt-2">
                                            <Button size="sm" onClick={() => handleEditCard(card.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-lg">{t.save}</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingCardId(null)} className="text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5">
                                              <X size={16} />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <CardItem ref={provided.innerRef} {...provided.draggableProps} dragHandleProps={provided.dragHandleProps} card={card} isDragging={snapshot.isDragging}
                                          onClick={() => setModalCard({ card, columnId: column.id })}
                                          onEdit={() => { setEditingCardId(card.id); setEditCardContent(card.content); }}
                                          onDelete={() => dispatch(deleteCard({ columnId: column.id, cardId: card.id }))}
                                        />
                                      )
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                                {addingCardToColumn === column.id && (
                                  <div className="glass-card rounded-xl p-3 ring-1 ring-indigo-500/30">
                                    <textarea autoFocus className="w-full resize-none outline-none text-sm p-1.5 bg-transparent text-gray-700 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/25 rounded-lg"
                                      placeholder={t.enterCardTitle} value={newCardContent} onChange={(e) => setNewCardContent(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(column.id); } if (e.key === 'Escape') setAddingCardToColumn(null); }}
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                      <Button size="sm" onClick={() => handleAddCard(column.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-lg">{t.addCard}</Button>
                                      <Button size="sm" variant="ghost" onClick={() => setAddingCardToColumn(null)} className="text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5">
                                        <X size={16} />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </ColumnItem>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                <div className="w-80 shrink-0">
                  {isAddingColumn ? (
                    <div className="glass-column rounded-2xl p-4">
                      <Input autoFocus placeholder={t.enterListTitle} value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') setIsAddingColumn(false); }}
                        className="bg-transparent border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/90 focus:border-indigo-500/50 rounded-xl"
                      />
                      <div className="flex items-center gap-2 mt-3">
                        <Button onClick={handleAddColumn} className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-lg">{t.addList}</Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsAddingColumn(false)} className="text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                          <X size={20} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsAddingColumn(true)} className="flex w-full items-center gap-2 rounded-2xl add-btn-glow p-4 text-gray-400 dark:text-white/40 font-medium hover:text-gray-600 dark:hover:text-white/70 transition-all">
                      <Plus size={20} />
                      {t.addAnotherList}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Card Modal */}
      {activeModalCard && modalCard && (
        <CardModal
          card={activeModalCard}
          columnId={modalCard.columnId}
          open={true}
          onOpenChange={(open) => { if (!open) setModalCard(null); }}
        />
      )}
    </div>
  );
}
