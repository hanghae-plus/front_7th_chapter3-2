---
name: hook-design
description: Custom Hook design following Headless UI pattern. Use when extracting logic from components, creating reusable stateful logic, or implementing the Facade/Strategy/Observer patterns in hooks.
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Hook Design Skill

Guide for designing Custom Hooks with proper separation of concerns and Headless UI principles.

## Core Principles

### 1. Layer Separation via Custom Hooks

When a component does too much (business logic + UI logic mixed), create Custom Hooks to delegate logic. This combines Facade + Strategy + Observer patterns.

```typescript
// Before: Everything in component
function EventForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title) newErrors.title = 'Required';
    if (!date) newErrors.date = 'Required';
    if (startTime >= endTime) newErrors.time = 'Invalid range';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ... lots more logic
}

// After: Logic delegated to Custom Hook
function EventForm() {
  const { formData, errors, updateField, validate, reset } = useEventForm();

  return (
    <form>
      <Input
        value={formData.title}
        onChange={e => updateField('title', e.target.value)}
        error={errors.title}
      />
      {/* Pure UI rendering */}
    </form>
  );
}
```

### 2. Cohesion and Coupling

**Group values that must be together (high cohesion)**, separate unrelated values (low coupling):

```typescript
// Bad: Low cohesion - unrelated concerns mixed
function useCalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('light');
  // Too many unrelated concerns!
}

// Good: High cohesion - related concerns grouped
function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const goToNext = () => setCurrentDate(d => addMonths(d, 1));
  const goToPrev = () => setCurrentDate(d => subMonths(d, 1));
  const goToToday = () => setCurrentDate(new Date());
  return { currentDate, goToNext, goToPrev, goToToday };
}

function useEventSelection() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectEvent = (id: string) => setSelectedEventId(id);
  const clearSelection = () => setSelectedEventId(null);
  return { selectedEventId, selectEvent, clearSelection };
}
```

### 3. Headless UI Pattern

Hooks should NOT return UI (JSX). Return only **data (State)** and **behavior (Handlers)**:

```typescript
// Bad: Hook returns JSX
function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const Modal = ({ children }) => (
    isOpen ? <div className="modal">{children}</div> : null
  );

  return { Modal, open: () => setIsOpen(true) };
}

// Good: Hook returns data and handlers only
function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
}

// Usage: Component handles rendering
function EventDialog() {
  const modal = useModal();

  return (
    <>
      <button onClick={modal.open}>Add Event</button>
      {modal.isOpen && (
        <Dialog onClose={modal.close}>
          <EventForm />
        </Dialog>
      )}
    </>
  );
}
```

### 4. Hook Composition

Build complex hooks by composing simpler ones:

```typescript
function useCalendar() {
  const navigation = useCalendarNavigation();
  const events = useCalendarEvents();
  const selection = useEventSelection();

  // Derived data from composed hooks
  const eventsForCurrentMonth = useMemo(
    () => filterEventsByMonth(events.data, navigation.currentDate),
    [events.data, navigation.currentDate]
  );

  return {
    ...navigation,
    ...selection,
    events: eventsForCurrentMonth,
    isLoading: events.isLoading,
  };
}
```

## Checklist

When creating or reviewing hooks:

- [ ] Does the hook have a single, clear responsibility?
- [ ] Are related values grouped together (high cohesion)?
- [ ] Are unrelated concerns in separate hooks (low coupling)?
- [ ] Does the hook return only data and handlers (no JSX)?
- [ ] Are complex hooks composed from simpler hooks?
- [ ] Are callbacks memoized with useCallback where appropriate?
