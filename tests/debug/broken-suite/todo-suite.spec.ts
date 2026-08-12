import { test, expect } from './todo-fixtures';

test.describe('TodoMVC suite - fix me', () => {
    test('add three items and verify count', async ({ todoPage }) => {
        await todoPage.addItem('buy milk');
        await todoPage.addItem('walk the dog');
        await todoPage.addItem('write tests');

        await todoPage.assertItemCount(3);
        await todoPage.assertItemsLeftText(3);
    });

    test('complete one item and filter by active', async ({ todoPage }) => {
        await todoPage.addItem('buy milk');
        await todoPage.addItem('walk the dog');

        await todoPage.checkItem('buy milk');
        await todoPage.clickActiveFilter();

        await todoPage.assertItemCount(1);
    });

    test('filter by completed shows only checked items', async ({ todoPage }) => {
        await todoPage.addItem('buy milk');
        await todoPage.addItem('walk the dog');
        await todoPage.addItem('write tests');

        await todoPage.checkItem('buy milk');
        await todoPage.clickCompletedFilter();

        await todoPage.assertItemCount(1);
    });

    test('delete an item and verify remaining count', async ({ todoPage }) => {
        await todoPage.addItem('buy milk');
        await todoPage.addItem('walk the dog');

        await todoPage.deleteItem('buy milk');

        await todoPage.assertItemCount(1);
    });
});
