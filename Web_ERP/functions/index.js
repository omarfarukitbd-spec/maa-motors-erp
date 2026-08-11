const functions = require("firebase-functions");
const axios = require("axios");

exports.sendSmsViaProxy = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to send SMS.');
    }

    const { apiKey, smsType, cleanPhone, senderId, message } = data;
    
    if (!apiKey || !cleanPhone || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters for SMS');
    }

    const encodedMsg = encodeURIComponent(message);
    const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=${smsType}&number=${cleanPhone}&senderid=${senderId}&message=${encodedMsg}`;

    try {
        const response = await axios.get(url);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error calling BulkSMSBD:", error.message);
        throw new functions.https.HttpsError('internal', 'Failed to send SMS through provider');
    }
});

const admin = require('firebase-admin');
admin.initializeApp();

exports.createUser = functions.https.onCall(async (data, context) => {
    // 1. Check if caller is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to create a user.');
    }

    // 2. Check if caller is an Admin (We check the users collection for their role)
    const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!callerDoc.exists || callerDoc.data().role !== 'Admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only Admins can create new users.');
    }

    const { email, password, role } = data;
    if (!email || !password || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields (email, password, role).');
    }

    try {
        // 3. Create the user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        // 4. Save the user in Firestore users collection
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            email: email,
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, uid: userRecord.uid };
    } catch (error) {
        console.error("Error creating user:", error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
