import axios from 'axios';
import * as Cheerio from 'cheerio';
import { HttpProxy } from '/models/http_proxy';

const getRaw = async (url, options = {}) => {
  // Can save having to count here by just handling the null .first() case
  if (await proxiesDefined()) {
    options['proxy'] = await proxyConfig();
  }

  return await axios.get(url, options);
};

const get = async (url, options = {}) => {
  const page = await getRaw(url, options);

  return Cheerio.load(page.data);
};

export default { get, getRaw };

const proxiesDefined = async () => {
  const count = await HttpProxy.query().count();
  return count[0].count > 0;
};

const proxyConfig = async () => {
  const proxy = await HttpProxy.query().first();
  return {
    host: proxy.ip,
    port: proxy.port,
    auth: {
      username: proxy.username,
      password: proxy.password,
    },
  };
};
