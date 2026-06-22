export default function Splash({onStart}){
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#6C63FF 0%,#a78bfa 55%,#4ECDC4 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',
      padding:'60px 32px 48px',color:'white',textAlign:'center'}}>
      <div>
        <div style={{fontSize:72,marginBottom:16,filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.25))'}}>💰</div>
        <h1 style={{fontSize:30,fontWeight:900,margin:'0 0 10px',letterSpacing:'-0.5px',lineHeight:1.2}}>
          student Expense and<br/>
          <span style={{color:'#ffd700',fontSize:32}}>Budget Tracker</span>
        </h1>
        <p style={{fontSize:15,opacity:0.85,margin:'0',lineHeight:1.7}}>
          Track plan save<br/>Achieve your goals!
        </p>
      </div>
      <div style={{fontSize:130,filter:'drop-shadow(0 12px 32px rgba(0,0,0,0.2))'}}>🎓</div>
      <button onClick={onStart} style={{
        background:'white',color:'#6C63FF',border:'none',borderRadius:'50px',
        padding:'16px 56px',fontSize:18,fontWeight:800,cursor:'pointer',
        boxShadow:'0 8px 32px rgba(0,0,0,0.2)',transition:'all 0.2s',fontFamily:'inherit'
      }}>Get Started →</button>
    </div>
  );
}
