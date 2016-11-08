import { remote } from 'electron';
import { apiKey } from '../../../configs/apiKey.json';

const ApiClass = remote.require('./api/lolApi').lolApi;
const lolApi = new ApiClass(apiKey);

const FETCH_FTP_CHAMPIONS_START = 'app/ftp/FETCH_FTP_CHAMPIONS';
const FETCH_FTP_CHAMPIONS_SUCCESS = 'app/ftp/FETCH_FTP_CHAMPIONS_SUCCESS';
const FETCH_FTP_CHAMPIONS_ERROR = 'app/ftp/FETCH_FTP_CHAMPIONS_ERROR';

export const fetchFtpChampions = () =>
  (dispatch, getState) => {
    const state = getState().search;
    const region = state.selectedRegion.short;

    dispatch({ type: FETCH_FTP_CHAMPIONS_START });

    return lolApi.createQuery('champions', { region, freeToPlay: true })
      .then(result => dispatch({
        type: FETCH_FTP_CHAMPIONS_SUCCESS,
        payload: result
      }))
      .catch(err => dispatch({ type: FETCH_FTP_CHAMPIONS_ERROR, payload: err }));
  };

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_FTP_CHAMPIONS_START:
      return state;
    case FETCH_FTP_CHAMPIONS_SUCCESS:
      return { ...state, ...action.payload };
    case FETCH_FTP_CHAMPIONS_ERROR:
      return { ...state, err: action.payload };
    default:
      return state;
  }
}
