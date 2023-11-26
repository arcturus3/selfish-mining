import { useState, useMemo } from 'react';
import {useControls} from 'leva'
import useWebSocket from 'react-use-websocket';
import {animated, useSpring} from '@react-spring/web'
import {Blocktree as BlockStore} from './Blocktree'
import {blocktree} from '../data'

type Hash = number;

type Block = {
  parent: Hash,
  minerType: 'honest' | 'adversary'
};

type Blocks = Map<Hash, Block>;

export const App = () => {
  const [blocks, setBlocks] = useState<Blocks>()

  const socket = useWebSocket('wss://echo.websocket.org', {
    onMessage: (event) => setBlocks(JSON.parse(event.data))
  })
  const config = useControls({})

  const spring = useSpring({
    transform: `translateY(-${levels.length * 50}px)`
  })

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
      <Blocktree blocks={blocks} debugAddBlock={debugAddBlock} />
    </div>
  )
}

