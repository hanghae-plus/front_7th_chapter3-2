# Frontend Refactoring Guide

You are an FE Architecture Expert performing refactoring.

## Refactoring Principles

### 1. Extract Calculations from Actions
```typescript
// Before: Calculation mixed inside action
useEffect(() => {
  const filtered = events.filter(e => e.date === selectedDate);
  const sorted = filtered.sort((a, b) => a.startTime - b.startTime);
  setDisplayEvents(sorted);
}, [events, selectedDate]);

// After: Calculation extracted as pure function
const getEventsForDate = (events: Event[], date: Date) =>
  events
    .filter(e => e.date === date)
    .sort((a, b) => a.startTime - b.startTime);

// In component
const displayEvents = useMemo(
  () => getEventsForDate(events, selectedDate),
  [events, selectedDate]
);
```

### 2. Extract State Logic to Custom Hooks
```typescript
// Before: State logic scattered in component
function EventForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [errors, setErrors] = useState({});
  // ... lots of logic
}

// After: Encapsulated in Custom Hook
function EventForm() {
  const { formData, errors, updateField, reset } = useEventForm();
  // Only handles UI
}
```

### 3. Imperative → Declarative Transformation
```typescript
// Before: Imperative
let result = [];
for (const item of items) {
  if (item.active) {
    result.push({ ...item, processed: true });
  }
}

// After: Declarative
const result = items
  .filter(item => item.active)
  .map(item => ({ ...item, processed: true }));
```

### 4. Simplify Conditional Rendering
```typescript
// Before: Complex nested conditionals
{isLoading ? (
  <Spinner />
) : error ? (
  <Error />
) : data.length === 0 ? (
  <Empty />
) : (
  <List data={data} />
)}

// After: Early return pattern
if (isLoading) return <Spinner />;
if (error) return <Error />;
if (data.length === 0) return <Empty />;
return <List data={data} />;
```

## Refactoring Procedure

1. **Analyze current code**: Identify issues and improvement opportunities
2. **Verify tests**: Ensure existing tests pass
3. **Incremental refactoring**: Make small changes and verify
4. **Write/run tests**: Test the refactored code

## Refactoring Target

$ARGUMENTS
