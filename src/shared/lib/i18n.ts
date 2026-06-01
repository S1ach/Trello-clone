export type Locale = 'ru' | 'en';

export type Translations = typeof ru;

const ru = {
  // Header
  searchCards: 'Поиск карточек...',
  searchMobile: 'Поиск...',
  resetBoard: 'Сбросить доску',
  resetBoardConfirm: 'Вы уверены, что хотите сбросить доску? Все текущие списки и карточки будут удалены.',
  changeBackground: 'Сменить фон',
  toggleTheme: 'Переключить тему',
  auroraThemes: 'Темы',
  custom: 'Пользовательский',
  uploadImage: 'Загрузить фото',
  useUploadedImage: 'Использовать загруженное изображение',
  imageSizeError: 'Размер изображения должен быть менее 1.5МБ',
  maxSizeNote: 'Макс. размер 1.5МБ для LocalStorage',

  // Board
  addAnotherList: 'Добавить ещё список',
  addList: 'Добавить список',
  enterListTitle: 'Введите название списка...',
  addCard: 'Добавить карточку',
  enterCardTitle: 'Введите название карточки...',
  save: 'Сохранить',

  // Column
  deleteColumn: 'Удалить колонку',
  addACard: 'Добавить карточку',
  renameColumn: 'Переименовать',
  sortBy: 'Сортировка',
  sortNone: 'По умолчанию',
  sortAlphabetical: 'По алфавиту',
  sortDueDate: 'По дедлайну',
  sortCreatedAt: 'По дате создания',

  // Default board data
  defaultBoardTitle: 'Trello Clone',
  columnTodo: 'К выполнению',
  columnInProgress: 'В процессе',
  columnDone: 'Готово',
  cardDesignUI: 'Дизайн UI макета',
  cardSetupNextjs: 'Настройка проекта Next.js',
  cardConfigureRedux: 'Настройка Redux',

  // Background labels
  bgOcean: 'Океан',
  bgSunset: 'Закат',
  bgLavender: 'Лаванда',
  bgBlossom: 'Цветение',
  bgDeepBlue: 'Глубокий синий',
  bgLime: 'Лайм',
  bgForest: 'Лес',
  bgCoral: 'Коралл',

  // Loading
  loading: 'Загрузка...',

  // Card Modal
  description: 'Описание',
  descriptionPlaceholder: 'Добавить подробное описание...',
  labels: 'Метки',
  dueDate: 'Дедлайн',
  dueDateNone: 'Нет',
  checklist: 'Чеклист',
  addChecklistItem: 'Добавить пункт...',
  overdue: 'Просрочено',
  dueToday: 'Сегодня',
  dueTomorrow: 'Завтра',
  dueSoon: 'Скоро',
  close: 'Закрыть',
  deleteCardConfirm: 'Удалить эту карточку?',
  deleteCard: 'Удалить карточку',

  // Label colors
  labelGreen: 'Зелёный',
  labelYellow: 'Жёлтый',
  labelOrange: 'Оранжевый',
  labelRed: 'Красный',
  labelPurple: 'Фиолетовый',
  labelBlue: 'Синий',

  // Priorities
  priority: 'Приоритет',
  priorityLow: 'Низкий',
  priorityMedium: 'Средний',
  priorityHigh: 'Высокий',
  priorityNone: 'Нет',

  // Attachments
  attachments: 'Вложения',
  addAttachment: 'Добавить файл...',
  uploading: 'Загрузка...',

  // Notifications
  notifications: 'Уведомления',
  noNotifications: 'Нет новых уведомлений',
  approachingDeadline: 'Приближается дедлайн карточки',
  cardIsOverdue: 'Срок карточки истёк!',
  toastDeadlineTitle: 'Внимание!',
  toastDeadlineMessage: 'Карточка "{title}" требует внимания!',

  // Dashboard
  dashboard: 'Дашборд',
  analytics: 'Аналитика доски',
  totalTasks: 'Всего задач',
  completedTasks: 'Выполнено',
  pendingTasks: 'В процессе',
  overdueTasks: 'Просрочено',
  priorityDistribution: 'Распределение по приоритетам',
  burndownChart: 'Диаграмма сгорания задач',
  remainingTasks: 'Осталось задач',
  idealBurn: 'Идеальный график',
  days: 'Дни',
} as const;

