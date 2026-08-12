import { test, expect } from '@playwright/test';

test.describe('TodoMVC broken test - debug me', () => {
    test('add items, complete one, filter, and delete another', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');

        const input = page.getByPlaceholder('What needs to be done?');
        await input.fill('buy milk');
        await input.press('Enter');
        await input.fill('walk the dog');
        await input.press('Enter');
        await input.fill('write tests');
        await input.press('Enter');

        await expect(page.getByTestId('todo-item')).toHaveCount(3);

        const milkItem = page.getByTestId('todo-item').filter({ hasText: 'buy milk' });
        await milkItem.getByRole('checkbox').check();

        await page.getByRole('link', { name: 'Active' }).click();
        await expect(page.getByTestId('todo-item')).toHaveCount(2);

        const dogItem = page.getByTestId('todo-item').filter({ hasText: 'walk the dog' });
        await dogItem.hover();
        await dogItem.getByRole('button', { name: 'Delete' }).click().then(() => {
            console.log('deleted walk the dog');
        });

        await expect(page.getByTestId('todo-item')).toHaveCount(1);
    });
});
