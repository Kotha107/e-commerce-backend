import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const serviceAccountPath = path.resolve("serviceAccountKey.json");

admin.initializeApp({
    credential:admin.credential.cert(serviceAccountPath),
    storageBucket: process.env.FIREBASE_BUCKET
});

export const bucket =admin.storage().bucket();