import axios from 'axios';
import { authReset, resetToken } from 'redux/actions';
import { API_ENDPOINTS } from 'redux/apiEndPoints';

// for multiple requests
let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
    failedQueue.forEach((promise: any) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    })

    failedQueue = [];
}

export default {
    setupInterceptors: (store: any) => {
        axios.interceptors.response.use(function (response) {
            return response;
        }, async function (error) {
            const originalRequest = error.config;

            if (error.response?.status === 401 && error.response?.config?.url?.includes('Auth/RefreshToken')) {
                store.dispatch(authReset());
            } else if (error.response?.status === 401 && !originalRequest._retry) {

                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject })
                    }).then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axios(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    })
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = store.getState().auth.data.refresh_token;
                return new Promise(function (resolve, reject) {
                    axios.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken })
                        .then((res) => {
                            const { data, status } = res;
                            if (status === 200) {
                                store.dispatch(resetToken(data));
                                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
                                originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token;
                                processQueue(null, data.access_token);
                                resolve(axios(originalRequest));
                            } else {
                                store.dispatch(authReset());
                            }
                        })
                        .catch((err) => {
                            processQueue(err, null);
                            reject(err);
                        })
                        .finally(() => {
                            isRefreshing = false
                        })
                })
            }

            return Promise.reject(error);
        });
    }
};