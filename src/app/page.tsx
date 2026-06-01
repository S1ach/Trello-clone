import { BoardWidget } from '@/widgets/board/BoardWidget';
import { HeaderWidget } from '@/widgets/header/HeaderWidget';
import { LocaleToggle } from '@/widgets/locale-toggle/LocaleToggle';

export default function Home() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <HeaderWidget />
      <main className="flex-1 overflow-hidden h-full">
        <BoardWidget />
      </main>
      <LocaleToggle />
    </div>
  );
}
