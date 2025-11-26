// App.js
import React from 'react';

import { Tab, TabPane } from '../../tab/tab';
import Role from "../Master/role/roleTable"

const App = () => {
  return (
    <div className="app-container">
      <Tab>
    
        <TabPane label="Roles">
            <Role/>
         
        </TabPane>
      </Tab>
    </div>
  );
};

export default App;