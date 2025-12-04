---
name: refactoring
description: Systematic refactoring process following FP principles. Use when improving existing code, extracting logic, removing implicit I/O, or pushing side effects to the edges.
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Refactoring Skill

Systematic process for improving code following functional programming principles.

## Refactoring Steps

When asked to modify code, follow these steps in order:

### Step 1: Remove Implicit I/O

Functions should not read or write external variables. Convert to explicit arguments and return values:

```typescript
// Before: Implicit I/O
let selectedDate = new Date();
let events: Event[] = [];

function getEventsForSelectedDate() {
  return events.filter(e => e.date === selectedDate); // Reads external vars
}

function addEvent(event: Event) {
  events.push(event); // Writes external var
}

// After: Explicit I/O
function getEventsForDate(events: Event[], date: Date): Event[] {
  return events.filter(e => e.date === date);
}

function addEvent(events: Event[], event: Event): Event[] {
  return [...events, event]; // Returns new array
}
```

### Step 2: Extract Logic

Extract complex calculation logic from components into separate pure functions (utilities):

```typescript
// Before: Logic embedded in component
function EventForm() {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = () => {
    // Validation logic embedded
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    if (formData.startTime >= formData.endTime) {
      errors.time = 'End time must be after start time';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Submit logic...
  };
}

// After: Logic extracted to pure functions
// utils/validation.ts
export function validateEventForm(data: EventFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }
  if (!data.date) {
    errors.date = 'Date is required';
  }
  if (data.startTime >= data.endTime) {
    errors.time = 'End time must be after start time';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Component uses extracted function
function EventForm() {
  const handleSubmit = () => {
    const { isValid, errors } = validateEventForm(formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    // Submit logic...
  };
}
```

### Step 3: Separate Hooks

Bundle useEffect and useState blocks into Custom Hooks with domain meaning:

```typescript
// Before: State and effects scattered
function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchEvents(currentDate)
      .then(setEvents)
      .finally(() => setIsLoading(false));
  }, [currentDate]);

  const goToNextMonth = () => {
    setCurrentDate(d => addMonths(d, 1));
  };

  const goToPrevMonth = () => {
    setCurrentDate(d => subMonths(d, 1));
  };

  // ... more logic
}

// After: Hooks with domain meaning
function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToNextMonth = useCallback(() => {
    setCurrentDate(d => addMonths(d, 1));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(d => subMonths(d, 1));
  }, []);

  return { currentDate, goToNextMonth, goToPrevMonth };
}

function useCalendarEvents(date: Date) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchEvents(date)
      .then(setEvents)
      .finally(() => setIsLoading(false));
  }, [date]);

  return { events, isLoading };
}

// Clean component
function CalendarPage() {
  const { currentDate, goToNextMonth, goToPrevMonth } = useCalendarNavigation();
  const { events, isLoading } = useCalendarEvents(currentDate);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Component is now focused on composition
}
```

### Step 4: Defer Actions

Push side effects (actions) to the end of handlers or to top-level components:

```typescript
// Before: Actions scattered throughout
function EventForm({ onSuccess }) {
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    analytics.track('title_changed'); // Action in the middle
    localStorage.setItem('draft', e.target.value); // Another action
  };

  const handleSubmit = async () => {
    const result = validateForm(formData);
    if (!result.isValid) {
      showToast('Validation failed'); // Action
      return;
    }

    await saveEvent(formData); // Action
    analytics.track('event_created'); // Action
    onSuccess(); // Action
  };
}

// After: Actions deferred and grouped
function EventForm({ onSuccess }) {
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // Defer side effects
  };

  // Batch actions at submission
  const handleSubmit = async () => {
    // 1. Calculations first
    const result = validateForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    // 2. Actions at the end, grouped
    try {
      await saveEvent(formData);
      saveDraftToStorage(null); // Clear draft
      trackAnalytics('event_created', { title: formData.title });
      onSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  // Auto-save draft as separate effect (action at edge)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraftToStorage(formData);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);
}
```

## Refactoring Checklist

Before and after refactoring, verify:

- [ ] All functions have explicit inputs (arguments) and outputs (return values)
- [ ] Pure calculation logic is extracted to utility functions
- [ ] Related state and effects are grouped in Custom Hooks
- [ ] Custom Hooks have domain-meaningful names
- [ ] Side effects (actions) are pushed to edges (end of handlers, top-level)
- [ ] All state updates are immutable
- [ ] Tests pass (or new tests added for extracted functions)

## Common Patterns

### Extract and Test

```typescript
// 1. Identify calculation inside action
const handleFilter = () => {
  const filtered = events.filter(e =>
    e.title.includes(query) && e.date >= startDate
  );
  setFilteredEvents(filtered);
};

// 2. Extract to pure function
export const filterEvents = (
  events: Event[],
  query: string,
  startDate: Date
): Event[] => {
  return events.filter(e =>
    e.title.includes(query) && e.date >= startDate
  );
};

// 3. Test the pure function
describe('filterEvents', () => {
  it('filters by title query', () => {
    const events = [
      { title: 'Meeting', date: new Date() },
      { title: 'Lunch', date: new Date() },
    ];
    const result = filterEvents(events, 'Meet', new Date(0));
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Meeting');
  });
});

// 4. Use in component
const handleFilter = () => {
  const filtered = filterEvents(events, query, startDate);
  setFilteredEvents(filtered);
};
```
