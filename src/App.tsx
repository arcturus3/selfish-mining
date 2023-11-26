import {useState} from 'react';
import {useControls} from 'leva'
import useWebSocket from 'react-use-websocket';
import {Blocktree, Hash, Block, Blocks} from './Blocktree'
import data from '../data.json'

export const App = () => {
  const [blocks, setBlocks] = useState<Blocks>(() => {
    const entries = Object.entries(data).map(([hash, block]) => [parseInt(hash), block]) as [Hash, Block][]
    return new Map(entries)
  })
  const socket = useWebSocket('wss://echo.websocket.org', {
    onMessage: (event) => setBlocks(JSON.parse(event.data))
  })
  const config = useControls({})

  const debugAddBlock = (parentHash: Hash) => {
    setBlocks(prev => {
      const blocks = new Map(prev)
      const hash = Math.floor(Math.random() * 1e6)
      const block: Block = {
        parent: parentHash,
        minerType: 'honest',
      }
      blocks.set(hash, block)
      return blocks
    })
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Blocktree
        blocks={blocks}
        blockSize={100}
        blockGap={100}
        visibleHeight={6}
        debugAddBlock={debugAddBlock}
      />
    </div>
  )
}

