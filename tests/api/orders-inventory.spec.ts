import { test, expect } from "@playwright/test"; 

const BASE_URL_INVENTORY = "http://localhost:4001/inventory";
const BASE_URL_ORDERS = "http://localhost:4000/orders";

test.describe("Inventory & Orders API tests", () => {
    test('verify inventory GET request works', async ({ request }) => {
        const res = await request.get(`${BASE_URL_INVENTORY}/sku-1`);
        expect(res.ok()).toBeTruthy();

        const body = await res.json();
        expect(body).toMatchObject({
            sku: 'sku-1',
            price: 10,
        });
        expect(body.quantity).toBeGreaterThanOrEqual(0)
    });

    test('verify ORDERS POST request works for valid sku', async ({ request }) => {
        const res = await request.post(BASE_URL_ORDERS, {
            data: {
                sku: "sku-1",
                quantity: 1
            }
        });
        expect(res.ok()).toBeTruthy();

        const body = await res.json();
        expect(body).toMatchObject({
            sku: 'sku-1',
            quantity: 1,
            status: "confirmed"
        });
        expect(body.total).toBeGreaterThanOrEqual(0)
    });

    test('verify ORDERS POST request works for invalid sku', async ({ request }) => {
        const res = await request.post(BASE_URL_ORDERS, {
            data: {
                sku: "invalid-sku",
                quantity: 1
            }
        });
        expect(res.ok()).toBeFalsy();

        const body = await res.json();
        console.log(body);

        expect(body).toMatchObject({
            error: "could not process order",
            detail: "Request failed with status code 404",
        });
    });

    test('verify ORDERS POST request works and verify inventory service', async ({ request }) => {
        let resInventoryObject: Record<string, any>;

        let resInventory = await request.get(`${BASE_URL_INVENTORY}/sku-1`);
        expect(resInventory.ok()).toBeTruthy();

        let bodyInventory = await resInventory.json();
        
        resInventoryObject = {
            sku: bodyInventory.sku,
            price: bodyInventory.price,
            quantity: bodyInventory.quantity
        }

        let resOrders = await request.post(BASE_URL_ORDERS, {
            data: {
                sku: "sku-1",
                quantity: 1
            }
        });
        expect(resOrders.ok()).toBeTruthy();

        resInventory = await request.get(`${BASE_URL_INVENTORY}/sku-1`);
        expect(resInventory.ok()).toBeTruthy();

        bodyInventory = await resInventory.json();

        expect(bodyInventory).toMatchObject({
            sku: resInventoryObject.sku,
            price: resInventoryObject.price,
            quantity: resInventoryObject.quantity - 1  
        });

    });
});