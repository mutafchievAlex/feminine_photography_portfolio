# Panel Background Images

Тази папка съдържа фоновите изображения за всеки панел в "Let's Work Together" секцията.

## Текущи файлове:

- **artistic-vision.svg** - Топла светлобежова композиция със шумови текстури
- **professional-experience.svg** - Лавандова композиция с линийни текстури
- **personalized-approach.svg** - Светлозелена композиция с вълнови текстури

## Как да замените снимките:

### Опция 1: Добавете собствени JPG/PNG снимки
Просто замените SVG файловете с ваши собствени снимки:
```
artistic-vision.jpg       → /public/assets/images/panel-backgrounds/
professional-experience.jpg
personalized-approach.jpg
```

### Опция 2: Модифицирайте WhyChooseSection.jsx
Добавете image пропърти към differentiators:

```jsx
const differentiators = [
  {
    id: 1,
    icon: "Palette",
    image: "/assets/images/panel-backgrounds/artistic-vision.svg",
    // ... остатък на данните
  },
  {
    id: 2,
    icon: "Award",
    image: "/assets/images/panel-backgrounds/professional-experience.svg",
    // ... остатък на данните
  },
  {
    id: 3,
    icon: "Heart",
    image: "/assets/images/panel-backgrounds/personalized-approach.svg",
    // ... остатък на данните
  }
];
```

Тогава добавете в JSX:
```jsx
{item?.image && (
  <img 
    src={item?.image} 
    alt={item?.title?.[language]}
    className="w-full h-40 object-cover rounded-lg mb-4"
  />
)}
```

## Препоръчани размери:
- **Ширина:** 500px или по-голяма
- **Височина:** 300px
- **Формат:** JPG, PNG или SVG

## Цветна схема:
За съответствие с дизайна, използвайте цветите:
- Artistic Vision: #E8D5C4 (топла светлобежова)
- Professional Experience: #D4C5D9 (лавандова)
- Personalized Approach: #C8DCD6 (светлозелена)
