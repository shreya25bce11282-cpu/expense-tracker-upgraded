import{useState}from'react';
export default function Login({onLogin}){
  const[email,setEmail]=useState('');
  const[pass,setPass]=useState('');
  const[rem,setRem]=useState(false);
  return(
    <div style={{minHeight:'100vh',background:'#0a0a1a',display:'flex',flexDirection:'column'}}>
      <div style={{background:'linear-gradient(135deg,#6C63FF,#a78bfa)',padding:'48px 24px 64px',textAlign:'center'}}>
        <div style={{fontSize:80,filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'}}>💼</div>
      </div>
      <div style={{background:'#12122a',borderRadius:'28px 28px 0 0',flex:1,marginTop:-28,padding:'32px 24px',boxShadow:'0 -8px 32px rgba(0,0,0,0.3)'}}>
        <h2 style={{color:'white',fontSize:28,fontWeight:900,margin:'0 0 6px',textAlign:'center',letterSpacing:'-0.3px'}}>Welcome Back</h2>
        <p style={{color:'#94a3b8',textAlign:'center',margin:'0 0 32px',fontSize:15}}>Good to see you again</p>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <input style={{width:'100%',padding:'15px 18px',borderRadius:14,border:'2px solid #2d2d50',
            background:'#1e1e3a',color:'white',fontSize:15,fontFamily:'Inter,sans-serif',outline:'none'}}
            placeholder="Email Address" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input style={{width:'100%',padding:'15px 18px',borderRadius:14,border:'2px solid #2d2d50',
            background:'#1e1e3a',color:'white',fontSize:15,fontFamily:'Inter,sans-serif',outline:'none'}}
            placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <label style={{display:'flex',alignItems:'center',gap:8,color:'#94a3b8',fontSize:14,cursor:'pointer'}}>
              <input type="checkbox" checked={rem} onChange={e=>setRem(e.target.checked)} style={{accentColor:'#6C63FF',width:16,height:16}}/>
              Remember me
            </label>
            <button style={{color:'#a78bfa',background:'none',border:'none',fontSize:14,cursor:'pointer',fontWeight:600}}>Forgot password</button>
          </div>
          <button onClick={onLogin} style={{background:'linear-gradient(135deg,#6C63FF,#a78bfa)',color:'white',
            border:'none',borderRadius:14,padding:'15px',fontSize:16,fontWeight:700,cursor:'pointer',
            marginTop:8,fontFamily:'Inter,sans-serif',boxShadow:'0 6px 20px rgba(108,99,255,0.4)'}}>
            Login
          </button>
          <p style={{textAlign:'center',color:'#64748b',fontSize:14,margin:'4px 0'}}>
            Don't have an account?{' '}
            <button onClick={onLogin} style={{color:'#a78bfa',background:'none',border:'none',cursor:'pointer',fontWeight:700,fontSize:14}}>Sign Up</button>
          </p>
          <p style={{textAlign:'center',color:'#475569',fontSize:13,margin:0}}>or continue with</p>
          <div style={{display:'flex',justifyContent:'center',gap:12}}>
            {['🌐','🍎','📘','🪟','✉️'].map((ic,i)=>(
              <button key={i} onClick={onLogin} style={{width:50,height:50,borderRadius:14,background:'#1e1e3a',
                border:'1px solid #2d2d50',fontSize:22,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                {ic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
