# Frontend Testing Guide

You are an FE Architecture Expert guiding test implementation.

## Testing Strategy Pyramid

```
        ┌─────────┐
        │  E2E    │  ← Minimal critical flows
       ─┴─────────┴─
      ┌─────────────┐
      │ Integration │  ← Component + Hook integration
     ─┴─────────────┴─
    ┌─────────────────┐
    │   Unit Tests    │  ← Focus on pure functions (calculations)
    └─────────────────┘
```

## Testing Priority

### Priority 1: Pure Function (Calculation) Tests
Easiest to test and most important business logic

```typescript
// utils/dateUtils.test.ts
describe('getWeekDates', () => {
  it('returns all dates of the week containing the given date', () => {
    const date = new Date('2024-03-15'); // Friday
    const result = getWeekDates(date);

    expect(result).toHaveLength(7);
    expect(result[0].getDay()).toBe(0); // Starts with Sunday
    expect(result[6].getDay()).toBe(6); // Ends with Saturday
  });
});

describe('formatEventTime', () => {
  it('formats start/end time', () => {
    expect(formatEventTime('09:00', '10:30')).toBe('09:00 - 10:30');
  });
});
```

### Priority 2: Custom Hook Tests
Verify correctness of state logic

```typescript
// hooks/useEventForm.test.ts
import { renderHook, act } from '@testing-library/react';

describe('useEventForm', () => {
  it('can update fields', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.updateField('title', 'New Event');
    });

    expect(result.current.formData.title).toBe('New Event');
  });

  it('performs validation', () => {
    const { result } = renderHook(() => useEventForm());

    expect(result.current.isValid).toBe(false); // Initially invalid

    act(() => {
      result.current.updateField('title', 'Test');
      result.current.updateField('date', new Date());
      result.current.updateField('startTime', '09:00');
      result.current.updateField('endTime', '10:00');
    });

    expect(result.current.isValid).toBe(true);
  });
});
```

### Priority 3: Component Integration Tests
Verify user interactions and rendering

```typescript
// components/EventForm.test.tsx
describe('EventForm', () => {
  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = vi.fn();
    render(<EventForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Title'), 'New Event');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Event' })
    );
  });
});
```

## Testing Rules

### Given-When-Then Pattern
```typescript
it('shows warning when events overlap', () => {
  // Given: Existing event exists
  const existingEvents = [createEvent({ startTime: '09:00', endTime: '10:00' })];

  // When: Attempting to create overlapping event
  const newEvent = { startTime: '09:30', endTime: '10:30' };
  const hasOverlap = checkEventOverlap(existingEvents, newEvent);

  // Then: Overlap is detected
  expect(hasOverlap).toBe(true);
});
```

### Test Data Factory
```typescript
// test/factories.ts
export const createEvent = (overrides?: Partial<Event>): Event => ({
  id: crypto.randomUUID(),
  title: 'Test Event',
  date: new Date(),
  startTime: '09:00',
  endTime: '10:00',
  ...overrides,
});
```

## Test Target

$ARGUMENTS
