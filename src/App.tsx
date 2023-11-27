import {useState, useEffect} from 'react';
import {useControls, button, folder} from 'leva'
import axiosContext from 'axios'
import {Blocktree, Hash, Block, Blocks} from './Blocktree'
import data from '../data.json'

const axios = axiosContext.create({
  baseURL: 'http://localhost:8765'
})

export const App = () => {
  const [mining, setMining] = useState(false)
  const [blocks, setBlocks] = useState<Blocks>(() => new Map(Object.entries(data) as [Hash, Block][]))
  const config = useControls({
    startMining: button(
      () => {
        axios.post('/start', {
          // difficulty: ?,
          honest_power: [0.5],
          adversarial_power: [0.5],
        })
        setMining(true)
      },
      {disabled: mining}
    ),
    resetMining: button(
      () => {
        axios.get('/restart')
        setMining(false)
      },
      {disabled: !mining},
    ),
    difficulty: 1,
    addMiner: button(() => null),
    miner1: folder({
      adversarial: false,
      hashPower: 50,
      removeMiner: button(() => null),
    })
  })

  const parseBlockData = (data: [string | null, string], published: boolean): Block => ({
    parent: data[0] ?? '0',
    minerType: data[1] === 'Genesis' ? 'genesis' : (data[1].startsWith('Honest') ? 'honest' : 'adversary'),
    minerAddress: data[1] === 'Genesis' ? '0' : data[1].replace('Honest', '').replace('Adversary', ''),
    published: published,
  })

  useEffect(() => {
    const id = setInterval(async () => {
      if (mining) {
        const res = await axios.get('/blockchain')
        const blocks: Blocks = new Map()
        type BlockData = [string | null, string]
        Object.entries(res.data.published).forEach(([hash, data]) => {
          blocks.set(hash, parseBlockData(data as BlockData, true))
        })
        Object.entries(res.data.unpublished).forEach(([hash, data]) => {
          blocks.set(hash, parseBlockData(data as BlockData, false))
        })
        setBlocks(blocks)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [mining])

  const debugAddBlock = (parentHash: Hash) => {
    setBlocks(prev => {
      const blocks = new Map(prev)
      const hash = Math.floor(Math.random() * 1e6).toString()
      const block: Block = {
        parent: parentHash,
        minerType: 'honest',
        minerAddress: '1',
        published: true,
      }
      blocks.set(hash, block)
      return blocks
    })
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      overflow: 'clip',
    }}>
      <Blocktree
        blocks={blocks}
        blockSize={50}
        blockGap={50}
        visibleHeight={6}
        debugAddBlock={debugAddBlock}
      />
    </div>
  )
}

