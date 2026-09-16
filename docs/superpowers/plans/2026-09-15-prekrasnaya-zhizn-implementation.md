# «Прекрасная жизнь» — план реализации MVP

> **Для агентных исполнителей:** ОБЯЗАТЕЛЬНЫЙ НАВЫК: использовать `superpowers:subagent-driven-development` (рекомендуется) или `superpowers:executing-plans`, выполнять задачи по одной и отмечать шаги чекбоксами `- [ ]`.

**Цель:** Создать и подготовить к публикации одностраничный статический сайт центра «Прекрасная жизнь», который доступно представляет три направления и приводит посетителя к звонку или переходу в Telegram.

**Архитектура:** Astro генерирует единственную страницу из типизированных данных и небольших серверных компонентов без клиентского рантайма по умолчанию. Прогрессивное улучшение на чистом TypeScript добавляет вкладки, мобильное меню и FAQ, сохраняя весь контент доступным без JavaScript. Общие контакты и публикационные статусы хранятся централизованно, а сборка для production блокируется, пока демонстрационные или неподтверждённые данные не заменены реальными.

**Технологии:** Astro, TypeScript, CSS, Vitest, Testing Library DOM, Playwright, axe-core, Lighthouse CI.

**Спецификация:** `docs/superpowers/specs/2026-09-15-prekrasnaya-zhizn-prd.md`

## Общие ограничения

- Одна адаптивная страница; минимальная ширина 320 px, контрольные ширины 360, 768, 1024 и 1440 px.
- Статическая сборка создаётся в `dist`; Node.js на hoster.by не требуется.
- JavaScript используется только для вкладок, мобильного меню и FAQ; весь содержательный контент доступен без JavaScript.
- По умолчанию открыто направление «Психология»; поддерживаются `#speech`, `#psychology`, `#bowls`, неизвестный хеш ведёт к «Психологии».
- WCAG 2.2 AA для основных сценариев; один `h1`, видимый фокус, сенсорные цели около 44 × 44 px, поддержка `prefers-reduced-motion`.
- Lighthouse Performance, Accessibility и SEO — не ниже 90 для production-сборки.
- Контакты разработки: `tel:+375290000000` и `https://t.me/prekrasnaya_zhizn_demo`; production-сборка с ними запрещена.
- Реальные профили специалистов, отзывы и фотографии публикуются только после подтверждения владельцем и получения разрешений.
- Не добавлять форму, сбор персональных данных, оплату, личный кабинет, блог, карту, аналитику, цены, расписание или мультиязычность.
- Тексты не содержат диагнозов, лечебных обещаний, запугивания или утверждений о профилактике старения и деменции.
- Палитра: `#1F5C50`, `#2B6D64`, `#DCE9E4`, `#F4F8F6`, `#17334A`, `#FFFFFF`; основной шрифт Manrope с системным sans-serif fallback.

---

## Карта файлов

```text
.
├── astro.config.mjs                 # статическая сборка, site URL, интеграции
├── package.json                     # команды dev/build/test/quality
├── tsconfig.json                    # строгий TypeScript
├── playwright.config.ts             # браузерные и визуальные проверки
├── vitest.config.ts                 # unit/DOM-тесты
├── lighthouserc.cjs                 # пороги Lighthouse
├── public/
│   ├── fonts/manrope-latin-cyrillic.woff2
│   ├── robots.txt
│   └── favicon.svg
├── scripts/
│   ├── assert-production-ready.mjs  # публикационный gate
│   └── verify-build.mjs             # проверка dist и внутренних ссылок
├── src/
│   ├── components/
│   │   ├── About.astro
│   │   ├── Audience.astro
│   │   ├── ChessProgram.astro
│   │   ├── ContactActions.astro
│   │   ├── ContactSection.astro
│   │   ├── Directions.astro
│   │   ├── Faq.astro
│   │   ├── FinalCta.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── MeetingFormat.astro
│   │   ├── MobileContactBar.astro
│   │   ├── Professionals.astro
│   │   └── Testimonials.astro
│   ├── content/
│   │   ├── contacts.ts              # единый телефон и Telegram
│   │   ├── directions.ts            # направления и услуги
│   │   ├── faq.ts                   # вопросы и ответы
│   │   └── trust.ts                 # специалисты, отзывы, разрешения
│   ├── layouts/BaseLayout.astro      # head, метаданные и общий каркас
│   ├── lib/
│   │   ├── dom.ts                   # общие DOM-утилиты
│   │   ├── faq.ts                   # управление disclosure
│   │   ├── menu.ts                  # управление мобильным меню
│   │   └── tabs.ts                  # доступный tab-паттерн и hash routing
│   ├── pages/index.astro             # композиция блоков страницы
│   ├── scripts/main.ts               # безопасная инициализация поведения
│   ├── styles/global.css             # токены, layout, responsive, focus
│   └── types/content.ts              # типы контента и публикации
└── tests/
    ├── e2e/
    │   ├── accessibility.spec.ts
    │   ├── contacts.spec.ts
    │   ├── directions.spec.ts
    │   ├── faq.spec.ts
    │   ├── navigation.spec.ts
    │   ├── no-js.spec.ts
    │   ├── responsive.spec.ts
    │   └── seo.spec.ts
    ├── fixtures/approved-content.ts
    └── unit/
        ├── production-ready.test.ts
        └── tabs.test.ts
```

