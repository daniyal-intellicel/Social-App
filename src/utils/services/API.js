import axios from 'axios';
import {env} from '../../constants';

const buildFormData = (formData, data, parentKey) => {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    // eslint-disable-next-line no-undef
    !(data instanceof File) &&
    !data.donotConvertToJSON
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key,
      );
    });
  } else if (data instanceof Date) {
    const value = data.toString();

    formData.append(parentKey, value);
  } else {
    data && delete data.donotConvertToJSON;

    const value = data === null ? '' : data;

    formData.append(parentKey, value);
  }
};

class API {
  execute = (api, params) => {
    return new Promise(async (resolve, reject) => {
      let headers = {};

      const formData = new FormData();
      params &&
        api.method.dataFormat === 'formData' &&
        buildFormData(formData, params.data);

      // return axios
      //   .postForm(
      //     `${api.noPrefixRequired ? '' : API_URL_PREFIX}${api.path}`,
      //     formData,
      //   )
      //   .then(
      //     (response) => {
      //       console.log('API Response', response);
      //     },
      //     (error) => {
      //       console.error('API Error', error);
      //     },
      //   );
      return axios({
        method: api.method.type,
        url: `${api.noPrefixRequired ? '' : env.API_URL_PREFIX}${api.path}`,
        data: params
          ? api.method.dataFormat === 'formData'
            ? formData
            : params.data
          : null,
        headers: {...headers, ...(api.method.headers || null)},
      })
        .then(
          (response) => {
            resolve(response.data);
          },
          (error) => {
            let {message} = error;

            if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              message = error.response.data.message;
            } else if (error && error.response && error.response.message) {
              message = error.response.message;
            } else if (!message) {
              message = 'Request Failed.';
            }

            // print error in console/terminl log with red background
            // console.log('\x1b[41m%s%s\x1b[0m', 'Error', error);
            console.error('Error', error);
            console.error('Error message:', message);
            reject({message});
          },
        )
        .catch((err) => {
          console.error('err', err);
        });
    });
  };
}

export default new API();
