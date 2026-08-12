import { test, expect } from '@playwright/test';

test.describe("Easy workflow in Saucedemo app", () => {
    test.use({ testIdAttribute: 'data-test' });

    const username = "standard_user";
    const password = "secret_sauce";

    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/');
        await expect(page.locator('.login_logo')).toHaveText("Swag Labs");
    })

    test('Execute various actions', async ({ page }) => {
        await test.step(`login`, async () => {
            await page.getByRole('textbox', {name: 'username'}).fill(username);
            await page.getByRole('textbox', {name: 'password'}).fill(password);
            await page.getByRole('button', {name: 'Login'}).click();
            await expect(page.locator('.title')).toContainText("Products"); 
        });
        await test.step(`add new 2 products to cart`, async () => {
            await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
            await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();
        });
        await test.step(`verify cart badge is correct`, async () => {
            await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");
        });
        await test.step(`navigate to cart and verify products are added`, async () => {
            await page.getByTestId("shopping-cart-link").click();
            await expect(page.getByTestId('title')).toContainText("Your Cart");

            const el1 = page.getByTestId("inventory-item").filter({ hasText: "Sauce Labs Backpack" });
            await expect(el1.getByTestId('inventory-item-name')).toContainText("Sauce Labs Backpack"); 

            const el2 = page.getByTestId("inventory-item").filter({ hasText: "Sauce Labs Bike Light" });
            await expect(el2.getByTestId('inventory-item-name')).toContainText("Sauce Labs Bike Light"); 
        });   
        await test.step(`delete product from cart page and verify product left and cart badge`, async () => {
            await page.getByTestId("remove-sauce-labs-bike-light").click();

            const remainingItem = page.getByTestId("inventory-item").filter({ hasText: "Sauce Labs Backpack" });
            await expect(remainingItem.getByTestId('inventory-item-name')).toContainText("Sauce Labs Backpack");
            await expect(page.getByTestId("inventory-item")).toHaveCount(1);

            await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
        });
    });
})