## Задача 1: Инициализировать Astro и контур качества

**Файлы:**
- Создать: `package.json`
- Создать: `.gitignore`
- Создать: `astro.config.mjs`
- Создать: `tsconfig.json`
- Создать: `vitest.config.ts`
- Создать: `playwright.config.ts`
- Создать: `lighthouserc.cjs`
- Создать: `src/pages/index.astro`
- Создать: `src/styles/global.css`

**Интерфейсы:**
- Создаёт команды `dev`, `build`, `preview`, `test:unit`, `test:e2e`, `test:a11y`, `test:lighthouse`, `quality`.
- Создаёт локальный URL проверки `http://127.0.0.1:4321` и каталог результата `dist/`.

- [x] **Шаг 1: инициализировать репозиторий и исключения**

  Текущий каталог не является Git-репозиторием. Выполнить `git init`, затем создать `.gitignore` с `node_modules/`, `dist/`, `.astro/`, `playwright-report/`, `test-results/`, `.lighthouseci/` и локальными `.env*`, сохранив разрешение для `.env.example`.

- [x] **Шаг 2: создать минимальный манифест и конфигурацию Astro**

  В `package.json` определить ESM-проект и зависимости `astro`, `typescript`, `vitest`, `@testing-library/dom`, `jsdom`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`. Зафиксировать команды:

  ```json
  {
    "scripts": {
      "dev": "astro dev",
      "build": "astro check && astro build",
      "preview": "astro preview --host 127.0.0.1",
      "test:unit": "vitest run",
      "test:e2e": "playwright test",
      "test:a11y": "playwright test tests/e2e/accessibility.spec.ts",
      "test:lighthouse": "lhci autorun",
      "quality": "npm run test:unit && npm run build && npm run test:e2e"
    }
  }
  ```

- [x] **Шаг 3: настроить строгую статическую сборку**

  В `astro.config.mjs` задать `output: 'static'`, `site: process.env.SITE_URL ?? 'https://example.invalid'`, `trailingSlash: 'never'`; в `tsconfig.json` расширить `astro/tsconfigs/strict`.

- [x] **Шаг 4: настроить тестовые раннеры**

  Vitest использует `jsdom` для `tests/unit/**/*.test.ts`. Playwright запускает Chromium, Firefox и WebKit против `npm run preview`, предварительно выполняя `npm run build`. В `lighthouserc.cjs` проверять собранную главную страницу и пороги `0.9` для `performance`, `accessibility`, `seo`.

- [x] **Шаг 5: создать smoke-страницу и базовый CSS reset**

  `src/pages/index.astro` должен вернуть валидный документ с `lang="ru"`, одним `h1` и ссылкой перехода к основному содержанию. `global.css` должен включить `box-sizing: border-box`, адаптивные изображения и `overflow-wrap: break-word`.

- [x] **Шаг 6: установить зависимости и проверить чистый старт**

  Выполнить `npm install`, `npx playwright install`, затем `npm run build`. Ожидается: Astro создаёт `dist/index.html`, проверка типов и сборка завершаются без ошибок.

- [x] **Шаг 7: зафиксировать основу**

  ```bash
  git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts lighthouserc.cjs src
  git commit -m "chore: bootstrap Astro quality toolchain"
  ```

## Задача 2: Создать типизированную модель контента и единые контакты

**Файлы:**
- Создать: `src/types/content.ts`
- Создать: `src/content/contacts.ts`
- Создать: `src/content/directions.ts`
- Создать: `src/content/faq.ts`
- Создать: `src/content/trust.ts`
- Создать: `tests/fixtures/approved-content.ts`

**Интерфейсы:**
- Производит `type DirectionId = 'speech' | 'psychology' | 'bowls'`.
- Производит `contacts: ContactConfig`, `directions: Direction[]`, `faqItems: FaqItem[]`, `professionals: Professional[]`, `testimonials: Testimonial[]`.
- Поля публикации используют `approval: 'demo' | 'approved'` и `consent: boolean`.

- [ ] **Шаг 1: описать контракты данных**

  ```ts
  export type DirectionId = 'speech' | 'psychology' | 'bowls';
  export type Audience = 'teen' | 'parent' | 'adult';
  export type Approval = 'demo' | 'approved';

  export interface ContactConfig {
    phoneDisplay: string;
    phoneHref: `tel:${string}`;
    telegramHref: `https://t.me/${string}`;
    approval: Approval;
  }

  export interface Service {
    id: string;
    title: string;
    description: string;
    audiences: Audience[];
  }

  export interface Direction {
    id: DirectionId;
    label: string;
    services: Service[];
  }

  export interface FaqItem { id: string; question: string; answer: string }
  export interface Professional {
    id: string;
    name: string;
    role: string;
    focus: string[];
    qualification: string;
    photo: { src: string; alt: string; width: number; height: number };
    approval: Approval;
    photoConsent: boolean;
  }
  export interface Testimonial {
    id: string;
    quote: string;
    attribution: string;
    approval: Approval;
    authorConsent: boolean;
  }
  ```

- [ ] **Шаг 2: перенести контакты без дублирования**

  В `contacts.ts` экспортировать ровно один объект с демонстрационным телефоном, отображаемым номером и Telegram из PRD. Компоненты не должны содержать литералы `tel:` или `t.me`.

- [ ] **Шаг 3: перенести 12 услуг и аудитории**

  `directions.ts` должен содержать четыре услуги для каждого направления, точные заголовки и описания из раздела 8 PRD. Для каждой услуги явно указать аудитории; для «Диалог с ребёнком» — `parent`, для «Поддержка для взрослых» и практик чаш — `adult`, для подростковых программ — `teen`.

- [ ] **Шаг 4: перенести шесть обязательных FAQ**

  Добавить вопросы: кому подходят занятия, как выбрать направление, как проходит первая встреча, работают ли специалисты с подростками, где находится центр, как записаться. Ответ про адрес не должен выдумывать улицу: указать только очный формат в Минске и предложение уточнить место по телефону или Telegram.

- [ ] **Шаг 5: задать безопасные demo-данные доверительных блоков**

  `trust.ts` экспортирует пустые массивы реальных специалистов и отзывов, а также нейтральные редакционные состояния для тестового сайта. Не создавать вымышленные имена, квалификации, отзывы или фотографии. `approved-content.ts` содержит валидный фикстурный профиль и отзыв с `approval: 'approved'` и обоими consent-флагами `true`, используемые только тестами.

- [ ] **Шаг 6: проверить типы и зафиксировать**

  Выполнить `npx astro check`. Ожидается: 0 ошибок. Затем:

  ```bash
  git add src/types src/content tests/fixtures
  git commit -m "feat: add typed site content"
  ```

## Задача 3: Реализовать базовый layout, дизайн-токены и SEO head

**Файлы:**
- Создать: `src/layouts/BaseLayout.astro`
- Изменить: `src/styles/global.css`
- Создать: `public/fonts/manrope-latin-cyrillic.woff2`
- Создать: `public/favicon.svg`
- Изменить: `src/pages/index.astro`
- Создать: `tests/e2e/seo.spec.ts`

**Интерфейсы:**
- `BaseLayout` принимает `{ title: string; description: string; canonicalPath?: string }`.
- Создаёт DOM-якорь `#main-content`, общий `<main>` и подключает `/src/scripts/main.ts` как module script.

