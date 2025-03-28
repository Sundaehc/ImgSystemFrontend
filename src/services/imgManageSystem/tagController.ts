// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addTag POST /api/tag/add */
export async function addTagUsingPost(body: API.TagAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/tag/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteTags POST /api/tag/delete */
export async function deleteTagsUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/tag/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getTagsById GET /api/tag/get */
export async function getTagsByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTagsByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseTags_>('/api/tag/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listTags GET /api/tag/list */
export async function listTagsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listTagsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListTags_>('/api/tag/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listTagsByPage GET /api/tag/list/page */
export async function listTagsByPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listTagsByPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageTags_>('/api/tag/list/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getTreeTags GET /api/tag/tree */
export async function getTreeTagsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseObject_>('/api/tag/tree', {
    method: 'GET',
    ...(options || {}),
  });
}

/** updateTags POST /api/tag/update */
export async function updateTagsUsingPost(
  body: API.TagUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/tag/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
