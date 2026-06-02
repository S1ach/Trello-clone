# 🌌 Trello Clone Aurora

Премиальный, ультрасовременный клон Trello, построенный на **Next.js 15**, методологии **Feature-Sliced Design (FSD)**, **Prisma ORM** и потрясающем интерактивном интерфейсе в стиле glassmorphism.

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![FSD Architecture](https://img.shields.io/badge/Архитектура-Feature--Sliced_Design-50BFF2.svg)](https://feature-sliced.design/)


---

## 🖼️ Preview

<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/7b00cdd1-5b55-4bc5-a95b-529903157fa4" alt="Trello Clone Board" width="100%" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/a7df1b5f-e0bc-46b1-9aa4-2d2f3f8f6cef" alt="Trello Clone Dashboard" width="100%" />
    </td>
  </tr>
</table>

---


## 🚀 Основные особенности

*   **🎨 Уникальный дизайн и эффект стекла (Glassmorphism):** Компоненты с полупрозрачными размытыми фонами, градиентами Aurora и поддержкой загрузки пользовательских изображений для кастомизации доски.
*   **🌙 Профессиональная темная тема:** Чистый матово-черный интерфейс (`#0a0a0c`) без сине-фиолетовых оттенков, снижающий нагрузку на глаза и повышающий концентрацию.
*   **📊 Аналитическая панель (Dashboard):** ИнтерактивныеBurndown-диаграммы сгорания задач, учет дедлайнов, разделение по приоритетам и подробная статистика.
*   **🌐 Двуязычный интерфейс (i18n):** Мгновенное переключение всего интерфейса между **английским** и **русским** языками в один клик.
*   **⚡ Архитектура Feature-Sliced Design (FSD):** Идеально масштабируемая, декуплированная структура папок, разделяющая код по слоям для легкой поддержки.
*   **💾 Локальная база данных SQLite:** Интеграция с **Prisma ORM** для реактивного сохранения Drag & Drop изменений, карточек, списков и чек-листов.

---

## 🛠️ Технологический стек

| Категория | Технологии |
| :--- | :--- |
| **Основной фреймворк** | React 19, Next.js 15 (App Router), TypeScript |
| **Стилизация** | Tailwind CSS v4, Lucide React, Radix UI Primitives |
| **Управление стейтом** | Redux Toolkit (RTK) |
| **База данных и ORM** | SQLite, Prisma ORM |
| **Стандарты качества** | ESLint, Prettier, Husky Pre-commit хуки |

---

## 📂 Структура проекта (FSD)

```yaml
src/
├── app/                  # Роутинг, глобальные конфигурации хранилища (Redux Store) и провайдеры
├── entities/             # Бизнес-сущности с изолированными слайсами (Board, Card, Column, Settings)
│   ├── board/
│   └── settings/
├── shared/               # Переиспользуемые компоненты UI-kit, API клиенты, переводы i18n и хелперы
│   ├── lib/
│   └── ui/
└── widgets/              # Композитные виджеты, объединяющие фичи (Board, Dashboard, Header)
    ├── board/
    ├── dashboard/
    ├── header/
    └── locale-toggle/
```

---

## ⚙️ Быстрый запуск и установка

Выполните следующие шаги, чтобы запустить проект локально:

### 1. Клонируйте репозиторий и установите зависимости
```bash
git clone https://github.com/S1ach/Trello-clone.git
cd Trello-clone
npm install
```

### 2. Сгенерируйте локальную базу данных Prisma
Создайте SQLite базу данных и таблицы с начальными тестовыми данными:
```bash
npx prisma db push
```

### 3. Запустите сервер разработки
```bash
npm run dev
```
Откройте **[http://localhost:3000](http://localhost:3000)** в браузере.

---

## 🛡️ Безопасность и оптимизация

*   **Безопасный роутинг:** Next.js 15 предотвращает прямой доступ и утечку конфиденциальных API-ключей.
*   **Оптимальный рендеринг:** Размытие и эффекты стекла оптимизированы для аппаратного ускорения видеокартой (GPU) для плавности интерфейса при 60+ FPS.
*   **Локальная приватность:** Все загружаемые фоны и задачи SQLite хранятся исключительно на вашем локальном компьютере.