- [x] **Шаг 1: написать падающий SEO-тест**

  Проверить, что `/` имеет `lang="ru"`, ровно один `h1`, утверждённые `title` и `meta[name=description]`, canonical URL, Open Graph title/description и доступную skip-link. Запустить `npx playwright test tests/e2e/seo.spec.ts`; ожидается FAIL из-за отсутствующих метаданных.

- [x] **Шаг 2: реализовать `BaseLayout`**

  Использовать title «Прекрасная жизнь — центр психологии и речи в Минске» и description из раздела 17.2 PRD. Добавить `meta viewport`, `meta charset`, canonical на основе `Astro.site`, OG title/description/type/url и favicon. Не добавлять OG image и аналитику.

- [x] **Шаг 3: ввести визуальные токены**

  В `:root` определить именованные CSS custom properties для всей палитры PRD, размеров контейнера, отступов, радиусов, теней и четырёх уровней типографики. Подключить локальный Manrope через `@font-face` с `font-display: swap`; body использует системный fallback.

- [x] **Шаг 4: задать глобальную доступность**

  Добавить контрастный `:focus-visible`, skip-link, минимальную высоту 44 px для основных действий, `scroll-margin-top` для якорных секций и отключение необязательных transitions внутри `@media (prefers-reduced-motion: reduce)`.

- [ ] **Шаг 5: запустить тест и зафиксировать**

  `npx playwright test tests/e2e/seo.spec.ts` должен завершиться PASS.

  ```bash
  git add src/layouts src/styles src/pages public tests/e2e/seo.spec.ts
  git commit -m "feat: add accessible layout and metadata"
  ```

## Задача 4: Собрать статическую структуру страницы и ключевой контент

