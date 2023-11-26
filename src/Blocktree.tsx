import {Hash, Block, Blocks} from './App'

const blockSize = 100
const blockGap = 100

const getLevels = (blocks: Blocks) => {
  const children: Map<Hash, Hash[]> = {}
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
  const positions: Map<Hash, [number, number]> = {}
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
  blocks: Blocks
  debugAddBlock?: (parentHash: Hash) => void
}

export const Blocktree = (props: BlocktreeProps) => {
  const positions = getLayout(props.blocks)
  const levels = getLevels(props.blocks)
  const levelCounts = levels.map(level => Object.keys(level).length)
  const width = (Math.max(...levelCounts) - 1) * (blockSize + blockGap) + blockSize
  const height = (levels.length - 1) * (blockSize + blockGap) + blockSize

  return (
    <svg
      viewBox={`${-width / 2} ${-blockSize / 2} ${width} ${height}`}
      style={{width: width, height: height}}
    >
      <rect
        x={-width / 2}
        y={-blockSize / 2}
        width={width}
        height={height}
        fill='none'
        stroke='black'
        strokeWidth={2}
      />
      {Object.keys(blocktree).map(hash => (
        <rect
          key={hash}
          x={positions[parseInt(hash)][0] - blockSize / 2}
          y={positions[parseInt(hash)][1] - blockSize / 2}
          width={blockSize}
          height={blockSize}
          fill={blocktree[parseInt(hash)].minerType === 'honest' ? 'white' : 'red'}
          onClick={props?.debugAddBlock(hash)}
        />
      ))}
      {Object.entries(blocktree).map(([hash, block]) => (
        block.parent === 0
          ? null
          : <line
            key={hash}
            x1={positions[parseInt(hash)][0]}
            y1={positions[parseInt(hash)][1]}
            x2={positions[block.parent][0]}
            y2={positions[block.parent][1]}
            stroke='white'
            strokeWidth={8}
          />
      ))}
    </svg>
  )
}
