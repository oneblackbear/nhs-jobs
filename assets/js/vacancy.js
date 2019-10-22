import React from 'react';
import { render } from 'react-dom';
import NhsFeed from './NhsFeed/NhsFeed';
import {fetch} from 'whatwg-fetch';

render(
    <NhsFeed feed={window.FEED} />,
    document.getElementById('nhs-feed')
);


