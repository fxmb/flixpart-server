const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

let DATABASE_EXTRA = {};
if (process.env.NODE_ENV === "production") {
  DATABASE_EXTRA = { ssl: { rejectUnauthorized: false } };
}

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:local@localhost:54320/flixpart_server_db";

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Algolia
const ALOGLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: STRIPE_WEBHOOK_SECRET,
      automatic_payment_methods: true,
    },
  },
  {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: process.env.PAYPAL_SANDBOX,
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID,
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
      customer_password_reset_template:
        process.env.SENDGRID_CUSTOMER_PASSWORD_RESET_ID,
    },
  },
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      application_id: ALOGLIA_APP_ID,
      admin_api_key: ALGOLIA_ADMIN_API_KEY,
      settings: {
        products: {
          searchableAttributes: ["title", "description"],
          attributesToRetrieve: [
            "id",
            "title",
            "description",
            "handle",
            "thumbnail",
            "variants",
            "variant_sku",
            "options",
            "collection_title",
            "collection_handle",
            "images",
          ],
        },
      },
    },
  },
];

module.exports = {
  projectConfig: {
    database_type: "postgres",
    database_url: DATABASE_URL,
    database_extra: DATABASE_EXTRA,
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    redis_url: REDIS_URL,
  },
  plugins,
  featureFlags: {
    tax_inclusive_pricing: true,
  },
};
