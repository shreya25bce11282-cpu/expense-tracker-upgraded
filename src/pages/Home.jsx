import{useState,useMemo}from'react';
import{useApp}from'../context/AppContext';
import DonutChart from'../components/DonutChart';
import AnimatedCounter from'../components/AnimatedCounter';
import ExpenseModal from'../components/ExpenseModal';
import IncomeModal from'../components/IncomeModal';
import{generateInsights}from'../utils/insights';
import{fmt,fmtDate}from'../utils/format';

export default function Home({setActive}){
  const{state,dispatch,showToast,totalExpenses,savings,remaining,catTotals,
    healthScore,healthStatus,healthColor,forecast,forecastSavings,
    unread,CATEGORY_ICONS,CATEGORY_COLORS}=useApp();
  const[showExp,setShowExp]=useState(false);
  const[showInc,setShowInc]=useState(false);
  const[editExp,setEditExp]=useState(null);

  const insights=useMemo(()=>generateInsights(state,catTotals,totalExpenses,savings,forecast),[state,catTotals,totalExpenses,savings,forecast]);
  const topInsight=insights[0];
  const budgetPct=Math.min(100,Math.round((totalExpenses/Math.max(state.totalBudget,1))*100));
  const savingsPct=Math.min(100,Math.max(0,Math.round((savings/Math.max(state.savingsGoal,1))*100)));
  const donutData=Object.entries(catTotals).map(([cat,val])=>({label:cat,value:val,color:CATEGORY_COLORS[cat]||'#94a3b8'}));
  const forecastStatus=forecast<=state.income?'On Track':forecast<=state.income*1.1?'At Risk':'Likely Overspend';
  const forecastColor=forecastStatus==='On Track'?'#10b981':forecastStatus==='At Risk'?'#f59e0b':'#ef4444';
  const del=id=>{dispatch({type:'DELETE_EXPENSE',payload:id});showToast('Expense deleted');};

  const barColor=p=>p>90?'#ef4444':p>75?'#f59e0b':'var(--primary)';

  return(
    <div className="page">
      {/* ── HEADER ── */}
      <div className="grad-header" style={{padding:'20px 20px 72px',position:'relative'}}>
        <div className="row" style={{justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <p style={{color:'rgba(255,255,255,0.75)',margin:0,fontSize:13,fontWeight:500}}>Hi, {state.user.name} 👋</p>
            <h2 style={{color:'white',margin:'4px 0 0',fontSize:19,fontWeight:800,letterSpacing:'-0.3px'}}>Let's manage your finances</h2>
          </div>
          <div className="row gap8">
            {/* Bell with notification badge — matches wireframe */}
            <button onClick={()=>setActive('notifications')} style={{
              background:'rgba(255,255,255,0.18)',border:'none',borderRadius:12,
              width:38,height:38,cursor:'pointer',color:'white',fontSize:17,
              display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              🔔
              {unread>0&&<span style={{position:'absolute',top:6,right:6,width:8,height:8,background:'#ef4444',borderRadius:'50%'}}/>}
            </button>
            <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(255,255,255,0.25)',
              border:'2px solid rgba(255,255,255,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>
              {state.user.avatar}
            </div>
          </div>
        </div>

        {/* Budget Card — overlaps header */}
        <div className="card" style={{marginTop:16,padding:18,position:'relative',zIndex:10}}>
          <div className="row" style={{justifyContent:'space-between',marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Budget</span>
            <span style={{fontSize:12,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.5px'}}>Remaining</span>
          </div>
          <div className="row" style={{justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span style={{fontSize:28,fontWeight:900,color:'var(--text)',letterSpacing:'-1px'}}>
              <AnimatedCounter value={state.totalBudget}/>
            </span>
            <span style={{fontSize:22,fontWeight:800,color:'var(--teal)',letterSpacing:'-0.5px'}}>
              <AnimatedCounter value={Math.max(0,remaining)}/>
            </span>
          </div>
          <div className="pbar">
            <div className="pbar-fill" style={{width:`${budgetPct}%`,background:barColor(budgetPct)}}/>
          </div>
          <p style={{color:'var(--faint)',fontSize:12,margin:'6px 0 0',fontWeight:500}}>{budgetPct}% Used</p>
        </div>
      </div>

      <div style={{padding:'0 16px 0'}}>

        {/* Smart Insight */}
        {topInsight&&(
          <div className="card anim-up" style={{
            marginTop:8,padding:'12px 16px',
            borderLeft:`4px solid ${topInsight.type==='danger'?'#ef4444':topInsight.type==='warning'?'#f59e0b':'var(--primary)'}`,
            borderRadius:'0 12px 12px 0'}}>
            <p style={{margin:0,fontSize:11,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>💡 Smart Insight</p>
            <p style={{margin:0,fontSize:13,color:'var(--text)',fontWeight:500,lineHeight:1.5}}>{topInsight.text}</p>
          </div>
        )}

        {/* Monthly Summary */}
        <div className="card" style={{marginTop:12,padding:16}}>
          <p style={{margin:'0 0 12px',fontSize:12,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.5px'}}>📅 This Month</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {[
              {label:'Income',  value:state.income,  color:'#10b981',bg:'rgba(16,185,129,0.1)'},
              {label:'Expenses',value:totalExpenses,  color:'#ef4444',bg:'rgba(239,68,68,0.1)'},
              {label:'Savings', value:savings,        color:'var(--primary)',bg:'rgba(108,99,255,0.1)'},
            ].map(it=>(
              <div key={it.label} style={{textAlign:'center',padding:'10px 6px',background:it.bg,borderRadius:10}}>
                <div style={{fontSize:13,fontWeight:800,color:it.color}}><AnimatedCounter value={it.value}/></div>
                <div style={{fontSize:10,color:'var(--muted)',marginTop:3,fontWeight:600}}>{it.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card" style={{marginTop:12,padding:16}}>
          <div className="row" style={{justifyContent:'space-between',marginBottom:12}}>
            <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>📊 Expense Overview</span>
            <span style={{fontSize:11,color:'var(--faint)'}}>This Month</span>
          </div>
          <div className="row gap12" style={{alignItems:'center'}}>
            <DonutChart data={donutData} size={160}/>
            <div className="col gap6 flex-1">
              {donutData.slice(0,5).map(d=>(
                <div key={d.label} className="row" style={{justifyContent:'space-between'}}>
                  <div className="row gap6">
                    <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0,marginTop:1}}/>
                    <span style={{fontSize:12,color:'var(--muted)'}}>{d.label}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health + Savings row */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
          <div className="card" style={{padding:14}}>
            <p style={{margin:'0 0 8px',fontSize:11,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.4px'}}>💚 Health Score</p>
            <div style={{fontSize:30,fontWeight:900,color:healthColor,letterSpacing:'-1px'}}>
              <AnimatedCounter value={healthScore} prefix=""/>
              <span style={{fontSize:14,color:'var(--faint)',fontWeight:500}}>/100</span>
            </div>
            <span style={{marginTop:6,display:'inline-block',padding:'3px 10px',borderRadius:20,
              fontSize:11,fontWeight:700,background:`${healthColor}20`,color:healthColor}}>
              {healthStatus}
            </span>
          </div>
          <div className="card" style={{padding:14}}>
            <p style={{margin:'0 0 8px',fontSize:11,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.4px'}}>🎯 Goal Tracker</p>
            <div style={{fontSize:18,fontWeight:800,color:'var(--primary)',letterSpacing:'-0.5px'}}>
              <AnimatedCounter value={Math.max(0,savings)}/>
            </div>
            <div style={{fontSize:11,color:'var(--faint)',margin:'3px 0 6px'}}>of {fmt(state.savingsGoal)}</div>
            <div className="pbar">
              <div className="pbar-fill" style={{width:`${savingsPct}%`,background:'var(--primary)'}}/>
            </div>
            <span style={{fontSize:11,color:'var(--primary)',fontWeight:700,marginTop:4,display:'block'}}>{savingsPct}%</span>
          </div>
        </div>

        {/* Forecast */}
        <div className="card" style={{marginTop:12,padding:16}}>
          <p style={{margin:'0 0 12px',fontSize:13,fontWeight:700,color:'var(--text)'}}>📈 Spending Forecast</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="inset" style={{padding:'10px 12px'}}>
              <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Expected Spending</div>
              <div style={{fontSize:17,fontWeight:800,color:'var(--text)'}}>{fmt(forecast)}</div>
            </div>
            <div className="inset" style={{padding:'10px 12px'}}>
              <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Expected Savings</div>
              <div style={{fontSize:17,fontWeight:800,color:forecastSavings>=0?'#10b981':'#ef4444'}}>{fmt(Math.abs(forecastSavings))}</div>
            </div>
          </div>
          <div style={{marginTop:10,display:'inline-flex',alignItems:'center',gap:6,
            padding:'5px 12px',borderRadius:8,background:`${forecastColor}15`}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:forecastColor}}/>
            <span style={{fontSize:12,fontWeight:700,color:forecastColor}}>{forecastStatus}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{marginTop:12,padding:16}}>
          <p style={{margin:'0 0 12px',fontSize:13,fontWeight:700,color:'var(--text)'}}>⚡ Quick Action</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
            {[
              {label:'Add\nExpense',ico:'➕',color:'#6C63FF',action:()=>setShowExp(true)},
              {label:'Add\nIncome', ico:'💰',color:'#10b981',action:()=>setShowInc(true)},
              {label:'View\nReport', ico:'📊',color:'#4ECDC4',action:()=>setActive('reports')},
              {label:'Set\nBudget',  ico:'💼',color:'#f59e0b',action:()=>setActive('budget')},
            ].map(a=>(
              <button key={a.label} onClick={a.action} style={{
                background:`${a.color}12`,border:`1.5px solid ${a.color}30`,
                borderRadius:12,padding:'10px 4px',cursor:'pointer',
                display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                transition:'all 0.15s',fontFamily:'inherit'}}>
                <span style={{fontSize:22}}>{a.ico}</span>
                <span style={{fontSize:10,fontWeight:700,color:a.color,textAlign:'center',lineHeight:1.3,whiteSpace:'pre'}}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="card" style={{marginTop:12,padding:16}}>
          <div className="row" style={{justifyContent:'space-between',marginBottom:14}}>
            <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>🧾 Recent Expenses</span>
            <button onClick={()=>setActive('expenses')} style={{fontSize:12,color:'var(--primary)',background:'none',border:'none',cursor:'pointer',fontWeight:700}}>See All</button>
          </div>
          {state.expenses.length===0?(
            <div style={{textAlign:'center',padding:'32px 0',color:'var(--faint)'}}>
              <div style={{fontSize:44,marginBottom:8}}>📭</div>
              <p style={{margin:0,fontSize:13,lineHeight:1.6}}>No expenses yet.<br/>Tap + to add your first expense.</p>
            </div>
          ):(
            <div className="col gap8">
              {state.expenses.slice(0,5).map(e=>(
                <div key={e.id} className="inset anim-r" style={{padding:'10px 12px',display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:40,height:40,borderRadius:12,background:`${CATEGORY_COLORS[e.category]||'#6C63FF'}18`,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
                    {CATEGORY_ICONS[e.category]||'📦'}
                  </div>
                  <div className="flex-1">
                    <div className="truncate" style={{fontWeight:600,fontSize:14,color:'var(--text)'}}>{e.name}</div>
                    <div style={{fontSize:11,color:'var(--faint)',marginTop:1}}>{fmtDate(e.date)}</div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontWeight:800,color:'#ef4444',fontSize:14,marginBottom:5}}>−{fmt(e.amount)}</div>
                    <div className="row gap4">
                      <button className="btn-icon edit" onClick={()=>setEditExp(e)}>Edit</button>
                      <button className="btn-icon del" onClick={()=>del(e.id)}>Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak */}
        <div style={{marginTop:12,marginBottom:4,display:'flex',justifyContent:'center'}}>
          <div style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)',borderRadius:20,
            padding:'9px 20px',color:'white',fontWeight:700,fontSize:13,display:'inline-flex',alignItems:'center',gap:6}}>
            🔥 Current Streak: {state.streak} {state.streak===1?'Day':'Days'}
          </div>
        </div>

      </div>

      {showExp&&<ExpenseModal onClose={()=>setShowExp(false)}/>}
      {showInc&&<IncomeModal onClose={()=>setShowInc(false)}/>}
      {editExp&&<ExpenseModal onClose={()=>setEditExp(null)} edit={editExp}/>}
    </div>
  );
}
