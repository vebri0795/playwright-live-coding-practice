import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly loginPageUserNameInputSel: Locator;
    readonly loginPagePasswordInputSel: Locator;
    readonly loginPageSubmitSel: Locator;
    readonly loginPageFlashMsgSel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginPageUserNameInputSel = page.getByRole('textbox', { name: 'username' });
        this.loginPagePasswordInputSel = page.getByRole('textbox', { name: 'password' });
        this.loginPageSubmitSel = page.getByRole('button', { name: 'Login' });
        this.loginPageFlashMsgSel = page.locator('#flash');
    }

    async login(username: string, password: string): Promise<void> {
        await this.loginPageUserNameInputSel.fill(username);
        await this.loginPagePasswordInputSel.fill(password);
        await this.loginPageSubmitSel.click();
    }

    async assertStillOnLoginPage(): Promise<void> {
        await expect(this.page).toHaveURL(/\/login$/);
    }

    async assertFlashMessage(text: string): Promise<void> {
        await expect(this.loginPageFlashMsgSel).toContainText(text);
    }
}
