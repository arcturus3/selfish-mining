import {useMemo} from 'react'
import {animated, useSpring} from '@react-spring/web'

export type Hash = number

export type Block = {
  parent: Hash
  minerType: 'honest' | 'adversary'
}

export type Blocks = Map<Hash, Block>

const getLevels = (blocks: Blocks) => {
  const children = new Map<Hash, Hash[]>()
  let genesisHash: Hash = -1
  for (const [hash, block] of blocks) {
    children.set(hash, [])
    // genesis block has a parent hash of 0
    if (block.parent === 0) genesisHash = hash
  }
  for (const [hash, block] of blocks) {
    if (hash !== genesisHash) {
      children.get(block.parent)!.push(hash)
    }
  }
  const root: Blocks = new Map()
  root.set(genesisHash, blocks.get(genesisHash)!)
  const result = [root]
  let done = false
  while (!done) {
    const prevLevel = result[result.length - 1]
    const currLevel: Blocks = new Map()
    for (const hash of prevLevel.keys()) {
      for (const childHash of children.get(hash)!) {
        currLevel.set(childHash, blocks.get(childHash)!)
      }
    }
    if (currLevel.size > 0) {
      result.push(currLevel)
    } else {
      done = true
    }
  }
  return result
}

const getPositions = (blocks: Blocks, gap: number) => {
  const levels = getLevels(blocks)
  const positions = new Map<Hash, [number, number]>()
  for (let i = 0; i < levels.length; i++) {
    let j = 0
    for (const hash of levels[i].keys()) {
      const x = (j - (levels[i].size - 1) / 2) * gap
      const y = i * gap
      positions.set(hash, [x, y])
      j++
    }
  }
  return positions
}

type BlocktreeProps = {
  blocks: Blocks
  blockSize: number
  blockGap: number
  visibleHeight: number
  debugAddBlock?: (parentHash: Hash) => void
}

export const Blocktree = (props: BlocktreeProps) => {
  const positions = useMemo(
    () => getPositions(props.blocks, props.blockSize + props.blockGap),
    [props.blocks, props.blockSize, props.blockGap]
  )

  const [width, height] = useMemo(
    () => {
      const xs = [...positions.values()].map(([x, y]) => x)
      const ys = [...positions.values()].map(([x, y]) => y)
      const width = Math.max(...xs) - Math.min(...xs) + props.blockSize
      const height = Math.max(...ys) - Math.min(...ys) + props.blockSize
      return [width, height]
    },
    [props.blockSize, positions]
  )

  const translateY = useMemo(
    () => (props.blockSize + props.blockGap) * props.visibleHeight - height,
    [props.blockSize, props.blockGap, props.visibleHeight, height]
  )

  const spring = useSpring({
    transform: `translateY(${translateY}px)`
  })

  return (
    <animated.svg
      viewBox={`${-width / 2} ${-props.blockSize / 2} ${width} ${height}`}
      style={{
        width: width,
        height: height,
        ...spring,
      }}
    >
      <rect
        x={-width / 2}
        y={-props.blockSize / 2}
        width={width}
        height={height}
        fill='none'
        stroke='green'
        strokeWidth={2}
      />
      {[...props.blocks].map(([hash, block]) => (
        <rect
          key={hash}
          x={positions.get(hash)![0] - props.blockSize / 2}
          y={positions.get(hash)![1] - props.blockSize / 2}
          width={props.blockSize}
          height={props.blockSize}
          fill={block.minerType === 'honest' ? 'white' : 'red'}
          onClick={() => props.debugAddBlock?.(hash)}
        />
      ))}
      {[...props.blocks].map(([hash, block]) => (
        block.parent === 0
          ? null
          : <line
            key={hash}
            x1={positions.get(hash)![0]}
            y1={positions.get(hash)![1] - props.blockSize / 2}
            x2={positions.get(block.parent)![0]}
            y2={positions.get(block.parent)![1] + props.blockSize / 2}
            stroke='white'
            strokeWidth={8}
          />
      ))}
    </animated.svg>
  )
}
