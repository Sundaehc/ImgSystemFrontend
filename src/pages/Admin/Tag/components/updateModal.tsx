import {getTreeTagsUsingGet, updateTagsUsingPost} from '@/services/imgManageSystem/tagController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React, {useEffect, useState} from 'react';
import {ProFormTreeSelect} from "@ant-design/pro-form/lib";

interface Props {
  oldData?: API.Tags;
  modalVisible: boolean;
  columns: ProColumns<API.Tags>[];
  onSubmit: () => void;
  onCancel: () => void;
}

// 树形数据结构类型
interface TreeDataItem {
  title: string;
  value: string;
  key: string;
  children?: TreeDataItem[];
}
/**
 *  更新节点
 * @param fields
 */
const handleUpdate = async (fields: API.TagUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    await updateTagsUsingPost({
      ...fields,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('更新失败，' + error.message);
    return false;
  }
};

/**
 * 创建数据弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { oldData, columns, modalVisible, onCancel, onSubmit } = props;
  if (!oldData) {
    return <></>;
  }
  const [treeData, setTreeData] = useState<TreeDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载标签树数据
  const loadTreeData = async () => {
    setLoading(true);
    try {
      const response = await getTreeTagsUsingGet();
      const convertTreeData = (items: API.Tags[]): TreeDataItem[] => {
        return items.map((item) => ({
          title: item.tagName,
          value: item.id,
          key: item.id,
          children: item.children ? convertTreeData(item.children) : undefined
        }));
      };
      setTreeData(convertTreeData(response.data || []));
    } catch (error) {
      message.error('标签加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      loadTreeData();
    }
  }, [modalVisible]);

  // 修改后的 columns
  const modifiedColumns = columns.map((column) => {
    if (column.dataIndex === 'parentId') {
      return {
        ...column,
        renderFormItem: () => (
          <ProFormTreeSelect
            name="parentId"
            placeholder="请选择父级标签"
            allowClear
            fieldProps={{
              treeData,
              loading,
              treeDefaultExpandAll: true,
              fieldNames: {
                label: 'title',
                value: 'value',
                children: 'children',
              },
              showSearch: true,
              treeNodeFilterProp: 'title',
              dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
              },
            }}
          />
        )
      } as ProColumns<API.Tags>;
    }
    return column;
  });


  return (
    <Modal title={'修改'} open={modalVisible} destroyOnClose footer={null} onCancel={onCancel}>
      <ProTable<API.TagUpdateRequest>
        columns={modifiedColumns}
        form={{
          initialValues: oldData,
        }}
        type="form"
        onSubmit={async (values) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id,
          });
          if (success) {
            onSubmit?.();
          }
        }}
      />
    </Modal>
  );
};

export default UpdateModal;
