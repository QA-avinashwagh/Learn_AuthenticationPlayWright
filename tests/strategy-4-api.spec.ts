import {test} from "../fixtures/APIAuthFixtures"


test("API Based Authentication for system Admin", async({apiAdminPage: {homePage}})=>{

    await homePage.navigateToHome(); 
    await homePage.isHomeTabVisbile();
    await homePage.isheaderUserNameIsVisible("Max M Thompson");

})

test("API Based Authentication for system Manager", async({apiMangerPage: {homePage}})=>{

    await homePage.navigateToHome(); 
    await homePage.isHomeTabVisbile();
    await homePage.isheaderUserNameIsVisible("Joy Alexander");

})

test("API Based Authentication for system Clerical", async({apiClericalPage: {homePage}})=>{

    await homePage.navigateToHome(); 
    await homePage.isHomeTabVisbile();
    await homePage.isheaderUserNameIsVisible("Edwin Cooper");

})