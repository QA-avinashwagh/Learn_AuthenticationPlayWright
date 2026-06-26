import {test} from "../fixtures/APIAuthFixtures"


test("API Based Authentication for system Admin", async({apiAdminPage: {homePage}})=>{

    await homePage.navigateToHome(); 
    await homePage.isHomeTabVisbile();
    await homePage.isheaderUserNameIsVisible("Max M Thompson");


})