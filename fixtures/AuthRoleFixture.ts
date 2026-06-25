import { expect, test as base, Page } from "@playwright/test"
import { HomePage } from "../pages/HomePage";

type AuthFixture = {

    systemAdminPage: {homePage : HomePage};
    mangerSupervisiorPage: {homePage : HomePage};
    clearicalStaff: {homePage : HomePage};

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

        const homePage = new HomePage(page);

        await use({homePage});
        await context.close();
    },

    clearicalStaff: async ({ browser }, use) => {

        const context = await browser.newContext({ storageState: 'auth/clearicalStaff.json' })
        const page = await context.newPage();
        
        const homePage = new HomePage(page);
        
        await use({homePage});
        await context.close();
    }

})

export { expect };