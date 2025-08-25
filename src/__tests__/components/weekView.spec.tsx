import { render, screen, within } from '@testing-library/react';

import { WeekView } from '../../components/WeekView';

const Wrapper = () => {
  return (
    <WeekView
      currentDate={new Date('2025-08-22')}
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
    />
  );
};

describe('WeekView', () => {
  it('제목 “2025년 8월 3주” 처럼 제목에 "주" 텍스트가 포함된다', async () => {
    render(<Wrapper />);

    expect(screen.getByText('2025년 8월 3주')).toBeInTheDocument();
  });

  it('주/일 셀 구조가 WeekView에 맞게 렌더된다', () => {
    render(<Wrapper />);

    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(7);
  });

  it('이벤트가 해당 날짜 셀에만 표시된다', async () => {
    render(<Wrapper />);
    const day21Cell = screen.getByTestId('21-day-cell');
    const day22Cell = screen.getByTestId('22-day-cell');
    const day23Cell = screen.getByTestId('23-day-cell');

    expect(within(day21Cell).queryByText('코드리뷰 타임')).toBeNull();
    expect(within(day22Cell).queryByText('코드리뷰 타임')).toBeInTheDocument();
    expect(within(day23Cell).queryByText('PT 상담')).toBeInTheDocument();
  });
});
