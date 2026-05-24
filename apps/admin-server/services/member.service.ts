import {
  MemberListParams,
  MemberModel,
  MemberStatus,
  UpdateMemberPayload,
} from '../models/member.model';

class MemberService {
  async getMemberList(params: MemberListParams) {
    return MemberModel.findList(params);
  }

  async getMemberDetail(id: number) {
    const detail = await MemberModel.findById(id);

    if (!detail) {
      throw Object.assign(new Error('会员不存在'), { status: 404 });
    }

    return detail;
  }

  async updateMember(id: number, payload: UpdateMemberPayload) {
    return MemberModel.update(id, payload);
  }

  async updateMemberStatus(id: number, status: MemberStatus) {
    return MemberModel.updateStatus(id, status);
  }
}

export default new MemberService();
