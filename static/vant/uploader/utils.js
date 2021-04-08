const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
const VIDEO_REGEXP = /\.(mp4|mov|m4v|3gp|avi|m3u8|webm)/i;
const MEDIA_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|mp4|mov|m4v|3gp|avi|m3u8|webm)/i;

function isImageUrl(url) {
  return IMAGE_REGEXP.test(url);
}
function isVideoUrl(url) {
  return VIDEO_REGEXP.test(url);
}
function isMediaUrl(url) {
  return MEDIA_REGEXP.test(url);
}
export function isImageFile(item) {
  if (item.type) {
    return item.type.indexOf('image') === 0;
  }
  if (item.path) {
    return isImageUrl(item.path);
  }
  if (item.thumbTempFilePath) {
    return isImageUrl(item.thumbTempFilePath);
  }
  if (item.tempFilePath) {
    return isImageUrl(item.tempFilePath);
  }
  if (item.name) {
    return isImageUrl(item.name);
  }
  if (item.url) {
    return isImageUrl(item.url);
  }
  return false;
}
export function isVideoFile(item) {
  if (item.tempFilePath) {
    return isVideoUrl(item.tempFilePath);
  }
  if (item.object_name) {
    return isVideoUrl(item.object_name);
  }
  return false;
}
export function isMediaFile(item) {
  if (item.tempFilePath) {
    return isMediaUrl(item.tempFilePath);
  }
  if (item.object_name) {
    return isMediaUrl(item.object_name);
  }
  return false;
}
export function isVideo(res, accept) {
  return accept === 'video';
}
export function chooseFile({
  accept,
  multiple,
  capture,
  compressed,
  maxDuration,
  sizeType,
  camera,
  maxCount
}) {
  switch (accept) {
    case 'image':
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count: multiple ? Math.min(maxCount, 9) : 1,
          sourceType: capture,
          sizeType,
          success: resolve,
          fail: reject
        });
      });
    case 'media':
      return new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: multiple ? Math.min(maxCount, 9) : 1,
          sourceType: capture,
          maxDuration,
          sizeType,
          camera,
          success: resolve,
          fail: reject
        });
      });
    case 'video':
      return new Promise((resolve, reject) => {
        wx.chooseVideo({
          sourceType: capture,
          compressed,
          maxDuration,
          camera,
          success: resolve,
          fail: reject
        });
      });
    default:
      return new Promise((resolve, reject) => {
        wx.chooseMessageFile({
          count: multiple ? maxCount : 1,
          type: 'file',
          success: resolve,
          fail: reject
        });
      });
  }
}
export function isFunction(val) {
  return typeof val === 'function';
}
export function isObject(val) {
  return val !== null && typeof val === 'object';
}
export function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
