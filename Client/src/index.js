/*eslint-disable import/default */

import React from 'react';
import {render} from 'react-dom';
import configureStore from './configureStore';
import {Provider} from 'react-redux';
import App from './components/common/App';
import './style/style.css';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-notifications/lib/notifications.css';
import './assets/styles/index.css';
import './assets/styles/salesforce-lightning-design-system.css';
import './assets/styles/react-super-select.css';
import './assets/styles/react-dropdown-multiselect.css';
import './assets/styles/custom-styles.css';
import './assets/styles/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-notifications/lib/notifications.css';
import './assets/styles/loginstyle.css';
import 'rc-tree/assets/index.css';
import '../src/components/UserPermission/index.css';

const store = configureStore();
render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);