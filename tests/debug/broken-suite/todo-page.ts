import { Page, Locator, expect } from "@playwright/test";

export class BrokenTodoPage {
    readonly page: Page;
    readonly newTodoInput: Locator;
    readonly todoItems: Locator;
    readonly itemsLeftCount: Locator;
    readonly activeFilter: Locator;
    readonly completedFilter: Locator;
    readonly allFilter: Locator;
    readonly clearCompletedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodoInput = page.getByPlaceholder('What needs to be done?');
        this.todoItems = page.getByTestId('todo-item');
        this.itemsLeftCount = page.getByTestId('todo-count');
        this.activeFilter = page.getByRole('link', { name: 'Active' });
        this.completedFilter = page.getByRole('link', { name: 'Completed' });
        this.allFilter = page.getByRole('link', { name: 'All' });
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    }

    async addItem(text: string): Promise<void> {
        await this.newTodoInput.fill(text);
        await this.newTodoInput.press('Enter');
    }

    async checkItem(text: string): Promise<void> {
        await this.todoItems.filter({ hasText: text }).getByRole('checkbox').check();
    }

    async deleteItem(text: string): Promise<void> {
        const item = this.todoItems.filter({ hasText: text });
        await item.hover();
        await item.getByRole('button', { name: 'Delete' }).click();
    }

    async clickActiveFilter(): Promise<void> {
        await this.activeFilter.click();
    }

    async clickCompletedFilter(): Promise<void> {
        await this.completedFilter.click();
    }

    async assertItemCount(count: number): Promise<void> {
        await expect(this.todoItems).toHaveCount(count);
    }

    async assertItemsLeftText(count: number): Promise<void> {
        await expect(this.itemsLeftCount).toContainText(`${count} items left`);
    }
}
