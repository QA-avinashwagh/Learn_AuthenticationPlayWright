import { test as base, expect, Browser, APIRequestContext, BrowserContext } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

type APIAuthFixtures = {
    apiAdminPage: { homePage: HomePage };
    apiMangerPage: { homePage: HomePage };
    apiClericalPage: { homePage: HomePage };
};

// Heler Method : Headlessly hits the signin API, extracts the cookie safely, and returns a pre-authenticated context
async function createAuthenticatedContext(browser: Browser, request: APIRequestContext, email: string, password: string): Promise<BrowserContext> {
    // 1. Hit the signin API endpoint with the provided credentials and capture the response
    const response = await request.post("https://uat.carecoordinations.com/signin", {
        data: {
            email: email,
            password: password
        }
    });

    // Validate that the response is successful and contains the expected cookies
    expect(response.ok()).toBeTruthy();

    const context = await browser.newContext();

    // 2. Extract the 'Set-Cookie' headers from the response
    const headers = response.headersArray();
    const setCookieHeaders = headers.filter(h => h.name.toLowerCase() === 'set-cookie');

    if (setCookieHeaders.length === 0) {
        throw new Error("CRITICAL API ERROR: No 'Set-Cookie' headers were returned by the server response.");
    }

    // Parse and add each cookie returned by the backend safely without hitting undefined crashes
    const cookiesToInject = setCookieHeaders.map(header => {
        // A standard header value looks like: "care_coordinations_session=abc123xyz; Path=/; HttpOnly"
        const cookieKeyValuePair = header.value.split(';')[0];
        const [cookieName, cookieValue] = cookieKeyValuePair.split('=');

        return {
            name: cookieName.trim(),
            value: cookieValue.trim(),
            domain: 'uat.carecoordinations.com', // 🌟 Fix: Clean domain host address only!
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Lax' as const
        };
    });

    // 3. Inject the cookies into the new browser context to simulate an authenticated session
    await context.addCookies(cookiesToInject);
    return context; // Return the fully authenticated context for further use
}


    export const test = base.extend<APIAuthFixtures>({
        apiAdminPage: async ({ browser, request }, use) => {

            const context = await createAuthenticatedContext(browser, request, "max.admin@yopmail.com", "Admin@1234");
            const page = await context.newPage();
            const homePage = new HomePage(page);

            await use({ homePage });
            await context.close();
        }, 

        apiMangerPage: async ({ browser, request }, use) => {

            const context = await createAuthenticatedContext(browser, request, "joy.manager@yopmail.com", "Admin@1111");
            const page = await context.newPage();
            const homePage = new HomePage(page);

            await use({ homePage });
            await context.close();
        }, 

        apiClericalPage: async ({ browser, request }, use) => {

            const context = await createAuthenticatedContext(browser, request, "edwin.cstaff@yopmail.com", "Admin@111");
            const page = await context.newPage();
            const homePage = new HomePage(page);        
        
            await use({ homePage });
            await context.close();
        }

    });

    export { expect };