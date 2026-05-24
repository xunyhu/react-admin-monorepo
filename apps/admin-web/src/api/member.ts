import request from '@/utils/request';
import type {
  MemberDetail,
  MemberFormValues,
  MemberListParams,
  MemberListResult,
  UpdateMemberStatusPayload,
} from '@/pages/member/types';

export const getMemberList = (params: MemberListParams) =>
  request.get<MemberListResult>('/members', { params });

export const getMemberDetail = (id: number) =>
  request.get<MemberDetail>(`/members/${id}`);

export const updateMember = (id: number, data: MemberFormValues) =>
  request.put(`/members/${id}`, data);

export const updateMemberStatus = (id: number, data: UpdateMemberStatusPayload) =>
  request.post(`/members/${id}/status`, data);

export type {
  MemberDetail,
  MemberFormValues,
  MemberListParams,
  MemberListResult,
  UpdateMemberStatusPayload,
};
