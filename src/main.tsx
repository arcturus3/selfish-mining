import React from 'react'
import ReactDOM from 'react-dom/client'
import {Blocktree} from './App.tsx'
import './index.css'
import {blocktree} from '../data'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Blocktree data={blocktree} />
    </div>
  </React.StrictMode>,
)
