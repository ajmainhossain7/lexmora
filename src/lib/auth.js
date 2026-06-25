import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.AUTH_DB_URI);
const dbName = process.env.AUTH_DB_URI.split('/').pop().split('?')[0] || 'lexmora_db';

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    },
    database: mongodbAdapter(client.db(dbName)),
    user: {
        additionalFields: {
            role: {
                default: "user"
            },
            plan: {
                default: 'user_free'
            }
        }
    },
    plugins: [
        admin(),
        jwt()
    ]
});