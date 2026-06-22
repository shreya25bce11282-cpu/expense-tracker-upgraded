import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';

const AppContext = createContext();

export const CATEGORY_ICONS = {
  Food:'🍔', Transport:'🚌', Shopping:'🛍️',
  Education:'📚', Entertainment:'🎮', Health:'💊', Bills:'📄', Other:'📦'
};
export const CATEGORY_COLORS = {
  Food:'#FF6B6B', Transport:'#4ECDC4', Shopping:'#a78bfa',
  Education:'#3b82f6', Entertainment:'#f59e0b', Health:'#10b981',
  Bills:'#ef4444', Other:'#94a3b8'
};

const SEED = [
  {id:1,name:'Lunch',category:'Food',amount:250,date:'2026-06-20',notes:''},
  {id:2,name:'Bus Pass',category:'Transport',amount:800,date:'2026-06-19',notes:''},
  {id:3,name:'Semester Books',category:'Education',amount:1000,date:'2026-06-18',notes:'Semester books'},
  {id:4,name:'T-Shirt',category:'Shopping',amount:1700,date:'2026-06-17',notes:''},
  {id:5,name:'Movie Tickets',category:'Entertainment',amount:500,date:'2026-06-16',notes:''},
  {id:6,name:'Dinner',category:'Food',amount:400,date:'2026-06-15',notes:''},
  {id:7,name:'Groceries',category:'Food',amount:1200,date:'2026-06-14',notes:''},
  {id:8,name:'Cab',category:'Transport',amount:350,date:'2026-06-13',notes:''},
];

const INIT = {
  user:{name:'Rohit',email:'RohitSarma624@gmail.com',branch:'BTech Computer Science',college:'VIT University',avatar:'👨‍💻'},
  income:15000, totalBudget:10000,
  categoryBudgets:{Food:3000,Transport:2000,Shopping:2000,Education:2000,Entertainment:1000},
  expenses:SEED,
  notifications:[
    {id:'n1',key:'food_demo',type:'warning',title:'Budget Alert',message:'You have spent 80% of your Food budget.',time:'10:30 AM',read:false},
    {id:'n2',key:'shop_demo',type:'danger',title:'Budget Alert',message:'You have spent 90% of your Shopping budget.',time:'Yesterday',read:true},
    {id:'n3',key:'gen_demo',type:'info',title:'Budget Alert',message:'Monthly budget limit is approaching.',time:'2 days ago',read:true},
    {id:'n4',key:'inc_demo',type:'success',title:'Income Added',message:'Your income of ₹5,000 has been added.',time:'3 days ago',read:true},
  ],
  savingsGoal:5000,
  achievements:{budgetMaster:false,saver:false,consistentTracker:false,smartSpender:false},
  streak:3, lastActiveDate:new Date().toDateString(),
};

function generateAlerts(state){
  let s={...state,notifications:[...state.notifications]};
  const ct={};
  state.expenses.forEach(e=>{ct[e.category]=(ct[e.category]||0)+e.amount;});
  const ts=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  Object.entries(state.categoryBudgets).forEach(([cat,budget])=>{
    const spent=ct[cat]||0; const pct=(spent/budget)*100;
    const add=(key,type,msg)=>{
      if(!s.notifications.some(n=>n.key===key))
        s.notifications=[{id:Date.now()+Math.random(),key,type,title:'Budget Alert',message:msg,time:ts,read:false},...s.notifications];
    };
    if(pct>=100) add(`${cat}_over_${Math.floor(pct/10)}`,'danger',`${cat} budget has been exceeded!`);
    else if(pct>=90) add(`${cat}_90_${Math.floor(pct/5)}`,'warning',`You have spent 90% of your ${cat} budget.`);
    else if(pct>=80) add(`${cat}_80_${Math.floor(pct/10)}`,'info',`You have spent 80% of your ${cat} budget.`);
  });
  return s;
}

function reducer(state,action){
  switch(action.type){
    case 'ADD_EXPENSE':    return generateAlerts({...state,expenses:[{...action.payload,id:Date.now()},...state.expenses]});
    case 'EDIT_EXPENSE':   return generateAlerts({...state,expenses:state.expenses.map(e=>e.id===action.payload.id?action.payload:e)});
    case 'DELETE_EXPENSE': return {...state,expenses:state.expenses.filter(e=>e.id!==action.payload)};
    case 'SET_BUDGET':     return generateAlerts({...state,totalBudget:action.payload.total,categoryBudgets:action.payload.categories});
    case 'SET_INCOME':     return {...state,income:action.payload};
    case 'ADD_INCOME':     return {...state,income:state.income+action.payload};
    case 'SET_SAVINGS_GOAL': return {...state,savingsGoal:action.payload};
    case 'READ_NOTIF':     return {...state,notifications:state.notifications.map(n=>n.id===action.payload?{...n,read:true}:n)};
    case 'READ_ALL':       return {...state,notifications:state.notifications.map(n=>({...n,read:true}))};
    case 'UPDATE_USER':    return {...state,user:{...state.user,...action.payload}};
    case 'UPDATE_STREAK':  return {...state,streak:action.payload.streak,lastActiveDate:action.payload.date};
    case 'UPDATE_ACH':     return {...state,achievements:{...state.achievements,...action.payload}};
    case 'LOAD':           return action.payload;
    default:               return state;
  }
}

