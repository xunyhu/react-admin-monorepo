import { useMemo, useState } from 'react';
import type { PageBlock } from '../components/types';
import type { BlockType } from '../components/registry';

function cloneProps<T>(obj: T): T {
  if (typeof structuredClone !== 'undefined') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function usePageSchema(args: {
  initialBlocks?: PageBlock[];
  getDefaultProps: (type: BlockType) => any;
}) {
  const [blocks, setBlocks] = useState<PageBlock[]>(args.initialBlocks ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => blocks.find((b) => b.id === selectedId) || null,
    [blocks, selectedId]
  );

  const setAllBlocks = (next: PageBlock[]) => {
    setBlocks(next);
    setSelectedId(null);
  };

  const updateBlockProps = (id: string, patch: Record<string, any>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, props: { ...b.props, ...patch } } : b))
    );
  };

  const createBlock = (type: BlockType): PageBlock => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : String(Date.now());
    return { id, type, props: cloneProps(args.getDefaultProps(type)) };
  };

  const insertBlockAt = (type: BlockType, index: number) => {
    const next = createBlock(type);
    setBlocks((prev) => {
      const safeIndex = Math.max(0, Math.min(index, prev.length));
      const copy = prev.slice();
      copy.splice(safeIndex, 0, next);
      return copy;
    });
    setSelectedId(next.id);
  };

  const addBlock = (type: BlockType) => insertBlockAt(type, blocks.length);

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setBlocks((prev) => {
      if (fromIndex < 0 || fromIndex >= prev.length) return prev;
      const safeTo = Math.max(0, Math.min(toIndex, prev.length - 1));
      const copy = prev.slice();
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(safeTo, 0, item);
      return copy;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  };

  return {
    blocks,
    setBlocks: setAllBlocks,
    selectedId,
    setSelectedId,
    selected,
    updateBlockProps,
    addBlock,
    insertBlockAt,
    moveBlock,
    removeBlock,
  };
}

