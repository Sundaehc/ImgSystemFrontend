import { uploadImagesUsingPost } from '@/services/imgManageSystem/minIoController';
import { getTreeTagsUsingGet } from '@/services/imgManageSystem/tagController';
import {InboxOutlined, PlusOutlined} from '@ant-design/icons';
import { PageContainer, ProFormText } from '@ant-design/pro-components';
import { ProForm, ProFormSelect } from '@ant-design/pro-form/lib';
import { Form, message, UploadFile, UploadProps } from 'antd';
import Upload, { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import React, { useEffect, useState } from 'react';

type FormValues = {
  file?: any[];
  productId?: string;
  tagId?: number;
};

const ImageUpload: React.FC = ({}) => {
  const [form] = Form.useForm<FormValues>();
  const [treeData, setTreeData] = useState<API.Tags[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState<string>();

  // 下拉框更改
  const onChange = (newValue: string) => {
    // console.log(newValue);
    setValue(newValue);
  };

  // 处理图片上传前验证
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    return isImage;
  };

  // 处理图片变化
  const handleImageChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
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
      setTreeData(convertTreeData(response.data));
    } catch (error) {
      console.error('标签加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const fileData: any[] = [];
      const validFiles = values.file
        .map((file) => file.originFileObj) // 提取原始文件
        .filter((file): file is File => !!file); // 类型守卫过滤无效项

      if (validFiles.length === 0) {
        message.error('请上传有效图片文件');
        return;
      }
      validFiles.forEach((file, index) => {
        fileData.push(`file_${index}`, file); // 单独字段名
      });

      // 调用OpenAPI生成的接口
      const success = await uploadImagesUsingPost({
        file: fileData,
        productId: values.productId,
        tagId:values.tagId,
      },);
      if (success) {
        message.success('上传成功');
        form.resetFields();
        setFileList([]);
      }
    } catch (error) {
      message.error('上传失败，请重试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreeData();
  }, []);

  return (
    <PageContainer>
      <ProForm<FormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        submitter={{
          submitButtonProps: {
            loading,
          },
          resetButtonProps: {
            disabled: loading,
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
        <Form.Item
          name="file"
          label="商品图片"
          rules={[{ required: true, message: '请上传商品图片' }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Dragger name="file"
                   listType="picture-card"
                   fileList={fileList}
                   beforeUpload={beforeUpload}
                   onChange={handleImageChange}
                   multiple={true}
                   accept="image/*">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
            </p>
            {/*<Upload*/}
            {/*  name="file"*/}
            {/*  listType="picture-card"*/}
            {/*  fileList={fileList}*/}
            {/*  beforeUpload={beforeUpload}*/}
            {/*  onChange={handleImageChange}*/}
            {/*  multiple={true}*/}
            {/*  accept="image/*"*/}
            {/*>*/}
            {/*  <div>*/}
            {/*    <PlusOutlined />*/}
            {/*    <div style={{ marginTop: 8 }}>上传图片</div>*/}
            {/*  </div>*/}
            {/*</Upload>*/}
          </Dragger>
        </Form.Item>
      </ProForm>
    </PageContainer>
  );
};

export default () => <ImageUpload />;
