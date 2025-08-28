import { Event } from '../types';
import { getWeekDates, isDateInRange } from './dateUtils';

function filterEventsByDateRange(events: Event[], start: Date, end: Date): Event[] {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return isDateInRange(eventDate, start, end);
  });
}

function containsTerm(target: string, term: string) {
  return target.toLowerCase().includes(term.toLowerCase());
}

function searchEvents(events: Event[], term: string) {
  return events.filter(
    ({ title, description, location }) =>
      containsTerm(title, term) || containsTerm(description, term) || containsTerm(location, term)
  );
}

function filterEventsByDateRangeAtWeek(events: Event[], currentDate: Date) {
  const weekDates = getWeekDates(currentDate);
  return filterEventsByDateRange(events, weekDates[0], weekDates[6]);
}

function filterEventsByDateRangeAtMonth(events: Event[], currentDate: Date) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return filterEventsByDateRange(events, monthStart, monthEnd);
}

export function getFilteredEvents(
  events: Event[],
  searchTerm: string,
  currentDate: Date,
  view: 'week' | 'month'
): Event[] {
  const searchedEvents = searchEvents(events, searchTerm);

  if (view === 'week') {
    return filterEventsByDateRangeAtWeek(searchedEvents, currentDate);
  }

  if (view === 'month') {
    return filterEventsByDateRangeAtMonth(searchedEvents, currentDate);
  }

  return searchedEvents;
}

export function createRepeatEvents(events: Event[]) {
  const createdEvents: Event[] = [];

  events.forEach((event) => {
    const { type, endDate } = event.repeat;

    if (type === 'none') {
      createdEvents.push(event);
      return;
    }

    const startDate = new Date(event.date);
    const repeatEndDate = new Date(endDate ?? '');

    const push = (d: Date) => {
      if (d <= repeatEndDate) {
        createdEvents.push({
          ...event,
          date: d.toISOString().split('T')[0],
        });
      }
    };

    if (type === 'daily') {
      for (let d = new Date(startDate); d <= repeatEndDate; d.setDate(d.getDate() + 1)) {
        push(new Date(d));
      }
      return;
    }

    if (type === 'weekly') {
      for (let d = new Date(startDate); d <= repeatEndDate; d.setDate(d.getDate() + 7)) {
        push(new Date(d));
      }
      return;
    }

    if (type === 'monthly') {
      const anchorDay = startDate.getDate();
      let y = startDate.getFullYear();
      let m = startDate.getMonth();

      while (true) {
        const candidate = new Date(y, m, anchorDay);

        if (candidate > repeatEndDate) break;

        if (candidate.getMonth() === m && candidate.getDate() === anchorDay) {
          push(candidate);
        }

        m += 1;
        if (m > 11) {
          m = 0;
          y += 1;
        }
      }
      return;
    }

    if (type === 'yearly') {
      const anchorDay = startDate.getDate();
      const anchorMonth = startDate.getMonth();
      let y = startDate.getFullYear();

      while (true) {
        const candidate = new Date(y, anchorMonth, anchorDay);

        if (candidate > repeatEndDate) break;

        if (candidate.getMonth() === anchorMonth && candidate.getDate() === anchorDay) {
          push(candidate);
        }
        y += 1;
      }
      return;
    }
  });

  return createdEvents;
}
