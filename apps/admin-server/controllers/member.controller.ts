import { Request, Response } from 'express';
import memberService from '../services/member.service';
import type { MemberLevel, MemberStatus } from '../models/member.model';

export async function getMemberList(req: Request, res: Response) {
  const {
    page = 1,
    pageSize = 10,
    nickname,
    phone,
    level,
    startTime,
    endTime,
  } = req.query;

  const data = await memberService.getMemberList({
    page: Number(page),
    pageSize: Number(pageSize),
    nickname: nickname ? String(nickname) : undefined,
    phone: phone ? String(phone) : undefined,
    level: level ? (String(level) as MemberLevel) : undefined,
    startTime: startTime ? String(startTime) : undefined,
    endTime: endTime ? String(endTime) : undefined,
  });

  res.json({
    code: 200,
    message: 'success',
    data,
  });
}

export async function getMemberDetail(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await memberService.getMemberDetail(id);

  res.json({
    code: 200,
    message: 'success',
    data,
  });
}

export async function updateMember(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nickname, phone, level } = req.body;

  await memberService.updateMember(id, {
    nickname: String(nickname),
    phone: String(phone),
    level: level as MemberLevel,
  });

  res.json({
    code: 200,
    message: '更新成功',
  });
}

export async function updateMemberStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { status } = req.body;

  await memberService.updateMemberStatus(id, status as MemberStatus);

  res.json({
    code: 200,
    message: status === 'disabled' ? '会员已禁用' : '会员已启用',
  });
}