const en: Translations = {
  // Header
  searchCards: 'Search cards...',
  searchMobile: 'Search...',
  resetBoard: 'Reset Board',
  resetBoardConfirm: 'Are you sure you want to reset the board? This will delete all your current lists and cards.',
  changeBackground: 'Change Background',
  toggleTheme: 'Toggle theme',
  auroraThemes: 'Aurora Themes',
  custom: 'Custom',
  uploadImage: 'Upload Image',
  useUploadedImage: 'Use uploaded image',
  imageSizeError: 'Image size must be less than 1.5MB',
  maxSizeNote: 'Max size 1.5MB for LocalStorage',

  // Board
  addAnotherList: 'Add another list',
  addList: 'Add List',
  enterListTitle: 'Enter list title...',
  addCard: 'Add Card',
  enterCardTitle: 'Enter a title for this card...',
  save: 'Save',

  // Column
  deleteColumn: 'Delete Column',
  addACard: 'Add a card',
  renameColumn: 'Rename',
  sortBy: 'Sort by',
  sortNone: 'None',
  sortAlphabetical: 'Alphabetical',
  sortDueDate: 'Due date',
  sortCreatedAt: 'Date created',

  // Default board data
  defaultBoardTitle: 'Trello Clone',
  columnTodo: 'To Do',
  columnInProgress: 'In Progress',
  columnDone: 'Done',
  cardDesignUI: 'Design UI mockup',
  cardSetupNextjs: 'Setup Next.js project',
  cardConfigureRedux: 'Configure Redux',

  // Background labels
  bgOcean: 'Ocean',
  bgSunset: 'Sunset',
  bgLavender: 'Lavender',
  bgBlossom: 'Blossom',
  bgDeepBlue: 'Deep Blue',
  bgLime: 'Lime',
  bgForest: 'Forest',
  bgCoral: 'Coral',

  // Loading
  loading: 'Loading...',

  // Card Modal
  description: 'Description',
  descriptionPlaceholder: 'Add a more detailed description...',
  labels: 'Labels',
  dueDate: 'Due Date',
  dueDateNone: 'None',
  checklist: 'Checklist',
  addChecklistItem: 'Add an item...',
  overdue: 'Overdue',
  dueToday: 'Today',
  dueTomorrow: 'Tomorrow',
  dueSoon: 'Soon',
  close: 'Close',
  deleteCardConfirm: 'Delete this card?',
  deleteCard: 'Delete Card',

  // Label colors
  labelGreen: 'Green',
  labelYellow: 'Yellow',
  labelOrange: 'Orange',
  labelRed: 'Red',
  labelPurple: 'Purple',
  labelBlue: 'Blue',

  // Priorities
  priority: 'Priority',
  priorityLow: 'Low',
  priorityMedium: 'Medium',
  priorityHigh: 'High',
  priorityNone: 'None',

  // Attachments
  attachments: 'Attachments',
  addAttachment: 'Attach file...',
  uploading: 'Uploading...',

  // Notifications
  notifications: 'Notifications',
  noNotifications: 'No new notifications',
  approachingDeadline: 'Card deadline is approaching',
  cardIsOverdue: 'Card is overdue!',
  toastDeadlineTitle: 'Attention!',
  toastDeadlineMessage: 'Card "{title}" needs attention!',

  // Dashboard
  dashboard: 'Dashboard',
  analytics: 'Board Analytics',
  totalTasks: 'Total Tasks',
  completedTasks: 'Completed',
  pendingTasks: 'In Progress',
  overdueTasks: 'Overdue',
  priorityDistribution: 'Priority Distribution',
  burndownChart: 'Burndown Chart',
  remainingTasks: 'Remaining Tasks',
  idealBurn: 'Ideal Burn',
  days: 'Days',
} as const;

const translations: Record<Locale, Translations> = { ru, en };

/** Get translations for a given locale */
export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.ru;
}

/** Label color definitions */
export const LABEL_COLORS = [
  { id: 'green', color: '#4CAF50', labelKey: 'labelGreen' as const },
  { id: 'yellow', color: '#FFB300', labelKey: 'labelYellow' as const },
  { id: 'orange', color: '#FF7043', labelKey: 'labelOrange' as const },
  { id: 'red', color: '#EF5350', labelKey: 'labelRed' as const },
  { id: 'purple', color: '#AB47BC', labelKey: 'labelPurple' as const },
  { id: 'blue', color: '#42A5F5', labelKey: 'labelBlue' as const },
];

/** Kept for backward-compat in non-reactive contexts (initial state, etc.) */
export const t = ru;
