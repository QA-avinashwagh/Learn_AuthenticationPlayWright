import {test} from "../fixtures/SecureFixture"; 


test("Indiviudal user flow check for admin  ", async({systemAdminPage})=>{

    await systemAdminPage.homePage.navigateToHome();
    await systemAdminPage.homePage.isHomeTabVisbile();
    await systemAdminPage.homePage.isheaderUserNameIsVisible("Max M Thompson");
})


test("Indiviudal user flow check for manger ", async({mangerSupervisiorPage})=>{

    await mangerSupervisiorPage.homePage.navigateToHome();
    await mangerSupervisiorPage.homePage.isHomeTabVisbile();
    await mangerSupervisiorPage.homePage.isheaderUserNameIsVisible("Joy Alexander");
})


test("Indiviudal user flow check for clerical ", async({clearicalStaff})=>{

    await clearicalStaff.homePage.navigateToHome();
    await clearicalStaff.homePage.isHomeTabVisbile();
    await clearicalStaff.homePage.isheaderUserNameIsVisible("Edwin Cooper");
})