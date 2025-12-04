---
name: state-management
description: State management strategy following minimal state and server/client separation. Use when designing state architecture, optimizing state updates, or integrating server state with Tanstack Query patterns.
allowed-tools: Read, Glob, Grep, Edit, Write
---

# State Management Skill

Guide for managing state with minimal footprint and clear separation of server and client concerns.

## Core Principles

### 1. Minimize State

Reduce variable declarations. Values computable from existing state should be **derived data (Computed Values)**:

```typescript
// Bad: Redundant state
function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    setFilteredEvents(events.filter(e => e.date === selectedDate));
  }, [events, selectedDate]);

  useEffect(() => {
    setEventCount(filteredEvents.length);
  }, [filteredEvents]);
}

// Good: Derived data
function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  // Derived: computed from existing state
  const filteredEvents = useMemo(
    () => events.filter(e => e.date === selectedDate),
    [events, selectedDate]
  );

  // Derived: no state needed
  const eventCount = filteredEvents.length;
}
```

### 2. Separate Server State from Client State

API async data follows server state management patterns (caching, synchronization) via Tanstack Query. Do NOT mix with UI state:

```typescript
// Bad: Server and client state mixed
function EventPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchEvents()
      .then(setEvents)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);
}

// Good: Clear separation
function EventPage() {
  // Server state: managed by Tanstack Query
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  // Client state: UI-only concerns
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const modal = useModal();

  // Derived from server state
  const selectedEvent = useMemo(
    () => events?.find(e => e.id === selectedEventId),
    [events, selectedEventId]
  );
}
```

### 3. State Location Strategy

Place state at the appropriate level:

```typescript
// Local state: Component-specific UI state
function EventCard({ event }: { event: Event }) {
  const [isExpanded, setIsExpanded] = useState(false); // Local only
  return (/* ... */);
}

// Lifted state: Shared between siblings
function EventPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <EventList date={selectedDate} />
    </>
  );
}

// Context: Cross-cutting concerns
const NotificationContext = createContext<NotificationContextType | null>(null);

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify }}>
      {children}
    </NotificationContext.Provider>
  );
}
```

### 4. Immutable Updates

Always return new objects instead of mutating:

```typescript
// Bad: Mutation
function addEvent(events: Event[], newEvent: Event) {
  events.push(newEvent); // Mutates original!
  return events;
}

// Good: Immutable
function addEvent(events: Event[], newEvent: Event): Event[] {
  return [...events, newEvent];
}

// Good: Complex updates with immer pattern
function updateEvent(events: Event[], id: string, updates: Partial<Event>): Event[] {
  return events.map(event =>
    event.id === id ? { ...event, ...updates } : event
  );
}

// Good: Nested updates
function updateEventTitle(
  calendar: Calendar,
  eventId: string,
  newTitle: string
): Calendar {
  return {
    ...calendar,
    events: calendar.events.map(event =>
      event.id === eventId ? { ...event, title: newTitle } : event
    ),
  };
}
```

### 5. Action Patterns for Complex State

For complex state transitions, use reducer pattern:

```typescript
type EventAction =
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: { id: string; updates: Partial<Event> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_EVENTS'; payload: Event[] };

function eventReducer(state: Event[], action: EventAction): Event[] {
  switch (action.type) {
    case 'ADD_EVENT':
      return [...state, action.payload];
    case 'UPDATE_EVENT':
      return state.map(event =>
        event.id === action.payload.id
          ? { ...event, ...action.payload.updates }
          : event
      );
    case 'DELETE_EVENT':
      return state.filter(event => event.id !== action.payload);
    case 'SET_EVENTS':
      return action.payload;
    default:
      return state;
  }
}
```

## Checklist

When designing or reviewing state:

- [ ] Is the state minimal? No redundant values that can be derived?
- [ ] Is server state separated from client state?
- [ ] Is server state managed with proper caching (Tanstack Query)?
- [ ] Is state placed at the appropriate level (local/lifted/context)?
- [ ] Are all updates immutable (new objects returned)?
- [ ] Is complex state logic using reducer pattern?