export function AppProvider({children}){
  const [state,dispatch]=useReducer(reducer,INIT);
  const [theme,setThemeRaw]=useState(()=>localStorage.getItem('theme')||'light');
  const [toast,setToast]=useState(null);

  // Load persisted state
  useEffect(()=>{
    const s=localStorage.getItem('ebt_state');
    if(s){try{dispatch({type:'LOAD',payload:JSON.parse(s)});}catch{}}
  },[]);

  // Persist state
  useEffect(()=>{
    localStorage.setItem('ebt_state',JSON.stringify(state));
    // achievements
    const tot=state.expenses.reduce((s,e)=>s+e.amount,0);
    const sav=state.income-tot;
    const ct={};
    state.expenses.forEach(e=>{ct[e.category]=(ct[e.category]||0)+e.amount;});
    const all80=Object.entries(state.categoryBudgets).every(([c,b])=>((ct[c]||0)/b)<0.8);
    dispatch({type:'UPDATE_ACH',payload:{saver:sav>=state.savingsGoal,budgetMaster:tot<=state.totalBudget,smartSpender:all80}});
  },[state.expenses,state.categoryBudgets,state.totalBudget,state.income]);

  // Apply theme to <html>
  const setTheme=useCallback((t)=>{
    const next=typeof t==='function'?t(theme):t;
    setThemeRaw(next);
    document.documentElement.classList.toggle('dark',next==='dark');
    localStorage.setItem('theme',next);
  },[theme]);

  // Apply on mount
  useEffect(()=>{
    document.documentElement.classList.toggle('dark',theme==='dark');
  },[]);

  // Streak
  useEffect(()=>{
    const today=new Date().toDateString();
    if(state.lastActiveDate!==today){
      const yest=new Date();yest.setDate(yest.getDate()-1);
      const streak=state.lastActiveDate===yest.toDateString()?state.streak+1:1;
      dispatch({type:'UPDATE_STREAK',payload:{streak,date:today}});
    }
  },[]);

  const showToast=useCallback((msg,type='success')=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  },[]);

  // Derived
  const totalExpenses=state.expenses.reduce((s,e)=>s+e.amount,0);
  const savings=state.income-totalExpenses;
  const remaining=state.totalBudget-totalExpenses;
  const catTotals={};
  state.expenses.forEach(e=>{catTotals[e.category]=(catTotals[e.category]||0)+e.amount;});

  const healthScore=(()=>{
    let sc=100;
    const util=totalExpenses/state.totalBudget;
    if(totalExpenses>state.totalBudget) sc-=Math.min(40,((totalExpenses-state.totalBudget)/state.totalBudget)*40);
    if(util>0.9) sc-=15; else if(util>0.75) sc-=8;
    if(savings>=state.savingsGoal) sc+=5;
    return Math.max(0,Math.min(100,Math.round(sc)));
  })();
  const healthStatus=healthScore>=90?'Excellent':healthScore>=70?'Good':healthScore>=50?'Fair':'Risky';
  const healthColor=healthScore>=90?'#10b981':healthScore>=70?'#4ECDC4':healthScore>=50?'#f59e0b':'#ef4444';

  const today2=new Date();
  const daysInMonth=new Date(today2.getFullYear(),today2.getMonth()+1,0).getDate();
  const dayOfMonth=today2.getDate();
  const avgDailySpend=totalExpenses/Math.max(1,dayOfMonth);
  const forecast=avgDailySpend*daysInMonth;
  const forecastSavings=state.income-forecast;

  const unread=state.notifications.filter(n=>!n.read).length;

  return(
    <AppContext.Provider value={{
      state,dispatch,theme,setTheme,showToast,
      totalExpenses,savings,remaining,catTotals,
      healthScore,healthStatus,healthColor,
      forecast,forecastSavings,avgDailySpend,
      unread, CATEGORY_ICONS,CATEGORY_COLORS,
    }}>
      {children}
      {toast&&(
        <div className="toast" style={{
          background:toast.type==='success'?'#10b981':toast.type==='error'?'#ef4444':toast.type==='warning'?'#f59e0b':'#6C63FF'
        }}>
          <span>{toast.type==='success'?'✓':toast.type==='error'?'✗':'ℹ'}</span>
          {toast.msg}
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useApp=()=>useContext(AppContext);
