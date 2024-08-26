"use strict";

const admin = require("firebase-admin");

module.exports = {
    /*
    * Send a message to a device(s) or a topic.
    * @param {Object} entry - of type: see the attributes in schema ../server/content-types/fcm-notification/schema.json
    * @returns {Promise<any>}
    * */
    send: async (entry) => {
        console.log('send to FCM', entry);
        let payload = {
            notification: {
              title: entry.title
            }
        };
        if (entry.body) {
            payload.notification.body = entry.body;
        }
        if (entry.image) {
            payload.notification.imageUrl = entry.image;
        }

        if (entry.payload) {
          try {
            let jsonPayload = JSON.parse(entry.payload);
            payload = { ...payload, ...jsonPayload };
          } catch {
            console.log("parsing failed so sending without payload")
          }
        }

        let options = {
          mutableContent: true
        }

        // console.log('payload', payload, 'target is ', entry.target);
        let res = null;
        if (entry.targetType === 'tokens') {
            const tokens = entry.target.split(',');

            /*
            * Deprecated Endpoints:
            * The Firebase Admin SDK has deprecated the sendMulticast and sendToDevice methods.
            * These were causing issues with errors like:
            * FirebaseMessagingError: An unknown server error was returned. 
            * Raw server response: "{"error":"Deprecated endpoint, see https://firebase.google.com/docs/cloud-messaging/migrate-v1"}"
            *
            * Replacements:
            * - sendMulticast() -> sendEachForMulticast()
            * - sendToDevice() -> send() with token field
            */

            if (tokens.length > 1) {
                // Using sendEachForMulticast() instead of the deprecated sendMulticast()
                res = await admin.messaging().sendEachForMulticast({
                    tokens: tokens,
                    notification: payload.notification,
                });
            } else {
                // Using send() with token instead of the deprecated sendToDevice()
                res = await admin.messaging().send({
                    token: entry.target,
                    notification: payload.notification,
                });
            }
        } else {
            const topics = entry.target.split(',');

            /*
            * Deprecated Endpoints:
            * The Firebase Admin SDK has deprecated the sendToTopic and sendToCondition methods.
            * These were causing issues with deprecated endpoint errors.
            *
            * Replacements:
            * - sendToTopic() -> send() with topic field
            * - sendToCondition() -> send() with condition field
            */

            if (topics.length > 1) {
                // Using send() with condition instead of the deprecated sendToCondition()
                const condition = topics.map(t => `'${t}' in topics`).join(' || ');
                res = await admin.messaging().send({
                    condition: condition,
                    notification: payload.notification,
                });
            } else {
                // Using send() with topic instead of the deprecated sendToTopic()
                res = await admin.messaging().send({
                    topic: entry.target,
                    notification: payload.notification,
                });
            }
        }
        console.log('send to FCM res', JSON.stringify(res));
        return res;
    },
    /*
    * Initialize or reinitialize the firebase app
    * */
    initialize: async (strapi) => {
        // console.log('initialize FCM');
        const data = await strapi.db.query('plugin::strapi-plugin-fcm.fcm-plugin-configuration').findOne({
            select: ['serviceAccount']
        });
        // console.log('serviceAccount', serviceAccount);
        // console.log('admin.apps?.length', admin.apps?.length);
        if (data !== null && data.serviceAccount) {
            if (admin.apps?.length > 1) {
                Promise.all(admin.apps.map(app => app.delete())).then(() => {
                    admin.initializeApp({
                        credential: admin.credential.cert(data.serviceAccount)
                    });
                });
            } else {
                admin.initializeApp({
                    credential: admin.credential.cert(data.serviceAccount),
                });
            }
        }
    }
}