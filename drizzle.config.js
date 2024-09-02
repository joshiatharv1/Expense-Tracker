import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });


export default defineConfig({
  schema: './utils/schema.jsx',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL
  },
});