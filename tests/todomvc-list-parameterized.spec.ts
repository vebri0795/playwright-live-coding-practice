import { test } from '../src/fixtures/fixtures';

test.describe("TodoMVC Playwright list tests parameterized", () => {

    const testItems: Record<string, string> = {
        simpleWord: 'Potatoe',
        veryLongText: 'Banana12938120397120931723097213907sooiasdu',
        negativeNumber: '-1',
        zero: '0',
    };

    for (const caseName in testItems) {
        const item = testItems[caseName];

        test(`set of actions for ${caseName}`, async ({ todoPage }) => {
            await test.step(`add new ${item} to list`, async () => {
                await todoPage.addTodoItem(item);
            });
            await test.step(`verify item ${item} displays on list`, async () => {
                await todoPage.assertTodoListContainsItem(item);
            });
            await test.step(`delete item ${item}`, async () => {
                await todoPage.deleteTodoListItem(item);
            });
            await test.step(`verify list does not contain item ${item}`, async () => {
                await todoPage.assertTodoItemListCount(0);
            });
        });
    }
});