**Файлы:**
- Создать: `src/components/Hero.astro`
- Создать: `src/components/About.astro`
- Создать: `src/components/Audience.astro`
- Создать: `src/components/MeetingFormat.astro`
- Создать: `src/components/ChessProgram.astro`
- Создать: `src/pages/index.astro`
- Создать: `tests/e2e/no-js.spec.ts`

**Интерфейсы:**
- Все секции имеют стабильные id: `hero`, `directions`, `chess-program`, `about`, `audience`, `format`, `professionals`, `testimonials`, `faq`, `contacts`.
- `ChessProgram` не принимает клиентское состояние и всегда присутствует в HTML.

- [x] **Шаг 1: написать падающий no-JS тест**

  Создать browser context с `javaScriptEnabled: false`. Проверить наличие обязательного hero-текста, всех трёх названий направлений, всех 12 услуг, заголовка «Шахматы и мышление», текста о группе как мини-социуме, секций «О центре», «Кому подходят занятия» и «Как проходят встречи». Ожидаемый первый запуск: FAIL.

- [x] **Шаг 2: реализовать первый экран**

  `Hero.astro` содержит точные название, категорию, заголовок, подзаголовок и «Очные занятия в Минске» из PRD. Единственный `h1` — «Профессиональная поддержка рядом»; название центра выводится как текст бренда, а не дополнительный `h1`.

- [x] **Шаг 3: реализовать информационные секции**

  `About`, `Audience`, `MeetingFormat` используют короткие абзацы, различают подростков, родителей и взрослых и не добавляют неподтверждённых цен, длительности встреч, адреса или методик.

- [ ] **Шаг 4: реализовать полный блок шахматной программы**

  Перенести основной текст, пять наблюдаемых навыков и текст «Группа как мини-социум» из раздела 9. Не использовать слова о профилактике или лечении заболеваний. Связать блок с карточкой услуги ссылкой `href="#chess-program"`.

- [ ] **Шаг 5: собрать порядок страницы**

  В `index.astro` расположить компоненты строго в порядке раздела 6 PRD. Пока несуществующие компоненты обозначить семантическими секциями с окончательными id и заголовками; удалить эти оболочки в соответствующих последующих задачах.

- [ ] **Шаг 6: проверить no-JS и зафиксировать**

  Выполнить `npx playwright test tests/e2e/no-js.spec.ts`; ожидается PASS.

  ```bash
  git add src/components src/pages/index.astro tests/e2e/no-js.spec.ts
  git commit -m "feat: add static page content"
  ```

## Задача 5: Реализовать прогрессивно улучшенные вкладки направлений

**Файлы:**
- Создать: `src/components/Directions.astro`
- Создать: `src/lib/dom.ts`
- Создать: `src/lib/tabs.ts`
- Создать: `src/scripts/main.ts`
- Создать: `tests/unit/tabs.test.ts`
- Создать: `tests/e2e/directions.spec.ts`

**Интерфейсы:**
- `initTabs(root: HTMLElement): () => void` инициализирует один tablist и возвращает cleanup.
- DOM использует `[data-tabs]`, `[role=tab]`, `[role=tabpanel]`, `aria-controls`, `aria-labelledby`, `aria-selected`, `tabindex`.
- Допустимые hash id определяются единожды как `DIRECTION_IDS: readonly DirectionId[]`.

- [x] **Шаг 1: написать unit-тесты tab-контракта**

  Проверить: default — psychology; корректный hash активирует соответствующую панель; неизвестный hash возвращает psychology; клик меняет hash без перезагрузки; ArrowLeft/Right циклически меняют вкладку и фокус; Home/End переходят к первой/последней; Enter и Space активируют сфокусированную вкладку; cleanup снимает listeners.

- [x] **Шаг 2: запустить unit-тесты и подтвердить падение**

  Выполнить `npx vitest run tests/unit/tabs.test.ts`. Ожидается FAIL: модуль `src/lib/tabs.ts` отсутствует.

- [x] **Шаг 3: отрендерить доступный HTML направлений**

  `Directions.astro` проходит по `directions` и выводит три кнопки вкладок и три панели с карточками. Без атрибута `data-enhanced` все панели видимы последовательно; скрытие неактивных панелей применяется CSS только к `[data-tabs][data-enhanced=true]`.

- [x] **Шаг 4: реализовать hash routing и клавиатуру**

  `initTabs` валидирует hash, синхронизирует `aria-selected`, `tabindex`, `hidden`, URL и фокус. При `hashchange` обновляет UI. Для начального неизвестного hash заменяет его на `#psychology` через `history.replaceState`, не добавляя лишнюю запись истории.

- [x] **Шаг 5: написать и выполнить e2e-проверки**

  Проверить мышь, Tab, Enter, Space, стрелки, прямой переход на каждый hash и reload. Проверить, что активная вкладка различается текстом/иконкой состояния, а не только цветом. `npx playwright test tests/e2e/directions.spec.ts` и unit-тест должны завершиться PASS.

