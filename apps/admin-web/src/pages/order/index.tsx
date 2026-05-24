import PageHeader from '@/components/PageHeader';

import OrderSearch from './components/OrderSearch';
import OrderTable from './components/OrderTable';
import { useOrderList } from './hooks/useOrderList';

export default function OrderPage() {
  const {
    list,
    loading,
    page,
    pageSize,
    total,
    selectedRowKeys,
    setSelectedRowKeys,
    handleSearch,
    handleReset,
    handlePageChange,
    handleShip,
    handleClose,
    handleDelete,
  } = useOrderList();

  return (
    <div style={{ padding: 6 }}>
      <PageHeader title="订单管理" />

      <OrderSearch onSearch={handleSearch} onReset={handleReset} />

      <OrderTable
        list={list}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={setSelectedRowKeys}
        onPageChange={handlePageChange}
        onShip={handleShip}
        onClose={handleClose}
        onDelete={handleDelete}
      />
    </div>
  );
}
