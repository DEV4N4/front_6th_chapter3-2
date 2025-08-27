import {
  Stack,
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Tooltip,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import React from 'react';

import { categories, notificationOptions } from '../constant.ts';
import { Event, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';

interface EventFormPanelProps {
  title: string;
  setTitle: (title: string) => void;
  date: string;
  setDate: (date: string) => void;
  description: string;
  setDescription: (description: string) => void;
  location: string;
  setLocation: (location: string) => void;
  category: string;
  setCategory: (category: string) => void;
  startTime: string;
  endTime: string;
  startTimeError: string | null;
  endTimeError: string | null;
  handleStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addOrUpdateEvent: () => void;
  editingEvent: Event | null;
  isRepeating: boolean;
  setIsRepeating: (isRepeating: boolean) => void;
  notificationTime: number;
  setNotificationTime: (notificationTime: number) => void;
  repeatType: RepeatType;
  setRepeatType: (repeatType: RepeatType) => void;
  repeatInterval: number;
  setRepeatInterval: (repeatInterval: number) => void;
  repeatEndDate: string;
  setRepeatEndDate: (repeatEndDate: string) => void;
}

export const EventFormPanel = ({
  title,
  setTitle,
  date,
  setDate,
  description,
  setDescription,
  location,
  setLocation,
  category,
  setCategory,
  startTime,
  endTime,
  startTimeError,
  endTimeError,
  handleStartTimeChange,
  handleEndTimeChange,
  addOrUpdateEvent,
  editingEvent,
  isRepeating,
  setIsRepeating,
  notificationTime,
  setNotificationTime,
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
}: EventFormPanelProps) => {
  return (
    <Stack spacing={2} sx={{ width: '20%' }}>
      <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField
          id="title"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="date">날짜</FormLabel>
        <TextField
          id="date"
          size="small"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="start-time">시작 시간</FormLabel>
          <Tooltip title={startTimeError || ''} open={!!startTimeError} placement="top">
            <TextField
              id="start-time"
              size="small"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              error={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="end-time">종료 시간</FormLabel>
          <Tooltip title={endTimeError || ''} open={!!endTimeError} placement="top">
            <TextField
              id="end-time"
              size="small"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              error={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <FormLabel htmlFor="description">설명</FormLabel>
        <TextField
          id="description"
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="location">위치</FormLabel>
        <TextField
          id="location"
          size="small"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select
          id="category"
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-labelledby="category-label"
          aria-label="카테고리"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormControlLabel
          control={
            <Checkbox checked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)} />
          }
          label="반복 일정"
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="notification">알림 설정</FormLabel>
        <Select
          id="notification"
          size="small"
          value={notificationTime}
          onChange={(e) => setNotificationTime(Number(e.target.value))}
        >
          {notificationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value} aria-label={`${option.value}-option`}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isRepeating && (
        <Stack spacing={2}>
          <FormControl fullWidth>
            <FormLabel id="repeat-type">반복 유형</FormLabel>
            <Select
              aria-labelledby="repeat-type"
              aria-label="반복유형"
              id="repeat-type"
              size="small"
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as RepeatType)}
            >
              <MenuItem aria-label="daily-option" value="daily">
                매일
              </MenuItem>
              <MenuItem aria-label="weekly-option" value="weekly">
                매주
              </MenuItem>
              <MenuItem aria-label="monthly-option" value="monthly">
                매월
              </MenuItem>
              <MenuItem aria-label="yearly-option" value="yearly">
                매년
              </MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
              <TextField
                id="repeat-interval"
                size="small"
                type="number"
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
              <TextField
                id="repeat-end-date"
                size="small"
                type="date"
                value={repeatEndDate}
                onChange={(e) => setRepeatEndDate(e.target.value)}
              />
            </FormControl>
          </Stack>
        </Stack>
      )}

      <Button
        data-testid="event-submit-button"
        onClick={addOrUpdateEvent}
        variant="contained"
        color="primary"
      >
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </Stack>
  );
};
