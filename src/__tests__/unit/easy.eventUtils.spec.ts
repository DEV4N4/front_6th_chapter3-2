import { Event } from '../../types';
import { createRepeatEvents, getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2025-07-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2025-07-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2025-07-10',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(events, '이벤트 2', new Date('2025-07-01'), 'month');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('이벤트 2');
  });

  it('주간 뷰에서 2025-07-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2025-07-01'), 'week');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 2']);
  });

  it('월간 뷰에서 2025년 7월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2025-07-01'), 'month');
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 2', '이벤트 3']);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(events, '이벤트', new Date('2025-07-01'), 'week');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 2']);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2025-07-01'), 'month');
    expect(result).toHaveLength(3);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const result = getFilteredEvents(events, '이벤트 2', new Date('2025-07-01'), 'month');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('이벤트 2');
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const borderEvents: Event[] = [
      {
        id: '4',
        title: '6월 마지막 날 이벤트',
        date: '2025-06-30',
        startTime: '23:00',
        endTime: '23:59',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      ...events,
      {
        id: '5',
        title: '8월 첫 날 이벤트',
        date: '2025-08-01',
        startTime: '00:00',
        endTime: '01:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ];
    const result = getFilteredEvents(borderEvents, '', new Date('2025-07-01'), 'month');
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 2', '이벤트 3']);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '', new Date('2025-07-01'), 'month');
    expect(result).toHaveLength(0);
  });
});

describe('createRepeatEvents', () => {
  const event: Event = {
    id: '1',
    title: '이벤트 1',
    date: '2025-07-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  };

  describe('none', () => {
    it('반복 정보가 없는 이벤트는 그대로 반환한다', () => {
      const result = createRepeatEvents([event]);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('이벤트 1');
    });
  });

  describe('daily', () => {
    it('매일 반복되는 이벤트를 생성한다', () => {
      const dailyEvent = {
        ...event,
        repeat: { type: 'daily', interval: 3, endDate: '2025-07-04' },
      } as const;
      const result = createRepeatEvents([dailyEvent]);
      expect(result).toHaveLength(4);
      expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 1', '이벤트 1', '이벤트 1']);
      expect(result.map((e) => e.date)).toEqual([
        '2025-07-01',
        '2025-07-02',
        '2025-07-03',
        '2025-07-04',
      ]);
    });
  });

  describe('weekly', () => {
    it('매주 반복되는 이벤트를 생성한다', () => {
      const weeklyEvent = {
        ...event,
        repeat: { type: 'weekly', interval: 2, endDate: '2025-07-15' },
      } as const;
      const result = createRepeatEvents([weeklyEvent]);
      expect(result).toHaveLength(3);
      expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 1', '이벤트 1']);
      expect(result.map((e) => e.date)).toEqual(['2025-07-01', '2025-07-08', '2025-07-15']);
    });
  });

  describe('monthly', () => {
    it('매월 반복되는 이벤트를 생성한다', () => {
      const monthlyEvent = {
        ...event,
        repeat: { type: 'monthly', interval: 2, endDate: '2025-10-01' },
      } as const;
      const result = createRepeatEvents([monthlyEvent]);
      expect(result).toHaveLength(3);
      expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 1', '이벤트 1']);
      expect(result.map((e) => e.date)).toEqual(['2025-07-01', '2025-08-01', '2025-09-01']);
    });
  });

  describe('yearly', () => {
    it('매년 반복되는 이벤트를 생성한다', () => {
      const yearlyEvent = {
        ...event,
        repeat: { type: 'yearly', interval: 2, endDate: '2028-01-01' },
      } as const;
      const result = createRepeatEvents([yearlyEvent]);
      expect(result).toHaveLength(3);
      expect(result.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 1', '이벤트 1']);
    });
  });
});
