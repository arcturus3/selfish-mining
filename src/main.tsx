import React from 'react'
import ReactDOM from 'react-dom/client'
import {Blocktree} from './App.tsx'
import './index.css'
import {blocktree} from '../data'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Blocktree data={blocktree} />
  </React.StrictMode>,
)
