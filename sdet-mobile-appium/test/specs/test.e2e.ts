import { expect, $ } from '@wdio/globals'

describe('WDIO Native Demo App - Login Flow', () => {
    it('should navigate to login tab and submit valid credentials', async () => {
        // 1. Click on the Login tab in the bottom navigation bar (Accessibility ID selector)
        const loginTab = await $('~Login')
        await loginTab.click()

        // 2. Wait for the email input field to be visible on the Login screen
        const emailInput = await $('~input-email')
        await emailInput.waitForDisplayed({ timeout: 10000 })

        // 3. Fill in the login form fields
        await emailInput.setValue('test@example.com')
        const passwordInput = await $('~input-password')
        await passwordInput.setValue('SuperPassword123!')

        // 4. Click the native Login submit button
        const loginButton = await $('~button-LOGIN')
        await loginButton.click()

        // 5. Assert that the native Success Dialog alert is displayed
        const successTitle = await $('android=new UiSelector().text("Success")')
        await expect(successTitle).toBeDisplayed()

        // 6. Click the OK button on the native dialog to dismiss it
        const okButton = await $('android=new UiSelector().text("OK")')
        await okButton.click()
    })
})
