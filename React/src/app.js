// App.js

import React, { useState } from 'react';



import Landing from './Landing';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
        <Landing />

    </div>
  );
}

export default App;
