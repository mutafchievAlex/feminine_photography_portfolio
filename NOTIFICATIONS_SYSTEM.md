# Notifications System - Admin Dashboard

## Преглед

Системата за нотификации в Admin Dashboard сега е напълно динамична и показва реални данни от:
- Нови резервации (последните 24 часа)
- Activity logs
- Real-time нотификации (Supabase realtime)

## Функционалност

### ✅ Динамични нотификации

Нотификациите се генерират автоматично от:

1. **Нови резервации** 
   - Показват се резервации от последните 24 часа
   - Format: "Нова резервация от [име] за [тип сесия]"
   - Тип: `new_booking` (зелен цвят)

2. **Activity logs**
   - Системни дейности и промени
   - Различни типове: `info`, `reminder`, `urgent`

3. **Real-time нотификации**
   - Booking status updates
   - Нови съобщения
   - Gallery deliveries
   - User-specific notifications

### ✅ Persistent Dismissal

Затворените нотификации се запазват в `localStorage`:

```javascript
{
  id: "booking-123",
  timestamp: 1704567890123
}
```

**Features:**
- ✅ Затворени нотификации НЕ се показват отново
- ✅ Автоматично изчистване след 7 дни
- ✅ Синхронизация между browser tabs
- ✅ Запазване при refresh

### ✅ Типове нотификации

| Тип | Икона | Цвят | Описание |
|-----|-------|------|----------|
| `new_booking` | Calendar | Зелен | Нова резервация |
| `booking_status` | CheckCircle | Син | Промяна на статус |
| `personal_booking` | User | Лилав | Лична резервация |
| `message` | MessageSquare | Индиго | Ново съобщение |
| `gallery_delivery` | Image | Розов | Доставка на галерия |
| `urgent` | AlertTriangle | Червен | Спешно |
| `info` | Info | Син | Информация |
| `reminder` | Bell | Жълт | Напомняне |

## Използване

### Показване на нотификация

Нотификациите се показват автоматично, но можете ръчно да добавите:

```javascript
// В компонента
const { addNotification } = useRealtimeNotifications();

addNotification({
  type: 'new_booking',
  title: 'Нова резервация',
  message: 'Клиент John Doe направи резервация',
  data: { bookingId: '123' }
});
```

### Dismiss на нотификация

```javascript
const dismissNotification = (id) => {
  // Автоматично се записва в localStorage
  // и не се показва повече
};
```

### Изчистване на всички нотификации

```javascript
<Button onClick={() => {
  notifications?.forEach(n => dismissNotification(n?.id));
}}>
  Маркирай всички
</Button>
```

## Технически детайли

### LocalStorage Schema

```javascript
// Key: 'dismissedNotifications'
[
  {
    id: "booking-123",
    timestamp: 1704567890123
  },
  {
    id: "activity-456", 
    timestamp: 1704567890456
  }
]
```

### Auto Cleanup

```javascript
// Автоматично изчиства dismissed нотификации, по-стари от 7 дни
const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
const filtered = dismissed.filter(item => item.timestamp > sevenDaysAgo);
```

### Notifications Filtering

```javascript
// Филтрира dismissed нотификации
const isNotificationDismissed = (notifId) => {
  return dismissedNotifications.some(item => {
    if (typeof item === 'string') return item === notifId; // Legacy
    return item.id === notifId; // Current format
  });
};
```

## UI Features

### Responsive Design
- ✅ Mobile-friendly layout
- ✅ Smooth animations
- ✅ Color-coded по тип
- ✅ Hover effects

### Accessibility
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Clear visual hierarchy

## Performance

### Optimizations
- Максимум 10 нотификации едновременно
- Auto cleanup на стари dismissed records
- Efficient localStorage usage
- No re-renders on dismissed state changes

### Memory
- Dismissed notifications: ~1KB per 50 items
- Active notifications: Minimal (max 10)

## Testing

### Manual Testing

1. **Нова резервация**
   ```
   1. Създайте нова резервация през booking формата
   2. Проверете admin dashboard
   3. Трябва да се покаже нотификация със зелен цвят
   ```

2. **Dismiss функционалност**
   ```
   1. Затворете нотификация с X бутона
   2. Refresh страницата
   3. Нотификацията НЕ трябва да се покаже отново
   ```

3. **Auto cleanup**
   ```
   1. Ръчно променете timestamp в localStorage на стара дата
   2. Refresh страницата
   3. Старите dismissed records трябва да се изчистят
   ```

### Browser Console Testing

```javascript
// Проверка на dismissed notifications
localStorage.getItem('dismissedNotifications');

// Добавяне на test нотификация
const notifs = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
notifs.push({ id: 'test-123', timestamp: Date.now() });
localStorage.setItem('dismissedNotifications', JSON.stringify(notifs));

// Изчистване
localStorage.removeItem('dismissedNotifications');
```

## Troubleshooting

### Нотификациите не се показват

1. Проверете дали има данни в базата:
   ```javascript
   await bookingService.getAll();
   await activityService.getRecentActivities(5);
   ```

2. Проверете localStorage:
   ```javascript
   console.log(localStorage.getItem('dismissedNotifications'));
   ```

3. Проверете Supabase realtime connection

### Dismissed не работи

1. Проверете localStorage quota
2. Проверете browser privacy settings
3. Clear localStorage и опитайте отново

### Нотификации се дублират

1. Проверете дали има дублирани ID
2. Проверете merge логиката в useEffect
3. Проверете realtime subscriptions

## Future Enhancements

- [ ] Push notifications
- [ ] Email notifications digest
- [ ] Notification preferences
- [ ] Custom notification sounds
- [ ] Notification categories/filters
- [ ] Bulk actions (dismiss all of type)
- [ ] Notification history view
- [ ] Export notifications

## Migration Notes

### From Static to Dynamic

Старите статични нотификации са премахнати. Ако имате custom код:

**Преди:**
```javascript
const notifications = [
  { id: 1, message: 'Static notification' }
];
```

**Сега:**
```javascript
// Auto-generated от bookings + activities
// + realtime notifications
```

### LocalStorage Format Change

**Legacy (string array):**
```json
["booking-123", "activity-456"]
```

**Current (object array):**
```json
[
  {"id": "booking-123", "timestamp": 1704567890123},
  {"id": "activity-456", "timestamp": 1704567890456}
]
```

Системата поддържа и двата формата за backwards compatibility.

---

**Version:** 1.0  
**Last Updated:** January 5, 2026  
**Status:** Production Ready ✅
