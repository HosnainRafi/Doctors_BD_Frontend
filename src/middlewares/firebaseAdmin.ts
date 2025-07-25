import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use .cert() with your service account
    // databaseURL: "https://doctors-bd-6da30.firebaseio.com" // optional
  });
}

export default admin;
