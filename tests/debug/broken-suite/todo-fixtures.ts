import { BrokenTodoPage } from './todo-page';
import { test as base, expect } from '@playwright/test';

const URL = "https://demo.playwright.dev/todomvc/#/";

type Fixtures = {
    todoPage: BrokenTodoPage;
};

export const test = base.extend<Fixtures>({
    todoPage: async ({ page }, use) => {
        await page.goto(URL);
        await use(new BrokenTodoPage(page));
    }
});

export { expect } from '@playwright/test';
