import{useState}from'react';
import{useApp}from'../context/AppContext';
import{fmt}from'../utils/format';
const ACH=[
  {key:'budgetMaster',ico:'🏅',title:'Budget Master',desc:'Stay under budget'},
  {key:'saver',ico:'🏅',title:'Saver',desc:'Reach savings goal'},
  {key:'consistentTracker',ico:'🏅',title:'Consistent Tracker',desc:'7 consecutive days'},
  {key:'smartSpender',ico:'🏅',title:'Smart Spender',desc:'All categories under 80%'},
];
export default function Profile({setActive}){
  const{state,dispatch,theme,setTheme,showToast,totalExpenses,savings,healthScore,healthStatus,healthColor}=useApp();
  const[editMode,setEditMode]=useState(false);
  const[form,setForm]=useState({...state.user});
  const[goalInput,setGoalInput]=useState(String(state.savingsGoal));

  const saveProfile=()=>{dispatch({type:'UPDATE_USER',payload:form});setEditMode(false);showToast('Profile updated!');};

  const exportPDF=async()=>{
    try{
      const{default:jsPDF}=await import('jspdf');
      const doc=new jsPDF();const today=new Date().toISOString().split('T')[0];
      doc.setFillColor(108,99,255);doc.rect(0,0,210,40,'F');
      doc.setTextColor(255,255,255);doc.setFontSize(20);doc.setFont(undefined,'bold');
      doc.text('Expense Report',14,20);doc.setFontSize(11);doc.text(`Generated: ${today}`,14,32);
      doc.setTextColor(30,30,30);doc.setFontSize(14);doc.setFont(undefined,'bold');doc.text('User Details',14,55);
      doc.setFontSize(11);doc.setFont(undefined,'normal');
      doc.text(`Name: ${state.user.name}`,14,65);doc.text(`Email: ${state.user.email}`,14,73);
      doc.text(`College: ${state.user.college}`,14,81);
      doc.setFontSize(14);doc.setFont(undefined,'bold');doc.text('Financial Summary',14,97);
      doc.setFont(undefined,'normal');doc.setFontSize(11);
      doc.text(`Monthly Budget: ₹${state.totalBudget.toLocaleString()}`,14,107);
      doc.text(`Total Income: ₹${state.income.toLocaleString()}`,14,115);
      doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`,14,123);
      doc.text(`Savings: ₹${savings.toLocaleString()}`,14,131);
      doc.text(`Health Score: ${healthScore}/100 (${healthStatus})`,14,139);
      doc.text(`Savings Goal: ${Math.min(100,Math.round((savings/state.savingsGoal)*100))}% of ₹${state.savingsGoal.toLocaleString()}`,14,147);
      doc.setFontSize(14);doc.setFont(undefined,'bold');doc.text('Expenses',14,163);
      let y=173;
      state.expenses.slice(0,15).forEach(e=>{
        doc.setFont(undefined,'normal');doc.setFontSize(10);
        doc.text(`${e.date}  ${e.name} (${e.category})  ₹${e.amount.toLocaleString()}`,14,y);
        y+=7;if(y>270){doc.addPage();y=20;}
      });
      doc.save(`expense-report-${today}.pdf`);showToast('PDF exported!');
    }catch(err){showToast('Export failed','error');}
  };

  const menuItems=[
    {ico:'👤',label:'Personal Information',action:()=>setEditMode(true)},
    {ico:'⚙️',label:'Settings',action:()=>showToast('Settings coming soon')},
    {ico:'📄',label:'Export Report (PDF)',action:exportPDF},
    {ico:'❓',label:'Help & Support',action:()=>showToast('Help coming soon')},
    {ico:'ℹ️',label:'About App',action:()=>showToast('Student Budget Tracker v2.0')},
  ];

  return(
    <div className="page">
      {/* Header */}
      <div className="grad-profile" style={{padding:'20px 20px 72px',textAlign:'center',position:'relative'}}>
        <div className="row" style={{justifyContent:'space-between',marginBottom:16}}>
          <button className="btn-back" onClick={()=>setActive('home')} aria-label="Go back">←</button>
          <h1 style={{color:'white',margin:0,fontSize:22,fontWeight:900,letterSpacing:'-0.5px',flex:1,textAlign:'center'}}>Profile</h1>
          <div style={{width:36}}/>
        </div>
        <div style={{width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.25)',
          border:'3px solid rgba(255,255,255,0.6)',display:'flex',alignItems:'center',
          justifyContent:'center',fontSize:40,margin:'0 auto',boxShadow:'0 8px 24px rgba(0,0,0,0.2)'}}>
          {state.user.avatar}
        </div>
      </div>

      <div style={{padding:'0 16px'}}>
        {/* Profile card */}
        <div className="card" style={{padding:20,marginTop:44,textAlign:'center',marginBottom:12}}>
          <h2 style={{margin:'0 0 4px',fontSize:22,fontWeight:900,color:'var(--text)',letterSpacing:'-0.3px'}}>{state.user.name}</h2>
          <p style={{margin:'0 0 2px',color:'var(--muted)',fontSize:14}}>{state.user.branch}</p>
          <p style={{margin:'0 0 2px',color:'var(--muted)',fontSize:14}}>{state.user.college}</p>
          <p style={{margin:'0 0 16px',color:'var(--faint)',fontSize:13}}>{state.user.email}</p>
          <div className="row gap10" style={{justifyContent:'center'}}>
            <div style={{padding:'8px 18px',borderRadius:12,background:`${healthColor}15`,textAlign:'center'}}>
              <div style={{fontWeight:900,color:healthColor,fontSize:20,letterSpacing:'-0.5px'}}>{healthScore}</div>
              <div style={{fontSize:10,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.3px'}}>Health</div>
            </div>
            <div style={{padding:'8px 18px',borderRadius:12,background:'rgba(245,158,11,0.12)',textAlign:'center'}}>
              <div style={{fontWeight:900,color:'#f59e0b',fontSize:20}}>🔥{state.streak}</div>
              <div style={{fontSize:10,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.3px'}}>Streak</div>
            </div>
          </div>
        </div>

        {/* Dark mode toggle */}
        <div className="card" style={{padding:'16px 20px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>{theme==='dark'?'🌙 Dark Mode':'☀️ Light Mode'}</div>
            <div style={{fontSize:12,color:'var(--faint)',marginTop:2}}>Toggle app appearance</div>
          </div>
          <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} style={{
            width:52,height:28,borderRadius:14,border:'none',cursor:'pointer',position:'relative',
            background:theme==='dark'?'var(--primary)':'var(--border)',transition:'background 0.3s'}}>
            <div style={{width:22,height:22,borderRadius:'50%',background:'white',position:'absolute',
              top:3,left:theme==='dark'?26:3,transition:'left 0.3s',boxShadow:'0 2px 6px rgba(0,0,0,0.25)'}}/>
          </button>
        </div>

        {/* Savings goal */}
        <div className="card" style={{padding:'16px 20px',marginBottom:12}}>
          <p style={{margin:'0 0 12px',fontSize:13,fontWeight:700,color:'var(--text)'}}>🎯 Monthly Savings Goal</p>
          <div className="row gap8">
            <input className="field flex-1" type="number" value={goalInput}
              onChange={e=>setGoalInput(e.target.value)} placeholder="Enter goal"/>
            <button className="btn btn-primary" style={{width:'auto',padding:'13px 20px'}}
              onClick={()=>{dispatch({type:'SET_SAVINGS_GOAL',payload:+goalInput});showToast('Goal updated!');}}>
              Set
            </button>
          </div>
          <p style={{margin:'8px 0 0',fontSize:12,color:'var(--faint)'}}>
            Currently saving {fmt(Math.max(0,savings))} toward {fmt(state.savingsGoal)}
          </p>
        </div>

        {/* Achievements */}
        <div className="card" style={{padding:'16px 20px',marginBottom:12}}>
          <p style={{margin:'0 0 14px',fontSize:13,fontWeight:700,color:'var(--text)'}}>🏆 Achievements</p>
          <div className="col gap12">
            {ACH.map(a=>{
              const on=state.achievements[a.key];
              return(
                <div key={a.key} className="row gap12" style={{opacity:on?1:0.4}}>
                  <span style={{fontSize:28,filter:on?'none':'grayscale(1)'}}>{a.ico}</span>
                  <div className="flex-1">
                    <div style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>{a.title}</div>
                    <div style={{fontSize:12,color:'var(--faint)'}}>{a.desc}</div>
                  </div>
                  {on&&<span style={{background:'rgba(16,185,129,0.15)',color:'#10b981',borderRadius:8,
                    padding:'3px 10px',fontSize:11,fontWeight:700,flexShrink:0}}>✓ Unlocked</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu */}
        <div className="card-flat" style={{borderRadius:16,overflow:'hidden',marginBottom:16}}>
          {menuItems.map((item,i)=>(
            <button key={i} onClick={item.action} style={{
              width:'100%',display:'flex',alignItems:'center',gap:14,
              padding:'15px 20px',background:'none',border:'none',
              borderBottom:i<menuItems.length-1?'1px solid var(--border)':'none',
              cursor:'pointer',textAlign:'left',fontFamily:'inherit',transition:'background 0.15s'}}>
              <span style={{fontSize:20,width:26,textAlign:'center'}}>{item.ico}</span>
              <span style={{flex:1,fontWeight:500,fontSize:14,color:'var(--text)'}}>{item.label}</span>
              <span style={{color:'var(--faint)',fontSize:18,fontWeight:300}}>›</span>
            </button>
          ))}
        </div>

        {/* Edit modal */}
        {editMode&&(
          <div className="overlay">
            <div className="sheet">
              <div className="sheet-handle"/>
              <div className="row" style={{justifyContent:'space-between',marginBottom:20}}>
                <h2 style={{fontSize:18,fontWeight:800,color:'var(--text)'}}>Edit Profile</h2>
                <button onClick={()=>setEditMode(false)} style={{background:'var(--surface2)',border:'1px solid var(--border)',
                  borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:16,color:'var(--muted)'}}>✕</button>
              </div>
              <div className="col gap14">
                {['name','email','branch','college'].map(k=>(
                  <div key={k}>
                    <label className="label" style={{textTransform:'capitalize'}}>{k}</label>
                    <input className="field" value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
                  </div>
                ))}
                <button className="btn btn-primary" onClick={saveProfile} style={{marginTop:4}}>Save Profile</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
