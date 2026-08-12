import { Page, Locator, expect } from "@playwright/test";

export class SecureAreaPage {
    readonly page: Page;
    readonly secureAreaPageFlashMsgSel: Locator;
    readonly secureAreaPageLogoutSel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.secureAreaPageFlashMsgSel = page.locator('#flash');
        this.secureAreaPageLogoutSel = page.getByRole('link', { name: "Logout" });
    }

    async logout(): Promise<void> {
        await this.secureAreaPageLogoutSel.click();
    }

    async assertOnSecurePage(): Promise<void> {
        await expect(this.page).toHaveURL(/\/secure$/);
    }

    async assertFlashMessage(text: string): Promise<void> {
        await expect(this.secureAreaPageFlashMsgSel).toContainText(text);
    }
}
