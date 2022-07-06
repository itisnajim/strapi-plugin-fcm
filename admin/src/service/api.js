import instance from "../utils/axiosInstance";


export default {
    getTargets: async (page, pageSize = 20) => {
        const { data } = await instance.request({
            url: '/fcm-targets',
            method: 'get',
            params: {
                pagination: {
                    page,
                    pageSize
                },
                populate: '*'
            }
        });

        return data;
    },
    sendFCMs: async (entries) => {
        const { data } = await instance.request({
            url: '/fcm-notifications',
            method: 'post',
            data: {data: entries}
        });

        return data;
    }
};
