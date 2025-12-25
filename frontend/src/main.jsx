import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import SimpleApp from './SimpleApp.jsx'
import { store } from './redux/store.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <SimpleApp />
    </BrowserRouter>
  </Provider>
)