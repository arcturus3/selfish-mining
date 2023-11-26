import { BlurFilter } from 'pixi.js';
import { Stage, Container, Sprite, useTick, Graphics } from '@pixi/react';
import { useCallback, useMemo, useReducer, useRef } from 'react';

type Hash = number;

type Block = {
  parent: Hash,
  minerType: 'honest' | 'adversary'
};

type Blocktree = Record<Hash, Block>;

const getLevels = (blocktree: Blocktree) => {
  const children: Record<Hash, Hash[]> = {}
  let genesisHash: Hash = -1
  for (const [hash, block] of Object.entries(blocktree)) {
    children[parseInt(hash)] = []
    // genesis block has a parent hash of 0
    if (block.parent === 0) genesisHash = parseInt(hash)
  }
  for (const [hash, block] of Object.entries(blocktree)) {
    if (parseInt(hash) !== genesisHash) {
      children[block.parent].push(parseInt(hash))
    }
  }
  const result: Blocktree[] = [{[genesisHash]: blocktree[genesisHash]}]
  let done = false
  while (!done) {
    const prevLevel = result[result.length - 1]
    const currLevel: Blocktree = {}
    for (const hash of Object.keys(prevLevel)) {
      for (const child of children[parseInt(hash)]) {
        currLevel[child] = blocktree[child]
      }
    }
    if (Object.keys(currLevel).length > 0) {
      result.push(currLevel)
    } else {
      done = true
    }
  }
  return result
}

const getLayout = (blocktree: Blocktree) => {
  const blockSize = 100
  const blockGap = 100
  const nodeGap = blockGap + blockSize
  const levels = getLevels(blocktree)
  const positions: Record<Hash, [number, number]> = {}
  for (let i = 0; i < levels.length; i++) {
    const hashes = Object.keys(levels[i])
    for (let j = 0; j < hashes.length; j++) {
      const x = (j - (hashes.length - 1) / 2) * nodeGap
      const y = i * nodeGap
      positions[parseInt(hashes[j])] = [x, y]
    }
  }
  return positions
}

type BlocktreeProps = {
  data: Blocktree
}

export const Blocktree = (props: BlocktreeProps) => {
  const blockSize = 100
  const positions = useMemo(() => getLayout(props.data), [props.data])

  return (
    <svg viewBox='0 0 1000 1000'>
      {Object.keys(props.data).map(hash => (
        <rect
          key={hash}
          x={positions[parseInt(hash)][0] - blockSize / 2}
          y={positions[parseInt(hash)][1] - blockSize / 2}
          width={blockSize}
          height={blockSize}
        />
      ))}
    </svg>
  );
};
