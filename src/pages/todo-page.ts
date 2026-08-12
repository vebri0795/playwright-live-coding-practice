import { Page, Locator, expect } from "@playwright/test";

export class TodoPage {
    readonly page: Page;
    readonly todoPageNewTodoInputSel: Locator;
    readonly todoPageTodoListContainerSel: Locator;
    readonly todoPageTodoListRemainingItemsSel: Locator;
    readonly todoPageTodoListItemSel: Locator;
    readonly todoPageTodoListActiveFilterSel: Locator;
    readonly todoPageTodoListCompletedFilterSel: Locator;
    readonly todoPageTodoListAllFilterSel: Locator;
    readonly todoPageTodoListClearCompletedSel: Locator;

    constructor( page: Page ) {
        this.page = page;
        this.todoPageNewTodoInputSel = page.getByPlaceholder('What needs to be done?');
        this.todoPageTodoListContainerSel = page.locator('.todo-list');
        this.todoPageTodoListRemainingItemsSel = page.getByTestId("todo-count");
        this.todoPageTodoListItemSel = page.getByTestId('todo-item');
        this.todoPageTodoListActiveFilterSel = page.getByRole("link", {name: "Active"});
        this.todoPageTodoListCompletedFilterSel = page.getByRole("link", {name: "Completed"});
        this.todoPageTodoListAllFilterSel = page.getByRole("link", {name: "All"});
        this.todoPageTodoListClearCompletedSel = page.getByRole("button", {name: "Clear completed"});
    }

    // async navigateTo(): Promise<void> {
    //     await this.page.goto(URL);
    // }
    
    async addTodoItem(item: string): Promise<void> {
        await this.todoPageNewTodoInputSel.fill(item);
        await this.todoPageNewTodoInputSel.press('Enter');
    }

    async assertTodoListContainsItem(item: string): Promise<void> {
        await expect(this.todoPageTodoListContainerSel).toContainText(item);
    }

    async assertTodoListItemsLeft(nitems: number): Promise<void> {
        await expect(this.todoPageTodoListRemainingItemsSel).toContainText(`${nitems} items left`);    
    } 

    async assertTodoItemListCount(count: number): Promise<void> {
        await expect(this.todoPageTodoListItemSel).toHaveCount(count);
    }

    async assertTodoItemNotExists(item: string): Promise<void> {
        const itemLocator = this.todoPageTodoListItemSel.filter({ hasText: item});
        await expect(itemLocator).toHaveCount(0);
    }

    async assertTodoItemIsVisible(item: string): Promise<void> {
        const itemLocator = this.todoPageTodoListItemSel.filter({ hasText: item});
        await expect(itemLocator).toBeVisible();
    }

    async assertItemHasCompletedClass(item: string): Promise<void> {
        const itemLocator = this.todoPageTodoListItemSel.filter({ hasText: item});
        await expect(itemLocator).toHaveClass("completed");
    }

    async checkTodoListItem(item: string): Promise<void> {
        await this.todoPageTodoListItemSel
            .filter({ hasText: item }).getByRole('checkbox').check();
    }

    async assertItemIsChecked(item: string): Promise<void> {
        const checkedLocator = this.todoPageTodoListItemSel
            .filter({ hasText: item })
            .getByRole("checkbox", { name: "Toggle Todo" });
        await expect(checkedLocator).toBeChecked();
    }

    async deleteTodoListItem(item: string): Promise<void> {
        let todoListItem = this.todoPageTodoListItemSel.filter({ hasText: item});
        await todoListItem.hover();
        await todoListItem.getByRole('button', { name: 'Delete' }).click();
    }

    async clickActiveFilter(): Promise<void> {
        await this.todoPageTodoListActiveFilterSel.click();
    }

    async clickCompletedFilter(): Promise<void> {
        await this.todoPageTodoListCompletedFilterSel.click();
    }

    async clickAllFilter(): Promise<void> {
        await this.todoPageTodoListAllFilterSel.click();
    }

    async clickClearCompleted(): Promise<void> {
        await this.todoPageTodoListClearCompletedSel.click();
    }
}