- [x] **Шаг 6: зафиксировать**

  ```bash
  git add src/components/Directions.astro src/lib src/scripts tests/unit/tabs.test.ts tests/e2e/directions.spec.ts
  git commit -m "feat: add accessible direction tabs"
  ```

## Задача 6: Добавить шапку, якорную навигацию и мобильное меню

**Файлы:**
- Создать: `src/components/Header.astro`
- Создать: `src/lib/menu.ts`
- Изменить: `src/scripts/main.ts`
- Создать: `tests/e2e/navigation.spec.ts`

**Интерфейсы:**
- `initMenu(root: HTMLElement): () => void` управляет элементом `[data-mobile-menu]`.
- Кнопка меню содержит `aria-expanded`, `aria-controls="primary-navigation"`, доступное название «Открыть меню»/«Закрыть меню».

- [ ] **Шаг 1: написать падающие e2e-тесты**

  Проверить desktop-якоря, открытие меню Enter/Space, закрытие Escape, закрытие после выбора ссылки, возврат фокуса на кнопку и отсутствие tab-stop у закрытых ссылок. Ожидается FAIL до реализации.

- [ ] **Шаг 2: реализовать семантическую шапку**

  Добавить бренд, ссылки «Направления», «О центре», «Специалисты», «Отзывы», «Вопросы», «Контакты» и кнопку связи. Для мобильного режима кнопка управляет тем же `<nav id="primary-navigation">`.

- [ ] **Шаг 3: реализовать управление меню**

  Синхронизировать `hidden` и `aria-expanded`, закрывать меню по Escape, выбору ссылки и переходу на desktop breakpoint. Не блокировать нативное поведение якорей; `scroll-margin-top` компенсирует sticky header.

- [ ] **Шаг 4: проверить клавиатурный сценарий и зафиксировать**

  `npx playwright test tests/e2e/navigation.spec.ts` должен завершиться PASS.

  ```bash
  git add src/components/Header.astro src/lib/menu.ts src/scripts/main.ts tests/e2e/navigation.spec.ts
  git commit -m "feat: add responsive site navigation"
  ```

## Задача 7: Добавить FAQ как доступный disclosure-компонент

**Файлы:**
- Создать: `src/components/Faq.astro`
- Создать: `src/lib/faq.ts`
- Изменить: `src/scripts/main.ts`
- Создать: `tests/e2e/faq.spec.ts`

**Интерфейсы:**
- `initFaq(root: HTMLElement): () => void` управляет кнопками `[data-faq-trigger]`.
- Каждая кнопка использует `aria-expanded` и `aria-controls`; ответ имеет соответствующий id.

- [ ] **Шаг 1: написать падающие тесты FAQ**

  Проверить шесть вопросов, раскрытие мышью, Enter и Space, программное изменение `aria-expanded`, независимое открытие нескольких ответов и читаемость всех ответов без JavaScript.

- [ ] **Шаг 2: отрендерить прогрессивный HTML**

  До инициализации ответы видимы. После установки `data-enhanced="true"` скрипт сворачивает ответы; CSS скрывает только элементы с нативным `hidden`.

- [ ] **Шаг 3: реализовать disclosure-логику**

  Использовать нативные `<button>` и менять только `aria-expanded`/`hidden`; не перехватывать стандартные клавиши кнопки вручную. Возвращать cleanup-функцию.

- [ ] **Шаг 4: выполнить тесты и зафиксировать**

  `npx playwright test tests/e2e/faq.spec.ts tests/e2e/no-js.spec.ts` должен завершиться PASS.

  ```bash
  git add src/components/Faq.astro src/lib/faq.ts src/scripts/main.ts tests/e2e/faq.spec.ts
  git commit -m "feat: add accessible FAQ disclosures"
  ```

## Задача 8: Реализовать единые CTA и мобильную контактную панель

**Файлы:**
- Создать: `src/components/ContactActions.astro`
- Создать: `src/components/ContactSection.astro`
- Создать: `src/components/FinalCta.astro`
- Создать: `src/components/Footer.astro`
- Создать: `src/components/MobileContactBar.astro`
- Изменить: `src/components/Hero.astro`
- Изменить: `src/components/Header.astro`
- Изменить: `src/components/Directions.astro`
- Создать: `tests/e2e/contacts.spec.ts`

**Интерфейсы:**
- `ContactActions` принимает `{ placement: 'header' | 'hero' | 'directions' | 'contacts' | 'final' | 'mobile' }`.
- Каждый телефон имеет `data-contact-kind="phone"` и стабильный id `contact-phone-<placement>`; Telegram — аналогично `contact-telegram-<placement>`.

