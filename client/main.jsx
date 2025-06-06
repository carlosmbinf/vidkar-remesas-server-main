import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';


Meteor.startup(() => {
  
    render(<App />, document.getElementById('react-target'));
  
});