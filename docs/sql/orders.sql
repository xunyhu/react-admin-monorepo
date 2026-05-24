-- 订单主表
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  user_avatar VARCHAR(500) DEFAULT NULL COMMENT '用户头像',
  user_nickname VARCHAR(100) NOT NULL COMMENT '用户昵称',
  user_phone VARCHAR(20) NOT NULL COMMENT '用户手机号',
  receiver VARCHAR(100) NOT NULL COMMENT '收货人',
  receiver_phone VARCHAR(20) NOT NULL COMMENT '收货电话',
  address VARCHAR(500) NOT NULL COMMENT '收货地址',
  product_total DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '商品总额',
  freight DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '运费',
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '优惠金额',
  paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '实付金额',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '订单金额',
  product_count INT NOT NULL DEFAULT 0 COMMENT '商品数量',
  pay_status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '支付状态',
  shipping_status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '发货状态',
  order_status VARCHAR(20) NOT NULL DEFAULT 'pending_pay' COMMENT '订单状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  paid_at TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单商品明细
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '订单ID',
  product_id INT DEFAULT NULL COMMENT '商品ID',
  image VARCHAR(500) DEFAULT NULL COMMENT '商品图片',
  name VARCHAR(200) NOT NULL COMMENT '商品名称',
  sku VARCHAR(100) DEFAULT NULL COMMENT 'SKU信息',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '单价',
  quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
  INDEX idx_order_id (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品明细';

-- 订单日志
CREATE TABLE IF NOT EXISTS order_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '订单ID',
  type VARCHAR(20) NOT NULL COMMENT '日志类型',
  content VARCHAR(500) NOT NULL COMMENT '日志内容',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  INDEX idx_order_id (order_id),
  CONSTRAINT fk_order_logs_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单日志';

-- 示例订单
INSERT INTO orders (
  order_no, user_avatar, user_nickname, user_phone,
  receiver, receiver_phone, address,
  product_total, freight, discount, paid_amount, total_amount, product_count,
  pay_status, shipping_status, order_status, created_at, paid_at
) VALUES
('ORD202605240001', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', '张三', '13800138001', '张三', '13800138001', '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 1208', 357.00, 0, 0, 357.00, 357.00, 3, 'paid', 'pending', 'pending_ship', '2026-05-20 10:30:00', '2026-05-20 10:32:15'),
('ORD202605240002', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', '李四', '13900139002', '李四', '13900139002', '上海市浦东新区陆家嘴环路 1000 号 恒生银行大厦 25 层', 178.00, 10.00, 10.00, 178.00, 178.00, 2, 'paid', 'shipped', 'pending_ship', '2026-05-18 14:20:00', '2026-05-18 14:21:30'),
('ORD202605240003', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu', '王五', '13700137003', '王五', '13700137003', '广州市天河区珠江新城花城大道 85 号 高德置地春广场', 199.00, 0, 0, 199.00, 199.00, 1, 'paid', 'received', 'completed', '2026-05-10 16:45:00', '2026-05-10 16:46:20'),
('ORD202605240004', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu', '赵六', '13600136004', '赵六', '13600136004', '深圳市南山区科技园南区深南大道 9988 号', 68.00, 0, 0, 68.00, 68.00, 1, 'pending', 'pending', 'pending_pay', '2026-05-24 09:00:00', NULL),
('ORD202605240005', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi', '孙七', '13500135005', '孙七', '13500135005', '杭州市西湖区文三路 478 号华星时代广场', 158.00, 0, 0, 158.00, 158.00, 1, 'refunded', 'pending', 'closed', '2026-05-15 11:30:00', '2026-05-15 11:31:00'),
('ORD202605240006', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouba', '周八', '13400134006', '周八', '13400134006', '成都市武侯区天府大道北段 1700 号环球中心', 588.00, 0, 0, 588.00, 588.00, 2, 'paid', 'pending', 'closed', '2026-05-12 20:15:00', '2026-05-12 20:16:00');

INSERT INTO order_items (order_id, product_id, image, name, sku, price, quantity) VALUES
(1, 101, 'https://picsum.photos/seed/headphone/80/80', '无线蓝牙耳机 Pro', '黑色 / 标准版', 299.00, 1),
(1, 102, 'https://picsum.photos/seed/case/80/80', '耳机保护套', '透明 / 通用', 29.00, 2),
(2, 201, 'https://picsum.photos/seed/shirt/80/80', '纯棉休闲 T 恤', '白色 / L', 89.00, 2),
(3, 301, 'https://picsum.photos/seed/lamp/80/80', '北欧风护眼台灯', '暖白色 / 触控版', 199.00, 1),
(4, 401, 'https://picsum.photos/seed/book/80/80', '前端架构实战', '精装版 / 签名版', 68.00, 1),
(5, 501, 'https://picsum.photos/seed/nuts/80/80', '有机坚果礼盒', '混合装 / 500g', 158.00, 1),
(6, 601, 'https://picsum.photos/seed/keyboard/80/80', '机械键盘', '青轴 / RGB 背光', 459.00, 1),
(6, 602, 'https://picsum.photos/seed/mouse/80/80', '无线鼠标', '黑色 / 2.4G', 129.00, 1);

INSERT INTO order_logs (order_id, type, content, created_at) VALUES
(1, 'created', '用户提交订单', '2026-05-20 10:30:00'),
(1, 'paid', '支付成功，微信支付 ¥357.00', '2026-05-20 10:32:15'),
(2, 'created', '用户提交订单', '2026-05-18 14:20:00'),
(2, 'paid', '支付成功，支付宝 ¥178.00', '2026-05-18 14:21:30'),
(2, 'shipped', '商家已发货，顺丰速运 SF1234567890', '2026-05-19 09:15:00'),
(3, 'created', '用户提交订单', '2026-05-10 16:45:00'),
(3, 'paid', '支付成功，微信支付 ¥199.00', '2026-05-10 16:46:20'),
(3, 'shipped', '商家已发货，中通快递 ZTO9876543210', '2026-05-11 10:00:00'),
(3, 'received', '用户已签收', '2026-05-13 18:30:00'),
(4, 'created', '用户提交订单', '2026-05-24 09:00:00'),
(5, 'created', '用户提交订单', '2026-05-15 11:30:00'),
(5, 'paid', '支付成功，微信支付 ¥158.00', '2026-05-15 11:31:00'),
(5, 'created', '用户申请退款，订单已关闭', '2026-05-16 08:20:00'),
(6, 'created', '用户提交订单', '2026-05-12 20:15:00'),
(6, 'paid', '支付成功，支付宝 ¥588.00', '2026-05-12 20:16:00'),
(6, 'created', '商家关闭订单：库存不足', '2026-05-13 09:00:00');

-- 订单管理菜单（请根据实际 parent_id / sort 调整）
INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort)
VALUES ('订单管理', 'order', '/order', 'order/index', 0, 1, 'order:list', 40);

SET @order_menu_id = LAST_INSERT_ID();

INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort) VALUES
('订单列表', 'order:list', '/order', 'order/index', @order_menu_id, 2, 'order:list', 1),
('查看详情', 'order:detail', NULL, NULL, @order_menu_id, 2, 'order:detail', 2),
('发货', 'order:ship', NULL, NULL, @order_menu_id, 2, 'order:ship', 3),
('关闭订单', 'order:close', NULL, NULL, @order_menu_id, 2, 'order:close', 4),
('删除订单', 'order:delete', NULL, NULL, @order_menu_id, 2, 'order:delete', 5);

-- 赋权给超级管理员（role_id = 1）
INSERT INTO role_menu (role_id, menu_id)
SELECT 1, id FROM menus WHERE code IN ('order', 'order:list', 'order:detail', 'order:ship', 'order:close', 'order:delete');
