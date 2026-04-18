# SQL 语句

① 查用户所有菜单

```sql
SELECT m.*
FROM menus m
JOIN role_menu rm ON rm.menu_id = m.id
JOIN user_role ur ON ur.role_id = rm.role_id
WHERE ur.user_id = 1;
```

② 查用户权限点（permission）

```sql
SELECT DISTINCT m.permission
FROM menus m
JOIN role_menu rm ON rm.menu_id = m.id
JOIN user_role ur ON ur.role_id = rm.role_id
WHERE ur.user_id = 1
AND m.permission IS NOT NULL;
```
