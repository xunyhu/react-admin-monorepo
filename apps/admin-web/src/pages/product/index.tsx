import { useMemo, useState } from 'react';
import { Button, Table, message } from 'antd';

import BtnPermission from '@/components/BtnPermission';
import PageHeader from '@/components/PageHeader';

import SearchForm from './components/SearchForm';
import ProductFormModal from './components/ProductFormModal';
import { getProductColumns } from './components/columns';
import { useProductList } from './hooks/useProductList';
import type { Product } from './types';

export default function ProductPage() {
  const {
    list,
    loading,
    page,
    pageSize,
    total,
    handleSearch,
    handleReset,
    handlePageChange,
    handleDelete,
    refresh,
  } = useProductList();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const openCreateModal = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEditModal = (record: Product) => {
    setEditing(record);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleFormSuccess = () => {
    message.success(editing ? '更新成功' : '创建成功');
    refresh();
  };

  const columns = useMemo(
    () =>
      getProductColumns({
        onEdit: openEditModal,
        onDelete: handleDelete,
      }),
    [handleDelete]
  );

  return (
    <div style={{ padding: 6 }}>
      <PageHeader
        title="商品管理"
        extra={
          <BtnPermission code="product:add">
            <Button type="primary" onClick={openCreateModal}>
              新增商品
            </Button>
          </BtnPermission>
        }
      />

      <SearchForm onSearch={handleSearch} onReset={handleReset} />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
        scroll={{ x: 900 }}
        locale={{ emptyText: '暂无商品数据' }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (count) => `共 ${count} 条`,
          onChange: handlePageChange,
        }}
      />

      <ProductFormModal
        open={open}
        editing={editing}
        onCancel={closeModal}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
