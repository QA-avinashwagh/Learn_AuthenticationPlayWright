import { test as base, expect, Browser, APIRequestContext } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

type APIAuthFixtures = {
    apiAdminPage: { homePage: HomePage };
};

async function createAuthenticatedContext(browser: Browser, request: APIRequestContext, email: string, password: string): Promise<context> {
    // 1. Send the background sign-in request
    const response = await request.post("https://uat.carecoordinations.com/signin", {
        data: {
            email: email,
            password: password
        }
    });

    // Fail fast if the endpoint itself fails
    expect(response.ok()).toBeTruthy();

    // 2. Provision an completely pristine, isolated browser profile context container
    const context = await browser.newContext();

    // 3. SAFE ENTERPRISE PATTERN: Extract cookies cleanly using response.headersArray()
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

    // 4. Inject the parsed cookie array directly into browser memory
    await context.addCookies(cookiesToInject);
    return context; // Return the fully authenticated context for further use
}


    export const test = base.extend<APIAuthFixtures>({
        apiAdminPage: async ({ browser, request }, use) => {

            // 1. Send the background sign-in request
            const response = await request.post("https://uat.carecoordinations.com/signin", {
                data: {
                    email: 'max.admin@yopmail.com',
                    password: 'Admin@1234'
                }
            });


            // 5. Initialize Page Instance and hand over control to the active test scope
            const page = await context.newPage();
            const homePage = new HomePage(page);

            await use({ homePage });

            // 6. Graceful cleanup sequence
            await context.close();
        }
    });

    export { expect };