import { expect, test as base, Page } from "@playwright/test"
import { HomePage } from "../pages/HomePage";
import path from 'path';
import { LoginPage } from "../pages/LoginPage";

type AuthFixture = {

    systemAdminPage: { homePage: HomePage };
    mangerSupervisiorPage: { homePage: HomePage };
    clearicalStaff: { homePage: HomePage };

}

const adminStoragePath = path.resolve(process.cwd(), 'auth', 'systemAdmin.json');
const managerStoragePath = path.resolve(process.cwd(), 'auth', 'managerSupervisior.json');
const clericalStoragePath = path.resolve(process.cwd(), 'auth', 'clearicalStaff.json')

export const test = base.extend<AuthFixture>({

    systemAdminPage: async ({ browser }, use) => {

        const context = await browser.newContext({ storageState: adminStoragePath });
        const page = await context.newPage();
        await page.goto('/home');

        // SAFE GUARD: If a token gets invalidated mid-suite run by another worker,
        // this self-heals the specific worker on the fly instead of crashing.
        if (page.url().includes('/login') || await page.getByRole('button', { name: 'Log in' }).isVisible()) {

            const loginPage = new LoginPage(page);
            await loginPage.fillLoginForm("max.admin@yopmail.com", "Admin@1234");
            await expect(page).toHaveURL(/.*\/home/);
            await context.storageState({ path: adminStoragePath });
        }

        const homePage = new HomePage(page);
        await use({ homePage }); // Hand over control execution to active test scope
        await context.close(); // Graceful encapsulation cleanup
    },

    mangerSupervisiorPage: async ({ browser }, use) => {

        const context = await browser.newContext({ storageState: managerStoragePath });
        const page = await context.newPage();
        await page.goto('/home');

        // SAFE GUARD: If a token gets invalidated mid-suite run by another worker,
        // this self-heals the specific worker on the fly instead of crashing.
         if (page.url().includes('/login') || await page.getByRole('button', { name: 'Log in' }).isVisible()) {

            const loginPage = new LoginPage(page);
            await loginPage.fillLoginForm("joy.manager@yopmail.com", "Admin@1111");
            await expect(page).toHaveURL(/.*\/home/);
            await context.storageState({ path: managerStoragePath });
        }

        const homePage = new HomePage(page);
        await use({ homePage }); // Hand over control execution to active test scope
        await context.close(); // Graceful encapsulation cleanup
    },

    clearicalStaff: async ({ browser }, use) => {

        const context = await browser.newContext({ storageState: clericalStoragePath });
        const page = await context.newPage();
        await page.goto('/home');

        // SAFE GUARD: If a token gets invalidated mid-suite run by another worker,
        // this self-heals the specific worker on the fly instead of crashing.
        if (page.url().includes('/login') || await page.getByRole('button', { name: 'Log in' }).isVisible()) {
   
            const loginPage = new LoginPage(page);
            await loginPage.fillLoginForm("edwin.cstaff@yopmail.com", "Admin@111");
            await expect(page).toHaveURL(/.*\/home/);
            await context.storageState({ path: clericalStoragePath });
        }

        const homePage = new HomePage(page);
        await use({ homePage }); // Hand over control execution to active test scope
        await context.close(); // Graceful encapsulation cleanup
    },

})

export { expect };