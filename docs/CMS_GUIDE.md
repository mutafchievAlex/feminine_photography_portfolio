# Динамично управление на текстове (CMS)

## Преглед

Системата позволява на администраторите да редактират текстове на сайта директно от страниците без да се налага да променят кода. Всички промени се съхраняват в Supabase база данни.

## Как работи?

### 1. Компонент `EditableText`
Този компонент обвива текст и позволява inline редактиране за администраторите:

```jsx
import EditableText from '../components/EditableText';

<EditableText
  contentKey="hero_subtitle"
  onUpdate={updateContent}
  className="text-xl text-gray-600"
  as="p"
  multiline={false}
>
  Default text here
</EditableText>
```

**Параметри:**
- `contentKey` - Уникален ключ за съхранение в базата (string)
- `onUpdate` - Функция за запазване (callback)
- `className` - CSS класове (string)
- `as` - HTML елемент (p, h1, h2, div, etc.)
- `multiline` - Дали е многоредов текст (boolean)
- `children` - Подразумеван текст

### 2. Hook `usePageContent`
Този hook управлява всички операции с динамични текстове:

```jsx
import { usePageContent } from '../hooks/usePageContent';
import { useLanguage } from '../hooks/useLanguage';

const MyComponent = () => {
  const { language } = useLanguage();
  const { getText, updateContent, loading } = usePageContent('about', language);

  return (
    <>
      <p>{getText('my_text_key', 'default value')}</p>
      <EditableText
        contentKey="my_text_key"
        onUpdate={updateContent}
      >
        {getText('my_text_key', 'default value')}
      </EditableText>
    </>
  );
};
```

**Методи:**
- `getText(key, fallback)` - Получи текст по ключ или fallback стойност
- `updateContent(key, value)` - Запази промяна в базата
- `loading` - Дали се зарежда
- `error` - Ако има грешка

### 3. База данни (`page_content`)
Таблица със следните полета:
- `id` - UUID
- `key` - Уникален идентификатор на текста
- `value` - Самият текст
- `language` - Език (en, bg)
- `page_name` - На каква страница е (about, portfolio, etc.)
- `section_name` - В каква секция (hero, philosophy, etc.) - опционално
- `description` - Описание на текста за админите - опционално
- `created_at` - Дата на създаване
- `updated_at` - Дата на последна промяна

## Как да добавиш нов редактируем текст?

### Стъпка 1: Импортирай компонентите
```jsx
import EditableText from '../components/EditableText';
import { usePageContent } from '../hooks/usePageContent';
import { useLanguage } from '../hooks/useLanguage';
```

### Стъпка 2: Инициализирай hook
```jsx
const { language } = useLanguage();
const { getText, updateContent } = usePageContent('page-name', language);
```

### Стъпка 3: Обвий текста
```jsx
// Вместо това:
<p>{t('someKey')}</p>

// Направи това:
<EditableText
  contentKey="some_key_name"
  onUpdate={updateContent}
  className="text-xl"
  as="p"
>
  {getText('some_key_name', t('someKey'))}
</EditableText>
```

## Работен процес на администратор

1. **Логване** - Админ трябва да е логнал като администратор
2. **Отиване на страница** - Отиди на страната с редактируемия текст
3. **Намиране на текста** - На всеки редактируем текст ще видиш малка икона за редактиране (на хувър)
4. **Кликване** - Кликни на иконата за редактиране
5. **Редактиране** - Напиши новия текст
6. **Запазване** - Натисни "Save" или Enter (за еднолинийни текстове)
7. **Отказване** - Натисни "Cancel" или Escape за отмяна

## Безопасност

- Само администраторите могат да редактират содържание
- RLS политики в Supabase осигуряват защита
- Всички промени се логват с `updated_at` timestamp

## Текущо интегрирани страници

### About Page
- `hero_subtitle` - Подзаглавие на хероа
- `hero_prose_text` - Основен текст в хероа
- `philosophy_paragraph_1` - Първи параграф на философията
- `philosophy_paragraph_2` - Втори параграф на философията
- `philosophy_paragraph_3` - Трети параграф на философията
- `call_to_action_title` - Заглавие на CTA
- `call_to_action_description` - Описание на CTA
- `locations_description` - Описание на локацииите

## Пример: Добавяне на редактируем текст

```jsx
// Преди (хардкодиран текст)
<h1>{t('pageTitle')}</h1>

// След (редактируем)
<EditableText
  contentKey="page_title"
  onUpdate={updateContent}
  className="text-4xl font-bold"
  as="h1"
>
  {getText('page_title', t('pageTitle'))}
</EditableText>
```

## Съвети

- Използвай евтинам ключове (snake_case): `hero_subtitle`, `philosophy_text`
- За дълги текстове сетни `multiline={true}`
- Винаги давай fallback стойност чрез `t()` функцията
- Тестирай администраторския режим преди production
