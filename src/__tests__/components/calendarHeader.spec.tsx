import { render, screen, getByRole } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { CalendarHeader } from '../../components/CalendarHeader';
import { useCalendarView } from '../../hooks/useCalendarView';

const Wrapper = () => {
  const { view, setView, navigate } = useCalendarView();
  return <CalendarHeader view={view} setView={setView} navigate={navigate} />;
};

describe('CalendarHeader', () => {
  it('제목 “일정 보기”가 보인다', () => {
    render(<Wrapper />);

    expect(screen.getByText('일정 보기')).toBeInTheDocument();
  });

  it('“이전/다음” 네비게이션 버튼이 보인다', () => {
    render(<Wrapper />);

    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('“Week/Month” 뷰 선택 옵션이 보인다', async () => {
    render(<Wrapper />);

    await userEvent.click(getByRole(screen.getByLabelText('뷰 타입 선택'), 'combobox'));

    expect(screen.getByLabelText('week-option')).toBeInTheDocument();
    expect(screen.getByLabelText('month-option')).toBeInTheDocument();
  });
});
