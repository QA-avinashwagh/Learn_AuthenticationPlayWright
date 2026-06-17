import { test } from "../fixtures/BaseFixture"

test('Basic UI Authentication test', async ({ loginPage, homePage }) => {

    await loginPage.navigateToLoginPage(); 
    await loginPage.fillLoginForm("max.admin@yopmail.com", "Admin@1234");
    await homePage.isHomeTabVisbile(); 
    await homePage.isheaderUserNameIsVisible("Max M Thompson");

})