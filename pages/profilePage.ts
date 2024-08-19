import { Page } from '@playwright/test';

export class ProfilePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToProfilePage() {
        console.log('Navigating to profile page...');
        await this.page.goto('https://e.csdd.lv/profile'); // Replace with the actual URL
        console.log('Navigated to profile page.');
    }

    async waitPageLoad() {
        console.log('Waiting for profile page to load...');
        await this.page.waitForLoadState('domcontentloaded');
        console.log('Profile page loaded.');
    }

    async getEmailValue() {
        console.log('Retrieving email value...');
        const emailValue = await this.page.locator('id=demail').inputValue();
        console.log(`Email value retrieved: ${emailValue}`);
        return emailValue;
    }
}