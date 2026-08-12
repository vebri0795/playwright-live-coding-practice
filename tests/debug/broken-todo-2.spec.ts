import { test, expect } from '@playwright/test';

test.describe('TodoMVC broken test 2 - debug me', () => {
    test('add items, delete one, complete two, and clear completed', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');

        const input = page.getByPlaceholder('What needs to be done?');
        await input.fill('read book');
        await input.press('Enter');
        await input.fill('clean house');
        await input.press('Enter');
        await input.fill('pay bills');
        await input.press('Enter');

        const bookItem = page.getByTestId('todo-item').filter({ hasText: 'read book' });
        await bookItem.hover();
        await bookItem.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByTestId('todo-item')).toHaveCount(2);

        const houseItem = page.getByTestId('todo-item').filter({ hasText: 'clean house' });
        const billsItem = page.getByTestId('todo-item').filter({ hasText: 'pay bills' });
        await houseItem.getByRole('checkbox').check();
        await billsItem.getByRole('checkbox').check();

        await expect(page.getByTestId('todo-count')).toContainText('0 items left');

        await page.getByRole('button', { name: 'Clear completed' }).click();

        await expect(page.getByTestId('todo-item')).toHaveCount(0);
    });
});