- [ ] **Шаг 1: написать падающий тест консистентности контактов**

  Проверить, что все `[data-contact-kind=phone]` имеют один `href`, все Telegram-ссылки имеют один `href`, Telegram использует `target="_blank" rel="noopener noreferrer"`, видимый номер присутствует в контактах, CTA есть после направлений, в контактах и финальном блоке.

- [ ] **Шаг 2: реализовать переиспользуемые действия**

  `ContactActions` читает только `contacts.ts`, выводит текстовые подписи «Позвонить» и «Написать в Telegram» и не прячет номер за иконкой. Иконки, если используются, имеют `aria-hidden="true"`.

- [ ] **Шаг 3: расставить CTA по пути пользователя и завершить подвал**

  Подключить действия в Header, Hero, после Directions, в ContactSection, FinalCta и MobileContactBar. Финальный блок находится перед Footer. `Footer.astro` повторяет название центра, видимый телефон, Telegram и навигацию по ключевым якорям; в нём нет формы, аналитики и неподтверждённых юридических реквизитов.

- [ ] **Шаг 4: сделать мобильную панель безопасной**

  Панель показывается только на мобильном breakpoint, учитывает `env(safe-area-inset-bottom)`, имеет высоту в CSS-переменной и добавляет эквивалентный `padding-bottom` странице, чтобы не перекрывать последние строки и элементы браузера.

- [ ] **Шаг 5: выполнить тест и зафиксировать**

  `npx playwright test tests/e2e/contacts.spec.ts` должен завершиться PASS.

  ```bash
  git add src/components src/content/contacts.ts tests/e2e/contacts.spec.ts
  git commit -m "feat: add consistent contact actions"
  ```

## Задача 9: Реализовать специалисты и отзывы с безопасным demo-состоянием

**Файлы:**
- Создать: `src/components/Professionals.astro`
- Создать: `src/components/Testimonials.astro`
- Изменить: `src/pages/index.astro`
- Создать: `tests/unit/production-ready.test.ts`
- Создать: `scripts/assert-production-ready.mjs`

**Интерфейсы:**
- `assertProductionReady({ contacts, professionals, testimonials }): void` выбрасывает ошибку со списком нарушений.
- Production готов только если контакты approved, есть минимум один approved-профиль с photoConsent, а каждый опубликованный отзыв approved и имеет authorConsent.

- [ ] **Шаг 1: написать падающие тесты gate**

  Проверить отдельные ошибки для demo-контактов, пустого списка специалистов, неподтверждённой квалификации, отсутствия разрешения на фото, неподтверждённого отзыва и отсутствия разрешения автора. Проверить PASS на `approved-content.ts`.

- [ ] **Шаг 2: реализовать чистую функцию проверки**

  Вынести проверку в экспортируемую функцию, а CLI-обёртка завершает процесс ненулевым кодом и печатает каждый блокирующий пункт. Сообщения должны называть файл и поле для исправления.

- [ ] **Шаг 3: реализовать карточки без вымышленных данных**

  Если approved-профилей нет, `Professionals` показывает честный редакционный блок тестовой версии без имени, фото и квалификации. Если approved-отзывов нет, `Testimonials` не имитирует цитаты и сообщает, что материалы готовятся к публикации. Карусель не добавлять.

- [ ] **Шаг 4: подключить gate к production-команде**

  Добавить `build:production`: `node scripts/assert-production-ready.mjs && astro check && astro build`. Обычный `build` остаётся доступен для demo-проверки.

- [ ] **Шаг 5: проверить оба пути и зафиксировать**

  `npx vitest run tests/unit/production-ready.test.ts` — PASS. `npm run build:production` на demo-данных — ожидаемый FAIL с тремя понятными категориями: контакты, специалист, разрешённые материалы.

  ```bash
  git add src/components/Professionals.astro src/components/Testimonials.astro src/pages/index.astro scripts package.json tests
  git commit -m "feat: enforce publication content approval"
  ```

## Задача 10: Завершить адаптивный визуальный слой

**Файлы:**
- Изменить: `src/styles/global.css`
- Изменить: все `src/components/*.astro`, где нужны локальные классы/обёртки
- Создать: `tests/e2e/responsive.spec.ts`

**Интерфейсы:**
- Общие классы `.container`, `.section`, `.card-grid`, `.button`, `.button--primary`, `.button--secondary` задаются глобально.
- Компоненты не задают произвольные цвета вне токенов `:root`.

- [ ] **Шаг 1: написать проверки контрольных ширин**

  Для 320, 360, 768, 1024 и 1440 px проверить `document.documentElement.scrollWidth <= window.innerWidth`, отсутствие пересечений sticky-панели с footer/последним CTA, видимость активной вкладки и размер основных интерактивных областей не меньше 44 × 44 px.

- [ ] **Шаг 2: реализовать mobile-first сетку**

  На 320/360 px — одна колонка и компактные отступы; с 768 px — двухколоночные карточки; с 1024 px — сетки, соответствующие объёму контента; на 1440 px контент ограничен max-width и не растягивается на весь экран.

