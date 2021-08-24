const request = require('supertest')
const { app } = require('../index')
const moment = require('moment')
const Pool = require('pg-pool')

require('dotenv').config();

describe('Transaction', () => {
    let pool;

    beforeAll(() => {
        (async () => {
        pool = new Pool({
            database: 'postgres-test',
            user: 'postgres',
            password: 'password',
            port: 5432,
        });
        pool.query("CREATE TABLE merchants (id SERIAL PRIMARY KEY, display_name TEXT);");
        pool.query("CREATE TABLE transactions (id SERIAL PRIMARY KEY, user_id INTEGER, merchant_id INTEGER, amount INTEGER, description TEXT, date DATE);");
        })()
        .catch(e => console.error(e.message, e.stack))
    });

    afterAll(() => {
        (async () => {
        pool.query(
            "DROP TABLE merchants, transactions;",
            () => {
              pool.end();
            }
        );
        })()
        .catch(e => console.error(e.message, e.stack))
    });

    it('GET /transaction/:userId - returns a 400 error code (bad data) for a user who has not made a single transaction on any merchant yet', async () => {
        const res = await request(app)
            .get('/api/v1/transactions/32780');

        expect(res.statusCode).toEqual(400)
        expect(res.text).toBe('No data found for this user');
    })

    it('GET /transaction/:userId - returns a 400 error code (bad data) for passing from date after to date', async () => {
        pool.query("INSERT INTO merchants(id, display_name) VALUES (67900, 'Merchant1'), (98400, 'Merchant2'), (17700, 'Merchant3');");
        pool.query("INSERT INTO transactions(id, user_id, merchant_id, amount, description, date) VALUES (74793, 78901, 67900, 50, 'desc', '2021-05-24'), (75494, 65935, 67900, 200, 'desc', '2021-05-24'), (63748, 75849, 67900, 100, 'desc', '2021-05-24'), (63938, 65789, 67900, 80, 'desc', '2021-05-24'), (19838, 98245, 67900, 300, 'desc', '2021-05-24'), (75960, 78901, 98400, 70, 'desc', '2021-05-24'), (52845, 65935, 98400, 150, 'desc', '2021-05-24'), (93747, 75849, 67900, 180, 'desc', '2021-05-24'), (43857, 65789, 98400, 110, 'desc', '2021-05-24'), (37547, 98245, 98400, 210, 'desc', '2021-05-24'), (19437, 78901, 17700, 200, 'desc', '2021-05-24'), (43947, 65935, 17700, 90, 'desc', '2021-05-24'), (63494, 75849, 17700, 150, 'desc', '2021-05-24'), (74749, 65789, 17700, 240, 'desc', '2021-05-24'), (84327, 98245, 17700, 170, 'desc', '2021-05-24'), (64959, 78901, 67900, 160, 'desc', '2021-05-24'), (94275, 65935, 67900, 70, 'desc', '2021-05-24'), (73484, 75849, 17700, 240, 'desc', '2021-05-24'), (42394, 98245, 17700, 130, 'desc', '2021-05-24'), (49848, 65935, 98400, 310, 'desc', '2021-05-24'), (43497, 65789, 98400, 120, 'desc', '2021-05-24');");

        const res = await request(app)
            .get(`/api/v1/transactions/75849?from=${moment().add(20, 'd').toISOString()}`);

        expect(res.statusCode).toEqual(400)
        expect(res.text).toBe("'to' Date cannot before 'from' date");
    })

    it('GET /transaction/:userId - returns a 200 status code and provides data for the users transactions based on the user id and date range passed', async () => {
        const res = await request(app)
            .get(`/api/v1/transactions/75849?from=${moment('2021-05-01').toISOString()}`);

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toStrictEqual({
            user_id: 75849,
            Percentile: 1,
            'display_name': 'Merchant3'
        });
        expect(res.body[1]).toStrictEqual({
            user_id: 75849,
            Percentile: 0.75,
            'display_name': 'Merchant1'
        });
    })

    it('GET /transaction/:userId - returns a 200 status code and empty array for user who has not made a transaction in the specified date range', async () => {
        const res = await request(app)
            .get(`/api/v1/transactions/75849?from=${moment('2021-07-01').toISOString()}`);

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toBe(0);
        expect(res.body).toStrictEqual([]);
    })

    it('GET /transaction/:userId - returns a 200 status code and percentile of 1 for user who has made the most transactions & percentile of 0 for user who has not made the least number of transactions in the specified date range and mapped to the merchants', async () => {
        const res = await request(app)
            .get(`/api/v1/transactions/65935?from=${moment('2021-05-01').toISOString()}`);

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toBe(3);
        expect(res.body[0]).toStrictEqual({
            user_id: 65935,
            Percentile: 0,
            'display_name': 'Merchant3'
        });
        expect(res.body[1]).toStrictEqual({
            user_id: 65935,
            Percentile: 0.5,
            'display_name': 'Merchant1'
          });
        expect(res.body[2]).toStrictEqual({
            user_id: 65935,
            Percentile: 1,
            'display_name': 'Merchant2'
          });
    })
  })