import { Locator, Page } from "@playwright/test";

export class LoginPage {

    page : Page
    emailInput : Locator; 
    passwordinp : Locator;
    loginButton : Locator;

    constructor(page : Page){

        this.page = page; 
        this.emailInput = page.locator('#email');
        this.passwordinp = page.locator('#password'); 
        this.loginButton = page.getByRole('button', {name: 'Log In'}); 
    
    }

    async navigateToLoginPage(): Promise<void>{
        await this.page.goto('/login');
    }


    async fillLoginForm(email: string, passwrod :string) : Promise<void>{

        await this.emailInput.fill(email);
        await this.passwordinp.fill(passwrod); 

        await this.loginButton.click();  
    }

    






}






