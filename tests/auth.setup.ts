import {test as setup, expect} from "../fixtures/BaseFixture"


const adminStoragePath = 'auth/systemAdmin.json'; 
const mangerStoragePath = 'auth/managerSupervisior.json'; 
const clearicalStoragePath = 'auth/clearicalStaff.json';

setup("Authenticate System Admin Account Session", async({loginPage, page})=>{

    await loginPage.navigateToLoginPage(); 
    await loginPage.fillLoginForm("max.admin@yopmail.com", "Admin@1234");

    await expect(page).toHaveURL('/home');

    await page.context().storageState({path :adminStoragePath}); 

});

setup("Authenticate Manager Supervisor Account Session", async({loginPage, page})=>{

    await loginPage.navigateToLoginPage(); 
    await loginPage.fillLoginForm("joy.manager@yopmail.com", "Admin@1111");
    
    await expect(page).toHaveURL('/home');

    await page.context().storageState({path :mangerStoragePath}); 

});

setup("Authenticate Clearical Staff Account Session", async({loginPage, page})=>{

    await loginPage.navigateToLoginPage(); 
    await loginPage.fillLoginForm("edwin.cstaff@yopmail.com", "Admin@111");

    await expect(page).toHaveURL('/home');

    await page.context().storageState({path :clearicalStoragePath}); 

});