import axios from './axiosWrapper'
export const getStations = (params) => {
    return axios.get("stations", params);
}