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
    let currentDate = new Date(startDate);

    while (currentDate <= repeatEndDate) {
      createdEvents.push({
        ...event,
        date: currentDate.toISOString().split('T')[0],
      });

      if (type === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (type === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      }

      if (type === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      if (type === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }
  });

  return createdEvents;
}
