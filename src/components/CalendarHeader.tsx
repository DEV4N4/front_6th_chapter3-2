import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';

interface CalendarHeaderProps {
  view: 'week' | 'month';
  setView: (view: 'week' | 'month') => void;
  navigate: (direction: 'prev' | 'next') => void;
}

export const CalendarHeader = ({ view, setView, navigate }: CalendarHeaderProps) => {
  return (
    <>
      <Typography variant="h4">일정 보기</Typography>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
          <ChevronLeft />
        </IconButton>
        <Select
          size="small"
          aria-label="뷰 타입 선택"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={() => navigate('next')}>
          <ChevronRight />
        </IconButton>
      </Stack>
    </>
  );
};
