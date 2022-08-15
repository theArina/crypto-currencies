import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataTable from './components/data-table';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route path=":query" element={<DataTable/>}/>
          <Route path="" element={<DataTable/>}/>
        </Route>
      </Routes>
    </Router>
  );
}