- [ ] **Шаг 3: оформить компоненты по PRD**

  Использовать глубокий зелёный для основных действий, шалфейные фоны секций, белые карточки с мягким радиусом и небольшой тенью, тёмный сине-зелёный текст. Активная вкладка получает заливку, контраст и видимый текстовый маркер состояния.

- [ ] **Шаг 4: проверить длинный контент и reduced motion**

  В тесте временно подставить длинный заголовок и убедиться, что карточка не выходит за viewport. Эмулировать `reducedMotion: 'reduce'` и проверить, что animation-duration/transition-duration для необязательных эффектов равны 0 или практически 0.

- [ ] **Шаг 5: выполнить responsive suite и зафиксировать**

  `npx playwright test tests/e2e/responsive.spec.ts` должен пройти во всех трёх браузерах.

  ```bash
  git add src/styles src/components tests/e2e/responsive.spec.ts
  git commit -m "feat: complete responsive visual system"
  ```

## Задача 11: Закрыть WCAG 2.2 AA и браузерные сценарии

**Файлы:**
- Создать: `tests/e2e/accessibility.spec.ts`
- Изменить: компоненты и CSS только по найденным дефектам

**Интерфейсы:**
- Axe запускается на default-состоянии и после открытия каждой интерактивной области.
- Серьёзность `serious` и `critical` блокирует merge; известные нарушения не исключаются без отдельного решения владельца продукта.

- [ ] **Шаг 1: добавить автоматизированный axe-аудит**

  Проверить страницу при загрузке, открытом mobile menu, каждом направлении и раскрытом FAQ. Проверять отсутствие `critical` и `serious` violations.

- [ ] **Шаг 2: добавить ручной клавиатурный маршрут как e2e**

  От skip-link пройти Tab по шапке, вкладкам, карточке шахмат, FAQ и финальным CTA. На каждом интерактивном элементе проверять ненулевой focus outline; в конце убедиться, что фокус не попал в скрытый контент.

- [ ] **Шаг 3: проверить семантику и изображения**

  Убедиться, что заголовки не пропускают уровни, landmarks имеют имена, содержательные изображения имеют непустой alt, декоративные имеют пустой alt и `aria-hidden`, у изображений указаны width/height.

- [ ] **Шаг 4: проверить контраст**

  Запустить axe color-contrast на каждом состоянии. Любую пару ниже AA исправить только изменением токенов и повторить полный аудит, чтобы одинаковые компоненты не разошлись.

- [ ] **Шаг 5: выполнить suite и зафиксировать**

  Выполнить `npm run test:a11y` и затем `npm run test:e2e`; ожидается PASS в Chromium, Firefox, WebKit.

  ```bash
  git add tests/e2e/accessibility.spec.ts src
  git commit -m "test: verify WCAG user journeys"
  ```

## Задача 12: Добавить статическое SEO и проверку production-артефакта

**Файлы:**
- Создать: `public/robots.txt`
- Создать: `src/pages/sitemap.xml.ts`
- Создать: `scripts/verify-build.mjs`
- Изменить: `src/layouts/BaseLayout.astro`
- Изменить: `src/components/ContactSection.astro`
- Изменить: `package.json`
- Изменить: `tests/e2e/seo.spec.ts`

**Интерфейсы:**
- `GET /sitemap.xml` возвращает XML с canonical главной страницы.
- `verify-build.mjs` принимает каталог `dist` и завершает процесс с кодом 1 при отсутствующем файле, ресурсе или битой внутренней ссылке.

- [ ] **Шаг 1: расширить падающие SEO-тесты**

  Проверить доступность `/robots.txt` и `/sitemap.xml`, canonical URL, отсутствие demo-домена при заданном `SITE_URL`, а также JSON-LD типа `Organization` с названием, Минском, телефоном и ссылкой Telegram.

- [ ] **Шаг 2: добавить robots и sitemap**

  `robots.txt` разрешает индексирование и ссылается на `${SITE_URL}/sitemap.xml`. Sitemap содержит одну индексируемую страницу без выдуманных lastmod/changefreq/priority.

- [ ] **Шаг 3: добавить структурированные данные**

  В `BaseLayout` сериализовать безопасный JSON-LD без HTML-инъекций. Использовать `Organization`, `name`, `url`, `telephone`, `addressLocality: "Минск"`, `sameAs` для Telegram и `hasOfferCatalog` с тремя направлениями и 12 услугами из `directions.ts`; не указывать точный адрес, цены, часы и медицинский тип организации.

- [ ] **Шаг 4: реализовать проверку dist**

  Скрипт проверяет наличие `index.html`, `robots.txt`, `sitemap.xml`, favicon и шрифта; собирает локальные `href/src` из HTML и подтверждает существование соответствующих файлов. Внешние, `tel:`, hash и Telegram URL пропускаются.

