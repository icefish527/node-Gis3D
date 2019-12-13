import axios from './axiosWrapper'
export const getStationsAll = (params) => {
    return axios.get("stations/all", params);
}


export const getStationsByNumber = (params) => {
    return axios.get("stations/stationnum", params);
}