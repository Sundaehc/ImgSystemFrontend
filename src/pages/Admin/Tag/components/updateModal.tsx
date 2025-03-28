import { updateTagsUsingPost } from '@/services/imgManageSystem/tagController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

interface Props {
  oldData?: API.Tags;
  modalVisible: boolean;
  columns: ProColumns<API.Tags>[];
  onSubmit: () => void;
  onCancel: () => void;
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
  return (
    <Modal title={'修改'} open={modalVisible} destroyOnClose footer={null} onCancel={onCancel}>
      <ProTable<API.TagUpdateRequest>
        columns={columns}
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
