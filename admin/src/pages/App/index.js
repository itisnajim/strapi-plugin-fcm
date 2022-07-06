/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import { NotFound } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import TargetsPage from '../TargetsPage';

import Pencil from '@strapi/icons/Pencil';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';



const App = () => {
  const history = useHistory();

  return (
    <Box background="neutral100" padding={8} >
      <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
        <Box background="neutral0" paddingBottom={4}>
          <Button style={{ margin: '0 0 0 auto' }} variant='secondary' endIcon={<Pencil />} onClick={() => history.push('/content-manager/singleType/plugin::strapi-plugin-fcm.fcm-plugin-configuration')}>Configuration</Button>
        </Box>
        <Switch>
          <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
          <Route path={`/plugins/${pluginId}/targets`} component={TargetsPage} exact />
          <Route component={NotFound} />
        </Switch>
      </Box>
    </Box>
  );
};

export default App;
