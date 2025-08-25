import { render, screen, within } from '@testing-library/react';

import { MonthView } from '../../components/MonthView';
import { useCalendarView } from '../../hooks/useCalendarView';

const Wrapper = () => {
  const { holidays } = useCalendarView();
  return (
    <MonthView
      currentDate={new Date('2025-08-01')}
      filteredEvents={[
        {
          id: 'a6b7c8d9-1111-2222-3333-444455556666',
          title: '디자인 QA',
          date: '2025-08-01',
          startTime: '16:00',
          endTime: '17:00',
          description: '신규 장바구니 페이지 픽셀 퍼펙트 검수',
          location: 'Figma/Jira',
          category: '업무',
          repeat: { type: 'none', interval: 1 },
          notificationTime: 10,
        },
        {
          id: '11112222-3333-4444-5555-666677778888',
          title: '코드리뷰 타임',
          date: '2025-08-22',
          startTime: '11:00',
          endTime: '11:30',
          description: 'PR #124 ~ #129 리뷰',
          location: 'GitHub PR',
          category: '업무',
          repeat: { type: 'weekly', interval: 1 },
          notificationTime: 5,
        },
        {
          id: '9999aaaa-bbbb-cccc-dddd-eeeeffff0001',
          title: 'PT 상담',
          date: '2025-08-23',
          startTime: '19:30',
          endTime: '20:00',
          description: '체형 분석 및 루틴 점검',
          location: '동네 헬스장',
          category: '건강',
          repeat: { type: 'weekly', interval: 2 },
          notificationTime: 30,
        },
      ]}
      notifiedEvents={[]}
      holidays={holidays}
    />
  );
};

describe('MonthView', () => {
  it('제목 “2025년 8월” 텍스트만 보인다', async () => {
    render(<Wrapper />);

    expect(screen.getByText('2025년 8월')).toBeInTheDocument();
    expect(screen.queryByText('2025년 8월 3주')).not.toBeInTheDocument();
  });

  it('주/일 셀 구조가 MonthView에 맞게 렌더된다', () => {
    render(<Wrapper />);

    expect(screen.getByTestId('1-day-cell')).toBeInTheDocument();
    expect(screen.getByTestId('2-day-cell')).toBeInTheDocument();
    expect(screen.getByTestId('3-day-cell')).toBeInTheDocument();
    expect(screen.getByTestId('10-day-cell')).toBeInTheDocument();
    expect(screen.getByTestId('31-day-cell')).toBeInTheDocument();
  });

  it.skip('휴일을 나타내는 빨간 텍스트가 해당 날짜 셀에 맞게 표시된다', async () => {
    render(<Wrapper />);

    const day15Cell = screen.getByTestId('15-day-cell');
    expect(within(day15Cell).getByText('광복절')).toBeInTheDocument();
  });
});
