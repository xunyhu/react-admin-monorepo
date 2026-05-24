import { useState } from 'react';

import PageHeader from '@/components/PageHeader';

import MemberFormModal from './components/MemberFormModal';
import MemberSearch from './components/MemberSearch';
import MemberTable from './components/MemberTable';
import { useMemberList } from './hooks/useMemberList';
import type { MemberItem } from './types';

export default function MemberPage() {
  const {
    list,
    loading,
    page,
    pageSize,
    total,
    handleSearch,
    handleReset,
    handlePageChange,
    handleUpdate,
    handleDisable,
    handleEnable,
  } = useMemberList();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MemberItem | null>(null);

  const openEditModal = (record: MemberItem) => {
    setEditing(record);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <div style={{ padding: 6 }}>
      <PageHeader title="会员管理" />

      <MemberSearch onSearch={handleSearch} onReset={handleReset} />

      <MemberTable
        list={list}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onEdit={openEditModal}
        onDisable={handleDisable}
        onEnable={handleEnable}
      />

      <MemberFormModal
        open={open}
        editing={editing}
        onCancel={closeModal}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
