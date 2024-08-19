import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LoginData } from '../pages/loginData';
import { HomePage } from '../pages/homePage';
import { CarSearchPage } from '../pages/carSearchPage';

test('Verify the car info page', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const carSearchPage = new CarSearchPage(page);

  await homePage.navigateToHomePage();
  const homePageLoaded = await homePage.isHomePageLoaded();
  expect(homePageLoaded).toBe(true);

  await loginPage.navigateToLoginPage();
  await loginPage.login(LoginData);

  await carSearchPage.navigateToCarSearchPage();

  await carSearchPage.performSearch('CITROEN', '3232', '1', '500', '10000');
  await carSearchPage.verifyCarInfoPage('CITROEN', 'C3', 'Benzīns', 500, 10000);
});