import { Notifications } from '@mui/icons-material';
import {
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  TableBody,
  Table,
  Stack,
  Typography,
  Box,
} from '@mui/material';

import { weekDays } from '../constant.ts';
import { Event } from '../types';
import { formatWeek, getWeekDates } from '../utils/dateUtils';

export const WeekView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
}: {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
}) => {
  const weekDates = getWeekDates(currentDate);
  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDates.map((date) => (
                <TableCell
                  data-testid={`${date.getDate()}-day-cell`}
                  key={date.toISOString()}
                  sx={{
                    height: '120px',
                    verticalAlign: 'top',
                    width: '14.28%',
                    padding: 1,
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {date.getDate()}
                  </Typography>
                  {filteredEvents
                    .filter((event) => new Date(event.date).toDateString() === date.toDateString())
                    .map((event) => {
                      const isNotified = notifiedEvents.includes(event.id);
                      return (
                        <Box
                          data-testid="event-tag"
                          key={event.id}
                          sx={{
                            p: 0.5,
                            my: 0.5,
                            backgroundColor: isNotified ? '#ffebee' : '#f5f5f5',
                            borderRadius: 1,
                            fontWeight: isNotified ? 'bold' : 'normal',
                            color: isNotified ? '#d32f2f' : 'inherit',
                            minHeight: '18px',
                            width: '100%',
                            overflow: 'hidden',
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            {isNotified && <Notifications fontSize="small" />}
                            <Typography
                              variant="caption"
                              noWrap
                              sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                            >
                              {event.title}
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    })}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
