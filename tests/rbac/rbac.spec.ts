import { test, expect, Page } from "@playwright/test";

const APP_HTML = `
<!DOCTYPE html>
<html>
<body>
  <div data-testid="user-list"></div>
  <div data-testid="error-message"></div>
  <script>
    let currentRole = null;

    function renderUsers(users) {
      const container = document.querySelector('[data-testid="user-list"]');
      container.innerHTML = '';
      users.forEach(function(u) {
        const row = document.createElement('div');
        row.setAttribute('data-testid', 'user-row-' + u.id);
        row.textContent = u.name + ' ';
        if (currentRole === 'admin') {
          const btn = document.createElement('button');
          btn.setAttribute('data-testid', 'delete-btn-' + u.id);
          btn.textContent = 'Delete';
          btn.addEventListener('click', async function() {
            const res = await fetch('/api/users/' + u.id, {
              method: 'DELETE',
              headers: { 'X-Role': currentRole }
            });
            if (res.ok) {
              row.remove();
            } else {
              document.querySelector('[data-testid="error-message"]').textContent = 'Not authorized';
            }
          });
          row.appendChild(btn);
        }
        container.appendChild(row);
      });
    }

    window.initApp = async function(role) {
      currentRole = role;
      const res = await fetch('/api/users');
      const users = await res.json();
      renderUsers(users);
    };
  </script>
</body>
</html>
`;

const USERS_LIST_ROUTE = "**/api/users";
const SINGLE_USER_ROUTE = "**/api/users/*";

const MOCK_USERS = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
];

function mockDeleteEnforcingAdminRole(page: Page) {
    return page.route(SINGLE_USER_ROUTE, (route) => {
        const role = route.request().headers()['x-role'];
        if (role === 'admin') {
            route.fulfill({ status: 200, json: { ok: true } });
        } else {
            route.fulfill({ status: 403, json: { error: 'Forbidden' } });
        }
    });
}

test.describe("RBAC - admin panel", () => {
    test('Role admin: Delete button is visible and delete works', async ({ page }) => {
        await page.goto("https://example.com/");
        await page.setContent(APP_HTML);

        await page.route(USERS_LIST_ROUTE, (route) => {
            route.fulfill({ status: 200, json: MOCK_USERS });
        });
        await mockDeleteEnforcingAdminRole(page);

        await page.evaluate(async () => {
            await (window as any).initApp('admin');
        });

        await expect(page.getByTestId('delete-btn-1')).toBeVisible();

        await page.getByTestId('delete-btn-1').click();
        await expect(page.getByTestId('user-row-1')).toHaveCount(0);
    });

    test('Role viewer: Delete button is not present in the DOM', async ({ page }) => {
        await page.goto("https://example.com/");
        await page.setContent(APP_HTML);

        await page.route(USERS_LIST_ROUTE, (route) => {
            route.fulfill({ status: 200, json: MOCK_USERS });
        });

        await page.evaluate(async () => {
            await (window as any).initApp('viewer');
        });

        await expect(page.getByTestId('delete-btn-1')).toHaveCount(0);
        await expect(page.getByTestId('delete-btn-2')).toHaveCount(0);
    });

    test('Role viewer: backend still rejects delete even bypassing the UI', async ({ page }) => {
        await page.goto("https://example.com/");
        await page.setContent(APP_HTML);

        await mockDeleteEnforcingAdminRole(page);

        const status = await page.evaluate(async () => {
            const res = await fetch('/api/users/1', {
                method: 'DELETE',
                headers: { 'X-Role': 'viewer' },
            });
            return res.status;
        });

        expect(status).toBe(403);
    });
});

