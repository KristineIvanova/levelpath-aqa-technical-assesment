import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LoginData } from '../pages/loginData';
import { CarSearchPage } from '../pages/carSearchPage';

test('Verify the car info page shows empty results for invalid search criteria', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const carSearchPage = new CarSearchPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.login(LoginData);

    await carSearchPage.navigateToCarSearchPage();
    await carSearchPage.performInvalidSearch();

    const searchResults = await carSearchPage.getSearchResults();
    await expect(searchResults).toHaveCount(0);
});