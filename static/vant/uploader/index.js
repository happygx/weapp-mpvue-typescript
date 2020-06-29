import { VantComponent } from '../common/component';
import {
  isImageFile,
  isVideoFile,
  isMediaFile,
  isVideo,
  chooseFile,
  isPromise,
} from './utils';
import { chooseImageProps, chooseVideoProps } from './shared';
VantComponent({
  props: Object.assign(
    Object.assign(
      {
        disabled: Boolean,
        multiple: Boolean,
        uploadText: String,
        useBeforeRead: Boolean,
        afterRead: null,
        beforeRead: null,
        previewSize: {
          type: null,
          value: 90,
        },
        name: {
          type: [Number, String],
          value: '',
        },
        accept: {
          type: String,
          value: 'image',
        },
        fileList: {
          type: Array,
          value: [],
          observer: 'formatFileList',
        },
        maxSize: {
          type: Number,
          value: Number.MAX_VALUE,
        },
        maxCount: {
          type: Number,
          value: 100,
        },
        deletable: {
          type: Boolean,
          value: true,
        },
        showUpload: {
          type: Boolean,
          value: true,
        },
        previewImage: {
          type: Boolean,
          value: true,
        },
        previewFullImage: {
          type: Boolean,
          value: true,
        },
        imageFit: {
          type: String,
          value: 'scaleToFill',
        },
        uploadIcon: {
          type: String,
          value: 'photograph',
        },
      },
      chooseImageProps
    ),
    chooseVideoProps
  ),
  data: {
    lists: [],
    isInCount: true,
    videoShow: false,
    video: {},
  },
  methods: {
    formatFileList() {
      const { fileList = [], maxCount } = this.data;
      const lists = fileList.map((item) =>
        Object.assign(Object.assign({}, item), {
          isMedia:
            typeof item.isMedia === 'undefined'
              ? isMediaFile(item)
              : item.isMedia,
          isImage:
            typeof item.isImage === 'undefined'
              ? isImageFile(item)
              : item.isImage,
          isVideo:
            typeof item.isVideo === 'undefined'
              ? isVideoFile(item)
              : item.isVideo,
        })
      );
      this.setData({ lists, isInCount: lists.length < maxCount });
    },
    getDetail(index) {
      return {
        name: this.data.name,
        index: index == null ? this.data.fileList.length : index,
      };
    },
    startUpload() {
      const { maxCount, multiple, accept, lists, disabled } = this.data;
      if (disabled) return;
      chooseFile(
        Object.assign(Object.assign({}, this.data), {
          maxCount: maxCount - lists.length,
        })
      )
        .then((res) => {
          let file = null;
          if (isVideo(res, accept)) {
            file = Object.assign({ path: res.tempFilePath }, res);
          } else {
            file = multiple ? res.tempFiles : res.tempFiles[0];
          }
          this.onBeforeRead(file);
        })
        .catch((error) => {
          this.$emit('error', error);
        });
    },
    onBeforeRead(file) {
      const { beforeRead, useBeforeRead } = this.data;
      let res = true;
      if (typeof beforeRead === 'function') {
        res = beforeRead(file, this.getDetail());
      }
      if (useBeforeRead) {
        res = new Promise((resolve, reject) => {
          this.$emit(
            'beforeRead',
            Object.assign(Object.assign({ file }, this.getDetail()), {
              callback: (ok) => {
                ok ? resolve() : reject();
              },
            })
          );
        });
      }
      if (!res) {
        return;
      }
      if (isPromise(res)) {
        res.then((data) => this.onAfterRead(data || file));
      } else {
        this.onAfterRead(file);
      }
    },
    onAfterRead(file) {
      const { maxSize } = this.data;
      const oversize = Array.isArray(file)
        ? file.some((item) => item.size > maxSize)
        : file.size > maxSize;
      if (oversize) {
        this.$emit('oversize', Object.assign({ file }, this.getDetail()));
        return;
      }
      if (typeof this.data.afterRead === 'function') {
        this.data.afterRead(file, this.getDetail());
      }
      this.$emit('afterRead', Object.assign({ file }, this.getDetail()));
    },
    deleteItem(event) {
      const { index } = event.currentTarget.dataset;
      this.$emit(
        'delete',
        Object.assign(Object.assign({}, this.getDetail(index)), {
          file: this.data.fileList[index],
        })
      );
    },
    onPreviewImage(event) {
      if (!this.data.previewFullImage) return;
      const { index } = event.currentTarget.dataset;
      const { lists } = this.data;
      const item = lists[index];
      if (item.isVideo) {
        this.setData({
          videoShow: true,
          video: item,
        });
      } else {
        wx.previewImage({
          urls: lists
            .filter((item) => item.isImage)
            .map(
              (item) =>
                item.url ||
                item.path ||
                item.thumbTempFilePath ||
                item.tempFilePath
            ),
          current:
            item.url ||
            item.path ||
            item.thumbTempFilePath ||
            item.tempFilePath,
          fail(err) {
            // console.log(err);
            wx.showToast({ title: '预览图片失败', icon: 'none' });
          },
        });
      }
    },
    onVideoClose() {
      this.setData({
        videoShow: false,
      });
    },
    onClickPreview(event) {
      const { index } = event.currentTarget.dataset;
      const item = this.data.lists[index];
      this.$emit(
        'click-preview',
        Object.assign(Object.assign({}, item), this.getDetail(index))
      );
    },
  },
});
