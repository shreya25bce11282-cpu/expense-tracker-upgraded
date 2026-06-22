import{useState}from'react';
import{useApp}from'../context/AppContext';
const TABS=['All','Alerts','Updates'];
const ICON={danger:{e:'🔴',bg:'rgba(239,68,68,0.12)'},warning:{e:'🟡',bg:'rgba(245,158,11,0.12)'},
  info:{e:'🔵',bg:'rgba(59,130,246,0.12)'},success:{e:'✅',bg:'rgba(16,185,129,0.12)'}};
export default function Notifications({setActive}){
  const{state,dispatch}=useApp();
  const[tab,setTab]=useState('All');
  const alertCount=state.notifications.filter(n=>(n.type==='warning'||n.type==='danger')&&!n.read).length;
  const filtered=state.notifications.filter(n=>{
    if(tab==='All')return true;
    if(tab==='Alerts')return n.type==='warning'||n.type==='danger';
    return n.type==='info'||n.type==='success';
  });
  return(
    <div className="page">
      <div className="grad-header" style={{padding:'20px 20px 24px'}}>
        <div className="row" style={{justifyContent:'space-between',alignItems:'center'}}>
          <div className="row gap12">
            <button className="btn-back" onClick={()=>setActive('home')} aria-label="Go back">←</button>
            <h1 style={{color:'white',margin:0,fontSize:22,fontWeight:900,letterSpacing:'-0.5px'}}>Notification</h1>
          </div>
          <button onClick={()=>dispatch({type:'READ_ALL'})} style={{
            background:'rgba(255,255,255,0.18)',border:'none',borderRadius:10,
            color:'white',padding:'7px 14px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:'inherit'}}>
            Mark all read
          </button>
        </div>
      </div>
      <div style={{padding:16}}>
        <div className="chip-row mb16">
          {TABS.map(t=>(
            <button key={t} className={`chip${tab===t?' active':''}`} onClick={()=>setTab(t)}>
              {t}
              {t==='Alerts'&&alertCount>0&&(
                <span style={{marginLeft:5,background:'#ef4444',color:'#fff',borderRadius:'50%',
                  padding:'1px 5px',fontSize:10,fontWeight:700}}>{alertCount}</span>
              )}
            </button>
          ))}
        </div>
        {filtered.length===0?(
          <div style={{textAlign:'center',padding:'56px 24px',color:'var(--faint)'}}>
            <div style={{fontSize:52,marginBottom:12}}>🔕</div>
            <p style={{fontSize:14,fontWeight:600,color:'var(--text)',margin:'0 0 4px'}}>No notifications</p>
            <p style={{fontSize:13,margin:0}}>You're all caught up!</p>
          </div>
        ):(
          <div className="col gap10 stagger">
            {filtered.map(n=>{
              const ic=ICON[n.type]||ICON.info;
              return(
                <div key={n.id} className="card anim-up"
                  style={{padding:'14px 16px',display:'flex',gap:12,
                    opacity:n.read?0.65:1,cursor:'pointer',transition:'opacity 0.2s'}}
                  onClick={()=>dispatch({type:'READ_NOTIF',payload:n.id})}>
                  <div style={{width:42,height:42,borderRadius:12,background:ic.bg,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
                    {ic.e}
                  </div>
                  <div className="flex-1">
                    <div className="row" style={{justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                      <span style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>{n.title}</span>
                      <span style={{fontSize:11,color:'var(--faint)',flexShrink:0}}>{n.time}</span>
                    </div>
                    <p style={{margin:'4px 0 0',fontSize:13,color:'var(--muted)',lineHeight:1.5}}>{n.message}</p>
                  </div>
                  {!n.read&&<div style={{width:8,height:8,borderRadius:'50%',background:'var(--primary)',flexShrink:0,marginTop:3}}/>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
