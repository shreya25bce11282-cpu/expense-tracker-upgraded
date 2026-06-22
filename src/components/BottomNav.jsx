import{useApp}from'../context/AppContext';

const TABS=[
  {id:'home',    ico:'🏠', label:'Home'},
  {id:'expenses',ico:'📋', label:'Expenses'},
  {id:null,      ico:'+',  label:''},
  {id:'budget',  ico:'💼', label:'Budget'},
  {id:'profile', ico:'👤', label:'Profile'},
];

export default function BottomNav({active,setActive,onFab}){
  const{unread}=useApp();
  return(
    <nav className="bottom-nav">
      {TABS.map((t,i)=>{
        if(t.id===null) return(
          <div key="fab" style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
            <button className="fab" onClick={onFab} aria-label="Add expense" style={{width:50,height:50,fontSize:26}}>+</button>
          </div>
        );
        return(
          <button key={t.id} className={`nav-btn${active===t.id?' active':''}`}
            onClick={()=>setActive(t.id)} aria-label={t.label} style={{position:'relative'}}>
            <span className="ico">{t.ico}</span>
            <span className="label-t">{t.label}</span>
            {/* Notification badge only on Home tab (matches wireframe bell icon in header) */}
            {t.id==='home'&&unread>0&&(
              <span style={{position:'absolute',top:4,right:'18%',background:'#ef4444',color:'#fff',
                borderRadius:'50%',width:15,height:15,fontSize:9,fontWeight:700,
                display:'flex',alignItems:'center',justifyContent:'center'}}>{unread>9?'9+':unread}</span>
            )}
            {active===t.id&&(
              <span style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',
                width:18,height:3,background:'var(--primary)',borderRadius:2}}/>
            )}
          </button>
        );
      })}
    </nav>
  );
}
