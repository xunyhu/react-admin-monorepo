import { Tag } from 'antd';

import {
  MEMBER_LEVEL_MAP,
  MEMBER_STATUS_MAP,
  type MemberLevel,
  type MemberStatus,
} from '../types';

interface MemberLevelTagProps {
  value: MemberLevel;
}

interface MemberStatusTagProps {
  value: MemberStatus;
}

const LEVEL_COLOR: Record<MemberLevel, string> = {
  normal: 'default',
  silver: 'blue',
  gold: 'gold',
  diamond: 'purple',
};

export function MemberLevelTag({ value }: MemberLevelTagProps) {
  return <Tag color={LEVEL_COLOR[value]}>{MEMBER_LEVEL_MAP[value]}</Tag>;
}

export function MemberStatusTag({ value }: MemberStatusTagProps) {
  return (
    <Tag color={value === 'active' ? 'success' : 'error'}>
      {MEMBER_STATUS_MAP[value]}
    </Tag>
  );
}
