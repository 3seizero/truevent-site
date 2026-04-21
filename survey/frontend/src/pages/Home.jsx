export default function Home() {
  return (
    <div className="success-page">
      <div style={{fontSize:'clamp(48px, 12vw, 96px)', fontFamily:"'Roboto', sans-serif", fontWeight:900, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--white)'}}>TRUE</div>
      <div style={{display:'flex', alignItems:'center', gap:'16px', margin:'20px 0'}}>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to right, transparent, var(--gold))'}}/>
        <div style={{width:'6px', height:'6px', background:'var(--gold)', transform:'rotate(45deg)'}}/>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to left, transparent, var(--gold))'}}/>
      </div>
      <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'13px', letterSpacing:'.32em', textTransform:'uppercase', color:'rgba(245,240,232,.5)', fontWeight:400}}>Survey Platform</div>
    </div>
  )
}
