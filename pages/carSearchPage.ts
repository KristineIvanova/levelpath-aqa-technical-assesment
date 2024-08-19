import { expect, Page } from '@playwright/test';

export class CarSearchPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToCarSearchPage() {
        console.log('Navigating to car search page...');
        await this.page.goto('https://e.csdd.lv/tltr');
        await this.waitPageLoad();
        console.log('Navigated to car search page.');
    }

    async waitPageLoad() {
        console.log('Waiting for car search page to load...');
        await this.page.waitForSelector('//div[@id=\'chart\']');
        console.log('Car search page loaded.');
    }

    async performSearch(marka: string, modelis: string, degviela: string, cenaNo: string, cenaLidz: string) {
        console.log(`Performing search with marka: ${marka}, modelis: ${modelis}, degviela: ${degviela}, cenaNo: ${cenaNo}, cenaLidz: ${cenaLidz}`);
        await this.page.getByLabel('Marka:').click();
        await this.page.getByLabel('Marka:').selectOption({ label: marka });
        await this.page.locator('#ModelsList').selectOption(modelis);
        await this.page.getByLabel('Degvielas veids:').selectOption(degviela);
        await this.page.locator('#TransmList').selectOption('1');
        await this.page.locator('#cenano').click();
        await this.page.locator('#cenano').fill(cenaNo);
        await this.page.locator('#cenalidz').click();
        await this.page.locator('#cenalidz').fill(cenaLidz);
        await this.page.getByLabel('Visi').click();
        await this.page.getByLabel('Visi').check();
        await this.page.getByRole('link', { name: 'Meklēt' }).click();
        console.log('Search performed.');
    }

    async performInvalidSearch() {
        console.log('Performing invalid search...');
        await this.page.getByLabel('Marka:').click();
        await this.page.getByLabel('Marka:').selectOption('432');
        await this.page.getByRole('link', { name: 'Meklēt' }).click();
        console.log('Invalid search performed.');
    }

    async getSearchResults() {
        console.log('Getting search results...');
        await this.page.waitForSelector('id=element1');
        const results = this.page.locator('.tr-data');
        console.log(`Found ${await results.count()} search results.`);
        return results;
    }

    async findCarInResults(marka: string, modelis: string, degviela: string) {
        console.log(`Finding car in results with marka: ${marka}, modelis: ${modelis}, degviela: ${degviela}`);
        await this.page.waitForSelector('id=element1');
        const rows = this.page.locator('.tr-data');
        let found = false;

        for (let i = 0; i < await rows.count(); i++) {
            const row = rows.nth(i);
            const rowMarka = (await row.getAttribute('marka'))?.trim() ?? '';
            const rowModelis = (await row.getAttribute('modelis'))?.trim() ?? '';
            const rowDegviela = (await row.getAttribute('kdvl'))?.trim() ?? '';

            if (rowMarka === marka && rowModelis === modelis && rowDegviela === degviela) {
                found = true;
                await row.click();
                console.log(`Found car: marka: ${rowMarka}, modelis: ${rowModelis}, degviela: ${rowDegviela}`);
                break;
            }
        }

        if (!found) {
            console.log('Car not found in results.');
        }

        return found;
    }

    async verifyCarInfoPage(marka: string, modelis: string, degviela: string, cenaNo: number, cenaLidz: number) {
        console.log(`Verifying car info page with marka: ${marka}, modelis: ${modelis}, degviela: ${degviela}, cenaNo: ${cenaNo}, cenaLidz: ${cenaLidz}`);
        const found = await this.findCarInResults(marka, modelis, degviela);
        expect(found).toBe(true);

        const rows2Text = await this.page.locator('(//*[@id="vehicles-table"]//tr//td[@class=\'numeric\'])[1]').innerText();
        const firstNumberText = rows2Text.split(' ')[0].replace(/[^\d.-]/g, '');
        const carPrice = parseFloat(firstNumberText);
        console.log(`Car price: ${carPrice}`);

        expect(carPrice).toBeGreaterThanOrEqual(cenaNo);
        expect(carPrice).toBeLessThanOrEqual(cenaLidz);

        const pageTitle = await this.page.locator('#tltitle').innerText();
        console.log(`Page title: ${pageTitle}`);
        expect(pageTitle).toContain(marka);
        expect(pageTitle).toContain(modelis);

        const recordTableText = await this.page.locator('#merchant-table').innerText();
        console.log(`Record table text: ${recordTableText}`);
        expect(recordTableText).toContain(marka);
        expect(recordTableText).toContain(modelis);

        const additionalInfoText = await this.page.locator('//*[text()=\'Papildus informācija:\']/../td[2]').innerText();
        console.log(`Additional info text: ${additionalInfoText}`);
        expect(additionalInfoText).toContain('benzīns');

        const generalInfoText = await this.page.locator('//table[@id=\'merchant-table\']//*[text()=\'Transmisija:\']/../td[2]').innerText();
        console.log(`General info text: ${generalInfoText}`);
        expect(generalInfoText).toContain('Manuāla');

        await this.page.locator('//label//span[text()=\'Tehniskie dati\']').click();
        const technicalDataText = await this.page.locator('//table[@id=\'tehdati-table\']//*[text()=\'Transmisija:\']/../td[2]').innerText();
        console.log(`Technical data text: ${technicalDataText}`);
        expect(technicalDataText).toContain('Manuāla');
    }
}