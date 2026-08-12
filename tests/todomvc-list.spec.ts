import { test } from '../src/fixtures/fixtures';

test.describe("TodoMVC Playwright list tests", () => {
    const item1 = "potatoe";
    const item2 = "tomatoe";
    const item3 = "banana";

    test.beforeEach(async ({ todoPage }) => {
        await todoPage.addTodoItem(item1);
        await todoPage.addTodoItem(item2);
        await todoPage.addTodoItem(item3);
    });

    test('verify new todo items are displayed and items left count', async ({ todoPage }) => {
        await todoPage.assertTodoListContainsItem(item1);
        await todoPage.assertTodoListContainsItem(item2);
        await todoPage.assertTodoListContainsItem(item3);
        await todoPage.assertTodoListItemsLeft(3);
    });

    test('mark task as completed and verify its completed', async ({ todoPage }) => {
        await todoPage.checkTodoListItem(item1);
        await todoPage.assertItemHasCompletedClass(item1);
        await todoPage.assertItemIsChecked(item1);
    });

    test('delete task and assert list has one less item', async ({ todoPage }) => {
        await todoPage.deleteTodoListItem(item1);
        await todoPage.assertTodoListItemsLeft(2);
        await todoPage.assertTodoItemListCount(2);
    });

    test('mark task as completed and verify filters behaviour', async ({ todoPage }) => {
        await todoPage.checkTodoListItem(item1);
        await todoPage.clickActiveFilter();

        await todoPage.assertTodoItemNotExists(item1);
        await todoPage.assertTodoItemIsVisible(item2);
        await todoPage.assertTodoItemIsVisible(item3);

        await todoPage.clickCompletedFilter();

        await todoPage.assertTodoItemIsVisible(item1);
        await todoPage.assertTodoItemNotExists(item2);
        await todoPage.assertTodoItemNotExists(item3);

        await todoPage.clickAllFilter();
        await todoPage.clickClearCompleted();

        await todoPage.assertTodoItemNotExists(item1);
        await todoPage.assertTodoItemIsVisible(item2);
        await todoPage.assertTodoItemIsVisible(item3);
    
        await todoPage.assertTodoListItemsLeft(2);
    });
});