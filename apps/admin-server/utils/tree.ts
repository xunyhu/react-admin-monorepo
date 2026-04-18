type Menu = {
  id: number;
  name: string;
  path: string;
  code: string;
  parent_id: number | null;
  children?: Menu[];
};

export const buildTree = (list: Menu[]) => {
  const map = new Map<number, Menu>();
  const tree: Menu[] = [];

  // 1. 建map
  list.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // 2. 组装树
  list.forEach((item) => {
    const node = map.get(item.id)!;

    if (item.parent_id) {
      const parent = map.get(item.parent_id);
      parent?.children?.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};
