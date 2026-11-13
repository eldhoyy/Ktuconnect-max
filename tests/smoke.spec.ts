import { test, expect } from "@playwright/test";
const routes = ["/", "/study-plan", "/subjects", "/profile", "/notes", "/pyq", "/syllabus", "/timetable", "/updates", "/sources", "/about", "/onboarding", "/progress", "/request", "/admin/login", "/admin", "/subjects/GYMAT301", "/semesters/3"];
for (const route of routes) {
 test(`renders ${route} at 360/390/430px in both themes`, async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(route);
  if (route === "/admin") await page.waitForURL("**/admin/login");
  for (const theme of ["light", "dark"]) {
   await page.evaluate(value => { localStorage.setItem("datum-theme", value); document.documentElement.dataset.theme = value; }, theme);
   for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator("body")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width === 390 && theme === "light") {
     const buttons = page.locator("button:visible");
     const count = await buttons.count();
     for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible() && await button.isEnabled()) {
       const label = (await button.getAttribute("aria-label")) || (await button.innerText()).trim();
       expect(label, `button on ${route} must have an accessible label`).not.toBe("");
       if (label.toLowerCase().includes("go back")) continue;
       await button.click();
       const dialog = page.locator('[role="dialog"]:visible').last();
       if (await dialog.count()) {
        const close = dialog.locator('button[aria-label*="Close"],button[aria-label*="close"]').first();
        if (await close.count()) await close.click();
       }
      }
     }
    }
   }
  }
  expect(errors, `runtime errors on ${route}`).toEqual([]);
 });
}
test("home goal, search and preferences controls open real surfaces", async ({ page }) => {
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 await page.getByRole("button",{name:/set your weekly study goal/i}).click();
 await expect(page.getByRole("dialog",{name:/weekly study goal/i})).toBeVisible();
 await page.getByRole("button",{name:/close/i}).click();
 await page.getByRole("button",{name:/search/i}).click();
 await expect(page.getByRole("dialog",{name:/search/i})).toBeVisible();
 await page.getByRole("button",{name:/close/i}).click();
 await page.getByRole("button",{name:/open menu and preferences/i}).click();
 await expect(page.getByRole("dialog",{name:/preferences/i})).toBeVisible();
});
test("schedule date controls open selected-date details", async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/study-plan");
 await page.locator(".date-cell").first().click();
 await expect(page.getByRole("dialog",{name:/selected date details/i})).toBeVisible();
});

test("390px light/dark visual audit screenshots for every screen", async ({ page }, testInfo) => {
 test.setTimeout(120_000);
 await page.setViewportSize({width:390,height:844});
 const fs=await import("node:fs/promises");
 const path=await import("node:path");
 const output=testInfo.outputPath("motion-audit");
 await fs.mkdir(output,{recursive:true});
 for(const route of routes){
  await page.goto(route);
  if(route==="/admin") await page.waitForURL("**/admin/login");
  const slug=route==="/"?"home":route.replaceAll("/","-").replace(/^-+/,"");
  for(const theme of ["light","dark"]){
   await page.evaluate(value=>{
    localStorage.setItem("datum-theme",value);
    document.documentElement.dataset.theme=value;
   },theme);
   await page.waitForTimeout(220);
   await page.evaluate(()=>document.fonts.ready.then(()=>true));
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
   await page.screenshot({path:path.join(output,slug+"-"+theme+".png"),fullPage:true,animations:"disabled"});
  }
 }
});
