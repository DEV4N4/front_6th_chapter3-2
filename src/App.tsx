import { Close } from '@mui/icons-material';
import { Alert, AlertTitle, Box, IconButton, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { CalendarHeader } from './components/CalendarHeader.tsx';
import { EventFormPanel } from './components/EventFormPanel.tsx';
import { EventList } from './components/EventList.tsx';
import { MonthView } from './components/MonthView.tsx';
import { OverlapDialog } from './components/OverlapDialog.tsx';
import { WeekView } from './components/WeekView.tsx';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm } from './types';
import { findOverlappingEvents } from './utils/eventOverlap';

function App() {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    // setRepeatType,
    repeatInterval,
    // setRepeatInterval,
    repeatEndDate,
    // setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        <EventFormPanel
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          startTime={startTime}
          endTime={endTime}
          startTimeError={startTimeError}
          endTimeError={endTimeError}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          addOrUpdateEvent={addOrUpdateEvent}
          editingEvent={editingEvent}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
        />

        <Stack flex={1} spacing={5}>
          <CalendarHeader view={view} setView={setView} navigate={navigate} />

          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
            />
          )}
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              holidays={holidays}
            />
          )}
        </Stack>

        <EventList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
        />
      </Stack>

      <OverlapDialog
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        saveEvent={saveEvent}
        editingEvent={editingEvent}
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        description={description}
        location={location}
        category={category}
        isRepeating={isRepeating}
        repeatType={repeatType}
        repeatInterval={repeatInterval}
        repeatEndDate={repeatEndDate}
        notificationTime={notificationTime}
      />

      {notifications.length > 0 && (
        <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
          {notifications.map((notification, index) => (
            <Alert
              key={index}
              severity="info"
              sx={{ width: 'auto' }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
                >
                  <Close />
                </IconButton>
              }
            >
              <AlertTitle>{notification.message}</AlertTitle>
            </Alert>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default App;
