import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

import { Event, EventForm, RepeatType } from '../types';

interface OverlapDialogProps {
  isOverlapDialogOpen: boolean;
  setIsOverlapDialogOpen: (isOpen: boolean) => void;
  overlappingEvents: Event[];
  saveEvent: (event: Event | EventForm) => void;
  editingEvent: Event | null;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  isRepeating: boolean;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  notificationTime: number;
}

export const OverlapDialog = ({
  isOverlapDialogOpen,
  setIsOverlapDialogOpen,
  overlappingEvents,
  saveEvent,
  editingEvent,
  title,
  date,
  startTime,
  endTime,
  description,
  location,
  category,
  isRepeating,
  repeatType,
  repeatInterval,
  repeatEndDate,
  notificationTime,
}: OverlapDialogProps) => {
  return (
    <Dialog open={isOverlapDialogOpen} onClose={() => setIsOverlapDialogOpen(false)}>
      <DialogTitle>일정 겹침 경고</DialogTitle>
      <DialogContent>
        <DialogContentText>
          다음 일정과 겹칩니다:
          {overlappingEvents.map((event) => (
            <Typography key={event.id}>
              {event.title} ({event.date} {event.startTime}-{event.endTime})
            </Typography>
          ))}
          계속 진행하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOverlapDialogOpen(false)}>취소</Button>
        <Button
          color="error"
          onClick={() => {
            setIsOverlapDialogOpen(false);
            saveEvent({
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
            });
          }}
        >
          계속 진행
        </Button>
      </DialogActions>
    </Dialog>
  );
};
