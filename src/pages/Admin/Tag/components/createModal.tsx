import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React, {useEffect, useState} from 'react';
import {addTagUsingPost, getTreeTagsUsingGet} from "@/services/imgManageSystem/tagController";
import {ProFormTreeSelect} from "@ant-design/pro-form/lib";

interface Props {
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
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.TagAddRequest) => {
  const hide = message.loading('正在添加');
  try {
    await addTagUsingPost({
      ...fields,
    });
    hide();
    message.success('创建成功');
    return true;
  } catch (error) {
    hide();
    message.error('创建失败');
    return false;
  }
};

/**
 * 创建数据弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { columns, modalVisible, onCancel, onSubmit } = props;
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
    <Modal title={'新建'} open={modalVisible} destroyOnClose footer={null} onCancel={onCancel}>
      <ProTable<API.TagAddRequest>
        columns={modifiedColumns}
        type="form"
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            onSubmit?.();
          }
        }}
        form={{
          initialValues: {
            parentId: '0' // 默认无父级
          }
        }}
      />
    </Modal>
  );
};

export default CreateModal;
