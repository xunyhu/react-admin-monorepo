-- 会员主表
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  avatar VARCHAR(500) DEFAULT NULL COMMENT '用户头像',
  nickname VARCHAR(100) NOT NULL COMMENT '用户昵称',
  phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
  level VARCHAR(20) NOT NULL DEFAULT 'normal' COMMENT '会员等级',
  points INT NOT NULL DEFAULT 0 COMMENT '积分',
  order_count INT NOT NULL DEFAULT 0 COMMENT '订单数量',
  total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '消费总额',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员表';

-- 会员收货地址
CREATE TABLE IF NOT EXISTS member_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL COMMENT '会员ID',
  receiver VARCHAR(100) NOT NULL COMMENT '收货人',
  phone VARCHAR(20) NOT NULL COMMENT '手机号',
  address VARCHAR(500) NOT NULL COMMENT '地址',
  is_default TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认地址',
  INDEX idx_member_id (member_id),
  CONSTRAINT fk_member_addresses_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员收货地址';

-- 会员积分记录
CREATE TABLE IF NOT EXISTS member_point_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL COMMENT '会员ID',
  change_amount INT NOT NULL COMMENT '积分变动',
  source VARCHAR(200) NOT NULL COMMENT '来源',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  INDEX idx_member_id (member_id),
  CONSTRAINT fk_member_point_logs_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员积分记录';

-- 示例会员（与订单数据对应）
INSERT INTO members (avatar, nickname, phone, level, points, order_count, total_spent, status, created_at) VALUES
('https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', '张三', '13800138001', 'gold', 3580, 12, 8650.00, 'active', '2025-08-15 09:20:00'),
('https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', '李四', '13900139002', 'silver', 1260, 6, 3280.50, 'active', '2025-11-02 14:30:00'),
('https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu', '王五', '13700137003', 'diamond', 8920, 28, 25680.00, 'active', '2024-06-20 11:00:00'),
('https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu', '赵六', '13600136004', 'normal', 120, 2, 256.00, 'active', '2026-03-08 08:15:00'),
('https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi', '孙七', '13500135005', 'silver', 680, 4, 1580.00, 'disabled', '2025-12-20 16:40:00'),
('https://api.dicebear.com/7.x/avataaars/svg?seed=zhouba', '周八', '13400134006', 'gold', 2100, 8, 5680.00, 'active', '2025-09-10 20:00:00');

INSERT INTO member_addresses (member_id, receiver, phone, address, is_default) VALUES
(1, '张三', '13800138001', '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 1208', 1),
(1, '张三', '13800138001', '北京市海淀区中关村大街 1 号 海龙大厦 15 层', 0),
(2, '李四', '13900139002', '上海市浦东新区陆家嘴环路 1000 号 恒生银行大厦 25 层', 1),
(3, '王五', '13700137003', '广州市天河区珠江新城花城大道 85 号 高德置地春广场', 1),
(4, '赵六', '13600136004', '深圳市南山区科技园南区深南大道 9988 号', 1),
(5, '孙七', '13500135005', '杭州市西湖区文三路 478 号华星时代广场', 1),
(6, '周八', '13400134006', '成都市武侯区天府大道北段 1700 号环球中心', 1);

INSERT INTO member_point_logs (member_id, change_amount, source, created_at) VALUES
(1, 357, '订单消费赠送', '2026-05-20 10:32:15'),
(1, -200, '积分兑换优惠券', '2026-05-18 14:00:00'),
(1, 1280, '订单消费赠送', '2026-04-12 16:46:00'),
(2, 178, '订单消费赠送', '2026-05-18 14:21:30'),
(2, 500, '新用户注册奖励', '2025-11-02 14:30:00'),
(3, 199, '订单消费赠送', '2026-05-10 16:46:20'),
(3, 1000, '会员等级升级奖励', '2026-01-01 00:00:00'),
(4, 100, '新用户注册奖励', '2026-03-08 08:15:00'),
(4, 20, '每日签到', '2026-05-24 08:00:00'),
(5, 158, '订单消费赠送', '2026-05-15 11:31:00'),
(5, -158, '退款扣回积分', '2026-05-16 08:20:00'),
(6, 588, '订单消费赠送', '2026-05-12 20:16:00'),
(6, 300, '活动奖励', '2026-04-01 10:00:00');

-- 会员管理菜单（请根据实际 parent_id / sort 调整）
INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort)
VALUES ('会员管理', 'member', '/member', 'member/index', 0, 1, 'member:list', 50);

SET @member_menu_id = LAST_INSERT_ID();

INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort) VALUES
('会员列表', 'member:list', '/member', 'member/index', @member_menu_id, 2, 'member:list', 1),
('查看详情', 'member:detail', NULL, NULL, @member_menu_id, 2, 'member:detail', 2),
('编辑会员', 'member:update', NULL, NULL, @member_menu_id, 2, 'member:update', 3),
('禁用会员', 'member:disable', NULL, NULL, @member_menu_id, 2, 'member:disable', 4);

-- 赋权给超级管理员（role_id = 1）
INSERT INTO role_menu (role_id, menu_id)
SELECT 1, id FROM menus WHERE code IN ('member', 'member:list', 'member:detail', 'member:update', 'member:disable');
