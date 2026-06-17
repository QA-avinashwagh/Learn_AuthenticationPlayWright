import { Locator, Page, expect } from "@playwright/test";


export class HomePage {

    page: Page;
    homeTab: Locator;
    headerUserName : Locator;

    constructor(page: Page) {

        this.page = page;
        this.homeTab = page.getByRole('link', { name: 'Home', exact: true });
        this.headerUserName = page.locator('#headerUserName');
    }

    async navigateToHome(): Promise<void> {
        await this.page.goto('/home');
    }

    async isHomeTabVisbile(): Promise<void> {

        await expect(this.homeTab).toBeVisible();
    }

    async isheaderUserNameIsVisible(userName : string) {
        await expect(this.headerUserName).toHaveText(userName); 
    }


}