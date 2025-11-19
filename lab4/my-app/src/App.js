import './styles.css';
import SideBar from './components/SideBar';
import MainPanel from './components/MainPanel';
import TaskSetting from './components/TaskSetting';
import Modelling from './components/Modelling';
import Integration from './components/Integration';
import Posts from './components/Posts';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import APITab from './components/API';

function App(){
  // const [paragraph, setParagraph] = useState('постановка задачи');

  // const paragraphChangeHandler = (newParagraph) =>{
  //   setParagraph(newParagraph);
  // }

  // const renderNewParagraph = {
  //   'постановка задачи': <TaskSetting/>,
  //   'моделирование': <Modelling/>,
  //   'внедрение': <Integration/>
  // };

  return(
    <Router>
      <div>
        <SideBar/>
        <MainPanel content={
          <Routes>
            <Route path="/" element={<TaskSetting />} />
            <Route path="/task-setting" element={<TaskSetting />} />
            <Route path="/modelling" element={<Modelling />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/api" element={<APITab />} />
          </Routes>
        }
        />
      </div>
    </Router>
  );
}

export default App;