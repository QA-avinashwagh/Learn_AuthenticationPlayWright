import { expect, test as base, Page } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

type AuthFixture = {

    systemAdminPage: {homePage : HomePage};
    mangerSupervisiorPage: {loginPage : LoginPage, homePage : HomePage};
    clearicalStaff: {loginPage : LoginPage, homePage : HomePage};

}

export const test = base.extend<AuthFixture>({

    systemAdminPage: async ({ browser }, use) => {

        const context = await browser.newContext({ storageState: 'auth/systemAdmin.json' }); // cached session
        const page = await context.newPage();

        const homePage = new HomePage(page);

        await use({homePage}); // Hand over control execution to active test scope
        await context.close(); // Graceful encapsulation cleanup
    },

    mangerSupervisiorPage: async ({ browser }, use) => {

        const context = await browser.newContext({ storageState: 'auth/managerSupervisior.json' })
        const page = await context.newPage();

        
        const loginPage = new LoginPage(page)
        const homePage = new HomePage(page);

        await use({loginPage, homePage});
        await context.close();
    },

    clearicalStaff: async ({ browser }, use) => {

        const context = await browser.newContext({ storageState: 'auth/clearicalStaff.json' })
        const page = await context.newPage();
        
        const loginPage = new LoginPage(page)
        const homePage = new HomePage(page);
        
        await use({loginPage, homePage});
        await context.close();
    }

})

export { expect };