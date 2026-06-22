import{useState,useEffect}from'react';
import{AppProvider}from'./context/AppContext';
import Splash from'./pages/Splash';
import Login from'./pages/Login';
import Home from'./pages/Home';
import Expenses from'./pages/Expenses';
import Budget from'./pages/Budget';
import Reports from'./pages/Reports';
import Notifications from'./pages/Notifications';
import Profile from'./pages/Profile';
import BottomNav from'./components/BottomNav';
import ExpenseModal from'./components/ExpenseModal';

function Inner(){
  const[screen,setScreen]=useState('splash');
  const[page,setPage]=useState('home');
  const[fab,setFab]=useState(false);
  const[key,setKey]=useState(0);

  const go=p=>{
    if(p===page)return;
    setPage(p);
    setKey(k=>k+1);
  };

  // Update document title per page
  useEffect(()=>{
    const titles={home:'Home',expenses:'Expenses',budget:'Budget',reports:'Reports',notifications:'Notifications',profile:'Profile'};
    document.title=`${titles[page]||'Home'} · Student Budget Tracker`;
  },[page]);

  if(screen==='splash')return<Splash onStart={()=>setScreen('login')}/>;
  if(screen==='login')return<Login onLogin={()=>setScreen('app')}/>;

  const SHOW_NAV=['home','expenses','budget','profile'];

  return(
    <div className="app-shell">
      <div key={key} className="page-enter">
        {page==='home'&&<Home setActive={go}/>}
        {page==='expenses'&&<Expenses setActive={go}/>}
        {page==='budget'&&<Budget setActive={go}/>}
        {page==='reports'&&<Reports setActive={go}/>}
        {page==='notifications'&&<Notifications setActive={go}/>}
        {page==='profile'&&<Profile setActive={go}/>}
      </div>
      <BottomNav active={page} setActive={go} onFab={()=>setFab(true)}/>
      {fab&&<ExpenseModal onClose={()=>setFab(false)}/>}
    </div>
  );
}
export default function App(){
  return<AppProvider><Inner/></AppProvider>;
}
