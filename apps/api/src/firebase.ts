import admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const db = admin.database();
export const firestore = admin.firestore();
export const config = functions.config();
