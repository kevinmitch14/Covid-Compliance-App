import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { RecoilRoot } from 'recoil';


ReactDOM.render(
    <RecoilRoot>
        <App />
    </RecoilRoot>
    ,
    // <React.StrictMode>
    // </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
