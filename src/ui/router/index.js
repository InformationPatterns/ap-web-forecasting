import React from 'react'
import {buildRouter} from 'ap-web-general'
import Navbar from './Navbar'
import Sidbar from './Sidbar'
import ActualBlock from '../actual/block'
import ActualBar from '../actual/bar'
import ActualLot from '../actual/lot'


/* eslint-disable react/display-name */
export default buildRouter({
  routes: {
    '/actual/block': () => <ActualBlock />,
    '/actual/bar': () => <ActualBar />,
    '/actual/lot': () => <ActualLot />
  },
  defaultRoute: '/actual/block',
  navbar: (modules) => <Navbar modules={modules} />,
  sidbar: () => <Sidbar />
})
/* eslint-enable react/display-name */
