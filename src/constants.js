export const URL_OR_HOST_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
export const HTTPS_REGEX = /^https:\/\//i;
export const HTTP_REGEX = /^http:\/\//i;
export const PROTOCOL = "https://";
export const getHostName = (url) => {
  return url
    .replace(/(^\w+:|^)\/\//, "")
    .split("/")[0]
    .split("www.")[1];
};
