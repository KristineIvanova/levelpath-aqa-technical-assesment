import { expect, test } from '@playwright/test';
import { LoginData } from '../pages/loginData';
import { HomePage } from '../pages/homePage';
import { ProfilePage } from '../pages/profilePage';
import { LoginPage } from '../pages/loginPage';
import dotenv from 'dotenv';

dotenv.config();

test('Assert that page contains e-mail from log-in step', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await homePage.navigateToHomePage();
    const homePageLoaded = await homePage.isHomePageLoaded();
    expect(homePageLoaded).toBe(true);

    await loginPage.waitPageLoad();
    await loginPage.navigateToLoginPage();
    await loginPage.login(LoginData);

    const loggedIn = await loginPage.isLoggedIn();
    expect(loggedIn).toBe(true);

    await profilePage.goToProfilePage();
    await profilePage.waitPageLoad();

    const emailFieldValue = await profilePage.getEmailValue();
    expect(emailFieldValue).toBe(LoginData.email);
});