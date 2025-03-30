// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** batchDownload POST /api/images/batch/download */
export async function batchDownloadUsingPost(
  body: API.DownLoadRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/api/images/batch/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** uploadImages POST /api/images/batch/upload */
export async function uploadImagesUsingPost(
  body: {
    file?: any[];
    productId?: string;
    tagId?: number;
  },
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.BaseResponseListImages_>('/api/images/batch/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** downloadImage GET /api/images/download */
export async function downloadImageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.downloadImageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/images/download', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** uploadImage POST /api/images/upload */
export async function uploadImageUsingPost(
  body: {
    productId?: string;
    tagId?: number;
  },
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.BaseResponseImages_>('/api/images/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
