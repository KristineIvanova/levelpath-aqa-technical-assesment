import {expect, Page} from '@playwright/test';

export class CarSearchPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToCarSearchPage() {
        await this.page.goto('https://e.csdd.lv/tltr');
        await this.waitPageLoad();
    }

    async waitPageLoad() {
        console.log('Waiting for car search page to load...');
        await this.page.waitForSelector('//div[@id=\'chart\']');
        console.log('Car search page loaded.');
    }

    async performSearch(marka: string, modelis: string, degviela: string, cenaNo: string, cenaLidz: string) {
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
    }

    async performInvalidSearch() {
        await this.page.getByLabel('Marka:').click();
        await this.page.getByLabel('Marka:').selectOption('432');
        await this.page.getByRole('link', { name: 'Meklēt' }).click();
    }

    async getSearchResults()
    {
        await this.page.waitForSelector('.tr-data');
        return this.page.locator('.tr-data');
    }

    async findCarInResults(marka: string, modelis: string, degviela: string) {
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
                break;
            }
        }

        return found;
    }

    async verifyCarInfoPage(marka: string, modelis: string, degviela: string, cenaNo: number, cenaLidz: number) {
        const found = await this.findCarInResults(marka, modelis, degviela);
        expect(found).toBe(true);

        const rows2Text = await this.page.locator('(//*[@id="vehicles-table"]//tr//td[@class=\'numeric\'])[1]').innerText();
        const firstNumberText = rows2Text.split(' ')[0].replace(/[^\d.-]/g, '');
        const rows2Number = parseFloat(firstNumberText);
        console.log(rows2Number);

        expect(rows2Number).toBeGreaterThanOrEqual(cenaNo);
        expect(rows2Number).toBeLessThanOrEqual(cenaLidz);

        const pageTitle = await this.page.locator('#tltitle').innerText();
        expect(pageTitle).toContain(marka);
        expect(pageTitle).toContain(modelis);

        const recordTableText = await this.page.locator('#merchant-table').innerText();
        expect(recordTableText).toContain(marka);
        expect(recordTableText).toContain(modelis);

        const additionalInfoText = await this.page.locator('//*[text()=\'Papildus informācija:\']/../td[2]').innerText();
        expect(additionalInfoText).toContain('benzīns');

        const generalInfoText = await this.page.locator('//table[@id=\'merchant-table\']//*[text()=\'Transmisija:\']/../td[2]').innerText();
        expect(generalInfoText).toContain('Manuāla');

        await this.page.locator('//label//span[text()=\'Tehniskie dati\']').click();
        const technicalDataText = await this.page.locator('//table[@id=\'tehdati-table\']//*[text()=\'Transmisija:\']/../td[2]').innerText();
        expect(technicalDataText).toContain('Manuāla');
    }
}