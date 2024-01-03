import React from 'react';
import AuthProvider from "./components/providers/AuthProvider";
import { Navigation } from "./screens";

function App(){
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}


export default App;
