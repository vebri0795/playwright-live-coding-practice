import { test } from '../src/fixtures/fixtures';

test.describe("Login / logout into Heroku app", () => {
    const correctUsername = "tomsmith";
    const incorrectUsername = "tomsmith2";
    const correctPassword = "SuperSecretPassword!";
    const incorrectPassword = "SuperSecretPassword";

    test('Login is successful', async ({ loginPage, secureAreaPage }) => {
        await loginPage.login(correctUsername, correctPassword);
        await secureAreaPage.assertOnSecurePage();
        await secureAreaPage.assertFlashMessage("You logged into a secure area!");
    });

    test('Login is not successful (incorrect username)', async ({ loginPage }) => {
        await loginPage.login(incorrectUsername, correctPassword);
        await loginPage.assertStillOnLoginPage();
        await loginPage.assertFlashMessage("Your username is invalid!");
    });

    test('Login is not successful (incorrect password)', async ({ loginPage }) => {
        await loginPage.login(correctUsername, incorrectPassword);
        await loginPage.assertStillOnLoginPage();
        await loginPage.assertFlashMessage("Your password is invalid!");
    });

    test('Logout is successful', async ({ loginPage, secureAreaPage }) => {
        await loginPage.login(correctUsername, correctPassword);
        await secureAreaPage.logout();
        await secureAreaPage.assertFlashMessage("You logged out of the secure area!");
    });
})