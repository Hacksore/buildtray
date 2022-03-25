import admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const db = admin.database();
export const config = functions.config();
