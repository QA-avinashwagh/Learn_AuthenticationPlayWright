import {expect, test} from "../fixtures/AuthRoleFixture"; 



test("Colobration work flow check ", async({systemAdminPage})=>{

    await systemAdminPage.homePage.isHomeTabVisbile();
    await systemAdminPage.homePage.isheaderUserNameIsVisible("Max M Thompson");



})
