import axios from "axios";

import { VUE_APP_API_URL } from "@utils/index";

const instance = axios.create({
  baseURL: VUE_APP_API_URL,
  timeout: 5000
});

// const defaultOpt = { login: true };

function baseRequest(options) {
  console.log(VUE_APP_API_URL);
  return instance(options).then(res => {
    const data = res.data || {};  
    if (res.status !== 200)
      return Promise.reject({ msg: "请求失败", res, data });

    if ([410000, 410001, 410002].indexOf(data.status) !== -1) {
      // toLogin();
      return Promise.reject({ msg: res.data.msg, res, data});
    } else if (data.status === 200) {
      return Promise.resolve(data, res);
    } else {
      return Promise.reject({ msg: res.data.msg, res, data });
      // return Promise.reject(data);
    }
  });
}

/**
 * http 请求基础类
 * 参考文档 https://www.kancloud.cn/yunye/axios/234845
 *
 */
const request = ["post", "put", "patch"].reduce((request, method) => {
  /**
   *
   * @param url string 接口地址
   * @param data object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, data = {}, options = {}) => {
    return baseRequest(
      Object.assign({ url, data, method }, options)
    );
  };
  return request;
}, {});

["get", "delete", "head"].forEach(method => {
  /**
   *
   * @param url string 接口地址
   * @param params object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, params = {}, options = {}) => {
    return baseRequest(
      Object.assign({ url, params, method }, options)
    );
  };
});

export default request;
