import { test, expect } from "../fixtures/BaseFixture"

test('Basic UI Authentication test for system Admin', async ({ loginPage, homePage, page }) => {

    await loginPage.navigateToLoginPage(); 
    await loginPage.fillLoginForm("max.admin@yopmail.com", "Admin@1234");
    await expect(page).toHaveURL(/.*\/home/);
    
    await homePage.isHomeTabVisbile(); 
    await homePage.isheaderUserNameIsVisible("Max M Thompson");

})

test('Basic UI Authentication test for Manger Supervisor', async ({ loginPage, homePage, page }) => {

    await loginPage.navigateToLoginPage(); 
    await loginPage.fillLoginForm("joy.manager@yopmail.com", "Admin@1111");
    await expect(page).toHaveURL(/.*\/home/);

    await homePage.isHomeTabVisbile(); 
    await homePage.isheaderUserNameIsVisible("Joy Alexander");

})

test('Basic UI Authentication test for system Clerical', async ({ loginPage, homePage, page }) => {

    await loginPage.navigateToLoginPage(); 
    await loginPage.fillLoginForm("edwin.cstaff@yopmail.com", "Admin@111");
    await expect(page).toHaveURL(/.*\/home/);
    await homePage.isHomeTabVisbile(); 
    await homePage.isheaderUserNameIsVisible("Edwin Cooper");

})
