---
name: component-design
description: React component design and implementation following separation of concerns. Use when creating new components, restructuring existing ones, or applying Container-Presenter and Compound Component patterns.
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Component Design Skill

Guide for designing and implementing React components with clear separation of UI and data concerns.

## Core Principles

### 1. Separate UI from Data

**Do NOT reuse components just because they look the same.** If the data characteristics differ (Entity vs Derived Data vs View Data), separate them.

Classify components by role:
- **UI Component**: Only handles styling and rendering (Pure)
- **Data Component**: Receives data and passes to UI

### 2. Container-Presenter Pattern

Separate logic (Container) from view (Presenter):

```typescript
// Container: Handles data and logic
function EventListContainer() {
  const { events, isLoading } = useEvents();
  const filteredEvents = filterEventsByDate(events, selectedDate);

  return <EventListPresenter events={filteredEvents} isLoading={isLoading} />;
}

// Presenter: Pure rendering only
function EventListPresenter({ events, isLoading }: Props) {
  if (isLoading) return <Spinner />;
  return (
    <ul>
      {events.map(event => <EventItem key={event.id} event={event} />)}
    </ul>
  );
}
```

### 3. Compound Component Pattern

For complex components, compose main and sub-components:

```typescript
// Usage
<Calendar>
  <Calendar.Header />
  <Calendar.Grid>
    {days.map(day => (
      <Calendar.Day key={day} date={day}>
        <Calendar.Events date={day} />
      </Calendar.Day>
    ))}
  </Calendar.Grid>
</Calendar>

// Implementation
const CalendarContext = createContext<CalendarContextType | null>(null);

function Calendar({ children }: { children: ReactNode }) {
  const calendarState = useCalendarState();
  return (
    <CalendarContext.Provider value={calendarState}>
      <div className="calendar">{children}</div>
    </CalendarContext.Provider>
  );
}

Calendar.Header = function CalendarHeader() {
  const { currentMonth, goToPrev, goToNext } = useCalendarContext();
  return (/* header JSX */);
};

Calendar.Day = function CalendarDay({ date, children }) {
  const { selectedDate, selectDate } = useCalendarContext();
  return (/* day JSX */);
};
```

### 4. Avoid Props Drilling

Use appropriate composition or Context API for dependency injection:

```typescript
// Bad: Props drilling
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserProfile user={user} />
    </Sidebar>
  </Layout>
</App>

// Good: Composition
<App>
  <Layout sidebar={<Sidebar><UserProfile user={user} /></Sidebar>}>
    {children}
  </Layout>
</App>

// Good: Context for cross-cutting concerns
const UserContext = createContext<User | null>(null);

function App() {
  const user = useAuth();
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}
```

## Checklist

When creating or reviewing components:

- [ ] Is the component's responsibility clear (UI only vs Data + UI)?
- [ ] Are data characteristics (Entity/Derived/View) properly distinguished?
- [ ] Is complex state logic delegated to Custom Hooks?
- [ ] Is props drilling avoided through composition or Context?
- [ ] Are compound components used for complex UI structures?
