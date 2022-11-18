'use strict';

const {
    getPaginationInfo,
    convertPagedToStartLimit,
    shouldCount,
    transformPaginationResponse,
} = require('@strapi/strapi/lib/core-api/service/pagination');

const { getFetchParams } = require('@strapi/strapi/lib/core-api/service');


// we will use this for now, until we have a better way.
const getQuery = (
    devicesTokensCollectionName,
    deviceTokenFieldName,
    deviceLabelFieldName,
    offset = 0,
    limit = 25
) => {
    if (!devicesTokensCollectionName) {
        return `select fcm_topics.name as label, 'topic' as type, fcm_topics.name as value from fcm_topics limit ${limit} offset ${offset}`;
    }
    return `(select fcm_topics.label as label, 'topic' as type, fcm_topics.name as value from fcm_topics)
union all
(select ${devicesTokensCollectionName}.${deviceLabelFieldName} as label, 'token' as type, ${devicesTokensCollectionName}.${deviceTokenFieldName} as value from ${devicesTokensCollectionName} where coalesce(TRIM(${devicesTokensCollectionName}.${deviceTokenFieldName}), '') <> '') limit ${limit} offset ${offset}`;

};

const countQuery = (
    devicesTokensCollectionName,
    deviceTokenFieldName
) => {
    if (!devicesTokensCollectionName) {
        return `select count(*) as count from fcm_topics`;
    }
    return `select count(*) from ((select fcm_topics.name as value from fcm_topics)
union all
(select ${devicesTokensCollectionName}.${deviceTokenFieldName} as value from ${devicesTokensCollectionName} where coalesce(TRIM(${devicesTokensCollectionName}.${deviceTokenFieldName}), '') <> '')) as targets;
`;
};

const getConfigurationService = () => {
    return strapi.plugin('strapi-plugin-fcm').service('fcm-plugin-configuration');
}

module.exports = ({ strapi }) => ({

    async find(params = {}) {

        const fetchParams = getFetchParams(params);
        const paginationInfo = getPaginationInfo(fetchParams);
        const startLimit = convertPagedToStartLimit(paginationInfo);
        // console.log('startLimit', startLimit, 'paginationInfo', paginationInfo);

        const knex = strapi.db.connection;

        const configs = (await getConfigurationService().find()).data;
        // console.log('fcm-target configs', configs);

        const devicesTokensCollectionName = configs.devicesTokensCollectionName;
        const deviceTokenFieldName = configs.deviceTokenFieldName;
        const deviceLabelFieldName = configs.deviceLabelFieldName;

        const results = await knex.raw(
            getQuery(devicesTokensCollectionName,
                deviceTokenFieldName,
                deviceLabelFieldName,
                startLimit.start || 0,
                startLimit.limit || 25)
        );
        let rows
        switch (knex.client.config.client) {
          case 'better-sqlite3': {
            rows = results
            break;
          }
          default: {
            rows = results.rows || results[0];
            break;
          }
        }
        // console.log('fcm-target results', rows);
        if (shouldCount(fetchParams)) {
            const countResult = await knex.raw(countQuery(devicesTokensCollectionName, deviceTokenFieldName, deviceLabelFieldName));
            const count = (countResult.rows || countResult[0])?.[0]?.count;
            // console.log('fcm-target countResult', count);
            return {
                data: rows,
                pagination: transformPaginationResponse(paginationInfo, Number(count)),
            };
        }

        return {
            data: rows,
            pagination: paginationInfo,
        };

    },
    count(params = {}) {
        const knex = strapi.db.connection;
        return knex.raw(countQuery('fcm_tokens', 'token', 'label'));
    },

});
