import {test as base, expect } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { HomePage } from "../pages/HomePage";

type BaseFixture = {

    loginPage : LoginPage;
    homePage : HomePage;

}


export const test = base.extend<BaseFixture> ({

    loginPage : async({page}, use)=>{
        await use(new LoginPage(page))
    }, 

    homePage : async({page}, use) =>{
        await use(new HomePage(page))
    }


})

export {expect};