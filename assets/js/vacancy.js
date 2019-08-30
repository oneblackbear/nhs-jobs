import React from 'react';
import { render } from 'react-dom';
import NhsFeed from './NhsFeed/NhsFeed';

render(
    <NhsFeed feed={window.FEED} />,
    document.getElementById('nhs-feed')
);


