import { expect, test as base, Page } from "@playwright/test"
import { HomePage } from "../pages/HomePage";
import fs from 'fs';
import path from 'path';
import { LoginPage } from "../pages/LoginPage";

type AuthFixture = {

    systemAdminPage: {homePage : HomePage};
    mangerSupervisiorPage: {homePage : HomePage};
    clearicalStaff: {homePage : HomePage};

}

const adminStroragePath = path.resolve(process.cwd(), 'auth', 'systemAdmin.json');  
const managerStroragePath = path.resolve(process.cwd(), 'auth', 'managerSupervisior.json');
const clericalStoragePath = path.resolve(process.cwd(), 'auth', 'clearicalStaff.json')

export const test = base.extend<AuthFixture>({

    systemAdminPage: async ({ browser }, use) => {

        let context; 

        // 1. Initialize context using the current state file if available
        if(fs.existsSync(adminStroragePath)){
            context = await browser.newContext({ storageState: adminStroragePath });
        } else {
            context = await browser.newContext();
        }

        const page = await context.newPage();
        await page.goto('/home');

        // 2. Active Session Validation Hook
        if(page.url().includes('/login') || await page.getByRole('button', {name: 'Log in'}).isVisible()){

            // Re-authenticate directly through the UI to repair the session state
            const loginPage = new LoginPage(page);
            await loginPage.fillLoginForm("max.admin@yopmail.com", "Admin@1234");

            await expect(page).toHaveURL('/home');

            // Rewrite the tracking file with the new session details
            fs.mkdirSync(path.dirname('systemAdmin'), { recursive: true });
            await context.storageState({path : adminStroragePath}); 
        }

        const homePage = new HomePage(page);

        await use({homePage}); // Hand over control execution to active test scope
        await context.close(); // Graceful encapsulation cleanup
    },

    mangerSupervisiorPage: async ({ browser }, use) => {

        let context; 

        // 1. Initialize context using the current state file if available
        if(fs.existsSync(managerStroragePath)){
            context = await browser.newContext({ storageState: managerStroragePath });
        } else {
            context = await browser.newContext();
        }

        const page = await context.newPage();
        await page.goto('/home');

        // 2. Active Session Validation Hook
        if(page.url().includes('/login') || await page.getByRole('button', {name: 'Log in'}).isVisible()){

            // Re-authenticate directly through the UI to repair the session state
            const loginPage = new LoginPage(page);
            await loginPage.fillLoginForm("joy.manager@yopmail.com", "Admin@1111");

            await expect(page).toHaveURL('/home');

            // Rewrite the tracking file with the new session details
            fs.mkdirSync(path.dirname('managerSupervisior'), { recursive: true });
            await context.storageState({path : managerStroragePath}); 
        }

        const homePage = new HomePage(page);

        await use({homePage}); // Hand over control execution to active test scope
        await context.close(); // Graceful encapsulation cleanup
    },
      
    clearicalStaff: async ({ browser }, use) => {

     let context; 

        // 1. Initialize context using the current state file if available
        if(fs.existsSync(clericalStoragePath)){
            context = await browser.newContext({ storageState: clericalStoragePath });
        } else {
            context = await browser.newContext();
        }

        const page = await context.newPage();
        await page.goto('/home');

        // 2. Active Session Validation Hook
        if(page.url().includes('/login') || await page.getByRole('button', {name: 'Log in'}).isVisible()){

            // Re-authenticate directly through the UI to repair the session state
            const loginPage = new LoginPage(page);
            await loginPage.fillLoginForm("edwin.cstaff@yopmail.com", "Admin@111");

            await expect(page).toHaveURL('/home');

            // Rewrite the tracking file with the new session details
            fs.mkdirSync(path.dirname(adminStroragePath), { recursive: true });
            await context.storageState({path : adminStroragePath}); 
        }

        const homePage = new HomePage(page);

        await use({homePage}); // Hand over control execution to active test scope
        await context.close(); // Graceful encapsulation cleanup
    },

})

export { expect };