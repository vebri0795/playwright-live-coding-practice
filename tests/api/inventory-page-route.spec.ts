import { test, expect } from "@playwright/test"; 

const APP_HTML = `
<!DOCTYPE html>
<html>
<body>
  <button data-testid="load-btn">Load stock</button>
  <div data-testid="result"></div>
  <script>
    document.querySelector('[data-testid="load-btn"]').addEventListener('click', async () => {
      const resultEl = document.querySelector('[data-testid="result"]');
      resultEl.textContent = 'Loading...';
      try {
        const res = await fetch('/api/inventory/sku-1');
        if (!res.ok) throw new Error('request failed');
        const data = await res.json();
        resultEl.textContent = 'Stock: ' + data.quantity;
      } catch (e) {
        resultEl.textContent = 'Error loading stock';
      }
    });
  </script>
</body>
</html>
`;

const INVENTORY_API_ROUTE = "**/api/inventory/**";

test.describe("Mock API calls with page.route", () => {
    test('mock a successfull response', async ({ page }) => {
        await page.goto("https://example.com/");
        await page.setContent(APP_HTML);

        await page.route(INVENTORY_API_ROUTE, (route) => {
            route.fulfill({
                json: {
                    sku: "random",
                    price: 10,
                    quantity: 999
                },
                status: 200
            })
        })

        await page.getByTestId("load-btn").click();
        await expect(page.getByTestId("result")).toContainText("999");
    });

    test('mock a network failure', async ({ page }) => {
        await page.goto("https://example.com/");
        await page.setContent(APP_HTML);

        await page.route(INVENTORY_API_ROUTE, (route) => {
            route.abort()
        })

        await page.getByTestId("load-btn").click();
        await expect(page.getByTestId("result")).toContainText("Error loading stock");
    });
});

