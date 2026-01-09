import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ContentManager } from './helper/content-manager'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentManager />
  </StrictMode>,
)
