import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import {notification} from "antd";

// 扩展请求配置类型
declare module 'umi' {
  interface RequestOptions {
    isDownload?: boolean;
  }
}
// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// @ts-ignore
// @ts-ignore
/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: 'http://localhost:8101',
  withCredentials: true,
  // 请求拦截器
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 标记下载请求
      if (config.url?.includes('/batch/download')) {
        return {
          ...config,
          isDownload: true,  // 自定义标识
          responseType: 'blob' // 强制指定响应类型
        };
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    async (response) => {
      const config = response.config as RequestOptions;
      const requestPath = config.url ?? '';

      if (config.isDownload) {
        const rawResponse = response.request;
        // 成功响应（HTTP 200）
        console.log(rawResponse);
        if (rawResponse.status === 200) {
          return {
            ...response,
            data: await response.request.blob// 转换为Blob对象
          };
        }
        // 错误处理（直接读取响应体）
        try {
          // 尝试读取错误内容
          const errorText = await rawResponse.text();

          // 尝试解析JSON错误
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.message || '下载失败');
          } catch {
            throw new Error(`服务器错误: ${errorText.substring(0, 100)}`);
          }
        } catch (error) {
          throw new Error('文件服务不可用: ' + error.message);
        }
      }
      // ==================== 处理普通JSON响应 ====================
      const { data } = response as unknown as ResponseStructure;

      // 空响应处理
      if (!data) {
        notification.error({
          description: '服务异常',
          message: '无有效响应数据'
        });
        throw new Error('服务异常');
      }

      // 未登录处理（保持原有逻辑）
      if (
        data.code === 40100 &&
        !requestPath.includes('user/get/login') &&
        !location.pathname.includes('/user/login')
      ) {
        window.location.href = `/user/login?redirect=${window.location.href}`;
        throw new Error('请先登录');
      }

      // 业务错误处理
      if (data.code !== 0) {
        const errorInfo = {
          message: data.errorMessage || '操作失败',
          code: data.code,
          showType: data.showType || ErrorShowType.ERROR_MESSAGE
        };

        // // @ts-ignore
        // notification[errorInfo.showType]({
        //   message: '操作失败',
        //   description: errorInfo.message,
        // });

        throw new Error(errorInfo.message);
      }

      return response;
    }
  ],

  // 全局错误处理（保持原逻辑）
  errorConfig: {
    adaptor: (resData, ctx) => {
      // 处理下载类型错误
      if (resData instanceof Blob) {
        return {
          success: false,
          errorMessage: '文件服务异常',
          showType: ErrorShowType.ERROR_MESSAGE
        };
      }

      // 处理普通错误
      return {
        success: ctx.res?.status === 200,
        errorMessage: ctx.res?.statusText || '请求失败',
        showType: ErrorShowType.ERROR_MESSAGE
      };
    }
  }
};
