-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL COMMENT '商品名称',
  category VARCHAR(50) NOT NULL COMMENT '分类',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '价格',
  stock INT NOT NULL DEFAULT 0 COMMENT '库存',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1上架 0下架',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 示例数据
INSERT INTO products (name, category, price, stock, status) VALUES
('无线蓝牙耳机', '数码', 299.00, 120, 1),
('纯棉 T 恤', '服装', 89.00, 500, 1),
('有机坚果礼盒', '食品', 158.00, 80, 0),
('北欧风台灯', '家居', 199.00, 45, 1),
('前端架构实战', '图书', 68.00, 200, 1);

-- 商品管理菜单（请根据实际 parent_id / sort 调整）
INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort)
VALUES ('商品管理', 'product', '/product', 'product/index', 0, 1, 'product:list', 30);

SET @product_menu_id = LAST_INSERT_ID();

INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort) VALUES
('商品列表', 'product:list', '/product', 'product/index', @product_menu_id, 2, 'product:list', 1),
('新增商品', 'product:add', NULL, NULL, @product_menu_id, 2, 'product:add', 2),
('编辑商品', 'product:edit', NULL, NULL, @product_menu_id, 2, 'product:edit', 3),
('更新商品', 'product:update', NULL, NULL, @product_menu_id, 2, 'product:update', 4),
('删除商品', 'product:delete', NULL, NULL, @product_menu_id, 2, 'product:delete', 5);

-- 赋权给超级管理员（role_id = 1）
INSERT INTO role_menu (role_id, menu_id)
SELECT 1, id FROM menus WHERE code IN ('product', 'product:list', 'product:add', 'product:edit', 'product:update', 'product:delete');
