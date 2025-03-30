import { getTreeTagsUsingGet } from '@/services/imgManageSystem/tagController';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer, ProFormText } from '@ant-design/pro-components';
import { ProForm, ProFormSelect } from '@ant-design/pro-form/lib';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {batchDownloadUsingPost} from "@/services/imgManageSystem/minIoController";

type DownLoadParams = {
  productId?: string;
  tagId?: number;
};

const ImageDownload: React.FC = ({}) => {
  const [form] = Form.useForm<DownLoadParams>();
  const [treeData, setTreeData] = useState<API.Tags[]>([]);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState<string>();

  // 标签下拉框更改
  const onChange = (newValue: string) => {
    // console.log(newValue);
    setValue(newValue);
  };

  const convertTreeData = (items: API.Tags[]): any[] => {
    return items.map((item) => ({
      label: item.tagName,
      value: item.id,
      key: item.id,
      children: item.children ? convertTreeData(item.children) : [],
    }));
  };

  // 加载标签树数据
  const loadTreeData = async () => {
    setLoading(true);
    try {
      const response = await getTreeTagsUsingGet();
      // console.log(response);
      // @ts-ignore
      setTreeData(convertTreeData(response.data));
    } catch (error) {
      console.error('标签加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: DownLoadParams) => {
    try {
      setLoading(true);
      // 使用自定义请求配置
      // 调用OpenAPI生成的接口
      const response = await batchDownloadUsingPost(
        {
          productId: values.productId,
          tagId: values.tagId,
        },
        {
          // 关键配置项
          responseType: 'blob', // 处理二进制流
          headers: {
            'Content-Type': 'application/json',
          },
          // @ts-ignore
          isDownload: true, // 与拦截器标识匹配
          getResponse: true // 获取完整响应对象
        },
      );
      console.log(response);
      // 处理Blob数据
      if (response.request.response instanceof Blob) {
        const url = window.URL.createObjectURL(response.request.response);
        const link = document.createElement('a');
        link.href = url;
        link.download = `images_${values.productId}_${values.tagId}.zip`;
        link.click();
        URL.revokeObjectURL(url);
        form.resetFields();
      }
    } catch (error) {
      // @ts-ignore
      message.error(error.message);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreeData();
  }, []);

  return (
    <PageContainer>
      <ProForm<DownLoadParams>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        submitter={{
          render: (_, dom) => [
            ...dom,
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              loading={loading}
              htmlType="submit"
              style={{ marginLeft: 8 }}
            >
              下载图片
            </Button>,
          ],
          submitButtonProps: {
            style: { display: 'none' }, // 隐藏默认查询按钮
          },
        }}
      >
        {/* 标签选择 */}
        <ProFormSelect
          name="tagId"
          label="商品标签"
          placeholder="请选择商品标签"
          options={treeData}
          onChange={onChange}
          rules={[{ required: true, message: '请选择商品标签' }]}
        />
        <ProFormText
          name="productId"
          label="商品货号"
          placeholder="请输入商品货号"
          rules={[{ required: true, message: '请输入商品货号' }]}
        />
      </ProForm>
      {/* 状态提示 */}
      <div style={{ marginTop: 24 }}>
        {loading && <div style={{ color: '#1890ff' }}>文件打包中，请稍候...</div>}
      </div>
    </PageContainer>
  );
};

export default () => <ImageDownload />;
