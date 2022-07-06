'use strict';

const fcmUtil = require('../../../util/fcm');
const uid = 'plugin::strapi-plugin-fcm.fcm-notification';
const getService = () => {
    return strapi.plugin('strapi-plugin-fcm').service('fcm-notification');
}
module.exports = {
    schema: require('./schema'),
    lifecycles: {
        async afterCreate(event) {
            // console.log('afterCreate', event);
            if (event?.model?.uid === uid && event?.params?.data?.publishedAt) {
                //    await fcmUtil.send(event.result);
            }
        },
        async afterUpdate(event) {
            // console.log('afterUpdate', event);
            if (event?.model?.uid === uid && event?.params?.data?.publishedAt) { // send if publishedAt is changed ?
                //    await fcmUtil.send(event.result);
                const id = event?.params?.where?.id;
                console.log('afterUpdate id', id);
                if (id) {
                    const entry = await getService().findOne(id);
                    console.log('afterUpdate result', entry);
                    if (entry?.id && (!entry?.response || (entry?.response && Object.keys(entry.response).length === 0))) {
                        fcmUtil.send(entry)
                            .then(async (fcmResponse) => {
                                console.log('afterUpdate send response', fcmResponse);
                                await getService().update(id, {data: {response: fcmResponse || {}}});
                            })
                            .catch(async (error) => {
                                console.log('afterUpdate send error', error);
                                await getService().update(id, {data: {response: error || {}}});
                            });
                    }
                }
            }
        }
    },
};