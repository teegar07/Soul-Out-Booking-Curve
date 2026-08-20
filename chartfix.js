drawChart=function(presaleTarget,current,dNow){
  const c=bookingChart,ctx=c.getContext('2d'),W=c.width,H=c.height,p={l:58,r:24,t:25,b:48};
  const targetAttendance=Number(document.getElementById('attendanceTarget').value)||160;
  ctx.clearRect(0,0,W,H);
  const maxY=Math.max(targetAttendance*1.08,current*1.2,10);
  const x=d=>p.l+(35-d)/35*(W-p.l-p.r),y=v=>H-p.b-v/maxY*(H-p.t-p.b);
  ctx.font='12px system-ui';ctx.strokeStyle='#29292c';ctx.fillStyle='#77777a';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const v=maxY*i/4,yy=y(v);ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(W-p.r,yy);ctx.stroke();ctx.fillText(fmt(v),8,yy+4)}
  [35,28,21,14,7,1,0].forEach(d=>ctx.fillText(d===0?'活動日':`D-${d}`,x(d)-(d===0?14:10),H-18));
  const series=[];
  for(let d=35;d>=1;d--){const b=baselineAt(d);if(b!=null)series.push([d,b*presaleTarget])}
  series.push([0,targetAttendance]);
  ctx.strokeStyle='#d0b06d';ctx.lineWidth=4;ctx.beginPath();series.forEach(([d,v],i)=>i?ctx.lineTo(x(d),y(v)):ctx.moveTo(x(d),y(v)));ctx.stroke();
  ctx.fillStyle='#f4f4f2';ctx.beginPath();ctx.arc(x(Math.min(35,dNow)),y(current),7,0,Math.PI*2);ctx.fill();
};
if(typeof update==='function')update();