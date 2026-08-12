import { LoginPage } from '../pages/login-page';
import { SecureAreaPage } from '../pages/secure-area-page';
import { TodoPage } from '../pages/todo-page';
import { test as base, expect } from '@playwright/test';

const URL_1 = "https://demo.playwright.dev/todomvc/#/";
const URL_2 = "https://the-internet.herokuapp.com/login";

type Fixtures = {
    todoPage: TodoPage;
    loginPage: LoginPage;
    secureAreaPage: SecureAreaPage;
};

export const test = base.extend<Fixtures>({
    todoPage: async ({ page }, use) => {
        await page.goto(URL_1);
        await use(new TodoPage(page));
    },
    loginPage: async ({ page }, use) => {
        await page.goto(URL_2);
        await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
        await use(new LoginPage(page));
    },
    secureAreaPage: async ({ page }, use) => {
        await use(new SecureAreaPage(page));
    }
});

export { expect } from '@playwright/test';