- [ ] **Шаг 5: включить проверку в сборку и зафиксировать**

  После `astro build` запускать `node scripts/verify-build.mjs dist`. Выполнить `SITE_URL=https://example.by npm run build` в совместимом с оболочкой формате и `npx playwright test tests/e2e/seo.spec.ts`; ожидается PASS.

  ```bash
  git add public src/pages/sitemap.xml.ts src/layouts src/components/ContactSection.astro scripts package.json tests/e2e/seo.spec.ts
  git commit -m "feat: add static SEO artifacts"
  ```

## Задача 13: Провести финальную приёмку и подготовить пакет для hoster.by

**Файлы:**
- Создать: `docs/deployment-hoster-by.md`
- Создать: `docs/content-approval.md`
- Изменить: `package.json`
- Изменить: `astro.config.mjs`

**Интерфейсы:**
- Команда `npm run release:check` последовательно выполняет production gate, unit/e2e, build verification и Lighthouse.
- Результат публикации — только содержимое `dist/`; исходники и `node_modules` на хостинг не загружаются.

- [ ] **Шаг 1: заменить demo-данные только полученными материалами**

  В `contacts.ts` внести фактический номер и Telegram, поставить `approval: 'approved'`. В `trust.ts` добавить минимум один реальный профиль с квалификацией, реальной фотографией и `photoConsent: true`; добавлять только отзывы с `authorConsent: true`. Зафиксировать источник и дату согласования в `docs/content-approval.md`, не помещая туда лишние персональные данные.

- [ ] **Шаг 2: получить редакционное подтверждение**

  В чеклисте `docs/content-approval.md` должны быть отдельные подтверждения: перечень услуг, тексты услуг, шахматные формулировки, тексты поющих чаш, профили, отзывы, права на фотографии, телефон и Telegram. Неподтверждённый пункт блокирует release.

- [ ] **Шаг 3: выполнить полный release-check**

  Выполнить `npm run release:check` с реальным `SITE_URL`. Ожидается: unit/e2e PASS, production build PASS, отсутствуют ошибки консоли и битые ресурсы, Lighthouse Performance/Accessibility/SEO ≥ 90.

- [ ] **Шаг 4: провести визуальную приёмку**

  Снять полноэкранные скриншоты на 320, 360, 768, 1024 и 1440 px в Chromium и дополнительно просмотреть Safari/WebKit. Проверить наложения, горизонтальную прокрутку, длинные карточки, активную вкладку, sticky-контакты и последние строки страницы. Обнаруженные дефекты исправлять в соответствующем компоненте и повторять весь `release:check`.

- [ ] **Шаг 5: описать публикацию на hoster.by**

  В `docs/deployment-hoster-by.md` зафиксировать: production-команду, загрузку содержимого `dist/` в document root, включение HTTPS, выбор единственной canonical-версии с `www` или без и серверный 301 redirect со второй версии. Конкретный синтаксис redirect указывать по фактической панели/веб-серверу hoster.by, проверенному перед публикацией.

- [ ] **Шаг 6: проверить опубликованный домен**

  После загрузки проверить HTTPS, 301 между версиями домена, главную страницу, три hash-ссылки, телефон, Telegram, robots, sitemap, отсутствие ошибок консоли и повторно запустить Lighthouse по рабочему URL.

- [ ] **Шаг 7: зафиксировать release-подготовку**

  ```bash
  git add src/content public docs package.json astro.config.mjs
  git commit -m "chore: prepare production release"
  ```

## Матрица покрытия PRD

| Требование | Задачи |
|---|---|
| IA и обязательный контент | 2, 4, 6–9 |
| Вкладки, hash, no-JS | 4, 5 |
| Телефон, Telegram, повторяющиеся CTA | 2, 8 |
| Мобильная навигация | 6 |
| FAQ | 7 |
| Специалисты, отзывы, разрешения | 9, 13 |
| Адаптивность и визуальный стиль | 3, 10 |
| WCAG 2.2 AA | 3, 5–8, 10, 11 |
| SEO, robots, sitemap, structured data | 3, 12 |
| Производительность и Lighthouse ≥ 90 | 1, 10–13 |
| Static hosting, HTTPS, canonical redirect | 12, 13 |
| Publication blockers | 2, 9, 13 |

## Definition of Done MVP

- Все 13 задач приняты независимо и их тесты проходят.
- `npm run release:check` проходит на реальных утверждённых данных.
- В `dist/` нет demo-контактов, вымышленных профилей, неподтверждённых отзывов и отсутствующих ресурсов.
- Все четыре пользовательских сценария PRD выполняются мышью, клавиатурой и на сенсорном viewport.
- Сайт читаем и содержит все направления при отключённом JavaScript.
- Рабочий домен открывается по HTTPS, имеет единственный canonical host и Lighthouse ≥ 90 по Performance, Accessibility и SEO.
