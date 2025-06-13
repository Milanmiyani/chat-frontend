import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import GroupChat from './components/GroupChat';
import Home from './components/Home';
import HomeGroupChattitle from './components/HomeGroupChattitle';
import HomeGroupChatfooter from './components/HomeGroupChatfooter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/groupchat" element={<GroupChat />} />
        <Route path='/Home' element={<Home/>} />
        <Route path='/HomeGrouptititle' element={< HomeGroupChattitle/>}/>
        <Route path='/HomeGroupChatfooter' element={<HomeGroupChatfooter/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;