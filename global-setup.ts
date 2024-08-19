import {Browser, chromium, Page} from "@playwright/test";

async function globalSetup() {
    const browser : Browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    const page : Page = await context.newPage();
}