import { test, expect } from '@playwright/test';

test.describe('일정 추가 및 삭제', () => {
  test('2025-08-01 ~ 2025-08-03 동안 매일 반복되는 일정을 추가하면 해당 일정이 반복되어 표시된다.', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/');

    await page.getByLabel('제목').fill('테스트 일정');
    await page.getByLabel('날짜').fill('2025-08-01');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByLabel('설명').fill('테스트 일정 설명');
    await page.getByLabel('위치').fill('테스트 위치');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    await page.getByRole('combobox', { name: '반복 유형' }).click();
    await page.getByRole('option', { name: 'daily-option' }).click();

    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-08-03');
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByTestId('1-day-cell').getByText('테스트 일정')).toBeVisible();
    await expect(page.getByTestId('2-day-cell').getByText('테스트 일정')).toBeVisible();
    await expect(page.getByTestId('3-day-cell').getByText('테스트 일정')).toBeVisible();
  });

  test('2025-08-01 ~ 2025-08-03 동안의 반복 일정을 개별 삭제 하는 것이 가능하다', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/');
    const eventList = page.getByTestId('event-list');

    await eventList.getByLabel('1-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('1-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();

    await eventList.getByLabel('2-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('2-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();

    await eventList.getByLabel('3-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('3-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();
  });
});

test.describe('일정 보기', () => {
  test('Month View 에서 일정을 추가하면 해당 일정이 표시된다', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByLabel('제목').fill('테스트 일정');
    await page.getByLabel('날짜').fill('2025-08-04');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByLabel('설명').fill('테스트 일정 설명');
    await page.getByLabel('위치').fill('테스트 위치');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    await page.getByRole('combobox', { name: '반복 유형' }).click();
    await page.getByRole('option', { name: 'weekly-option' }).click();

    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-08-18');
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByTestId('4-day-cell').getByText('테스트 일정')).toBeVisible();
    await expect(page.getByTestId('11-day-cell').getByText('테스트 일정')).toBeVisible();
    await expect(page.getByTestId('18-day-cell').getByText('테스트 일정')).toBeVisible();
  });

  test('2025-08-04 ~ 2025-08-18 동안의 반복 일정을 개별 삭제 하는 것이 가능하다', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/');
    const eventList = page.getByTestId('event-list');

    await eventList.getByLabel('4-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('4-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();

    await eventList.getByLabel('11-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('11-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();

    await eventList.getByLabel('18-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('18-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();
  });

  test('Week View 에서 일정을 추가하면 해당 일정이 표시된다', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByLabel('제목').fill('테스트 일정');
    await page.getByLabel('날짜').fill('2025-08-05');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByLabel('설명').fill('테스트 일정 설명');
    await page.getByLabel('위치').fill('테스트 위치');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    await page.getByRole('combobox', { name: '반복 유형' }).click();
    await page.getByRole('option', { name: 'weekly-option' }).click();

    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-08-19');
    await page.getByTestId('event-submit-button').click();

    await page.getByLabel('뷰 타입 선택').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    await page.getByLabel('Previous').click();
    await page.getByLabel('Previous').click();
    await page.getByLabel('Previous').click();
    await expect(page.getByTestId('5-day-cell').getByText('테스트 일정')).toBeVisible();
    await page.getByLabel('Next').click();
    await expect(page.getByTestId('12-day-cell').getByText('테스트 일정')).toBeVisible();
    await page.getByLabel('Next').click();
    await expect(page.getByTestId('19-day-cell').getByText('테스트 일정')).toBeVisible();
  });

  test('2025-08-05 ~ 2025-08-19 동안의 반복 일정을 개별 삭제 하는 것이 가능하다', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/');
    const eventList = page.getByTestId('event-list');

    await eventList.getByLabel('5-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('5-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();

    await eventList.getByLabel('12-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('12-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();

    await eventList.getByLabel('19-event-card', { exact: true }).getByLabel('Delete event').click();
    await expect(page.getByTestId('19-day-cell').getByText('삭제 테스트 일정')).not.toBeVisible();
  });
});

test.describe('일정 검색', () => {
  test('일정 검색 기능이 작동한다', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const searchInput = page.getByLabel('일정 검색');
    await searchInput.fill('팀 회의');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('팀팀팀팀 회의')).not.toBeVisible();
    await expect(eventList.getByText('팀회의')).not.toBeVisible();
    await expect(eventList.getByText('점심 약속')).not.toBeVisible();
    await expect(eventList.getByText('프로젝트 마감')).not.toBeVisible();

    await searchInput.fill('있을수가없는일정');
    await expect(eventList.getByText('검색 결과가 없습니다.')).toBeVisible();

    await searchInput.fill('');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('점심 약속')).toBeVisible();
  });
});
