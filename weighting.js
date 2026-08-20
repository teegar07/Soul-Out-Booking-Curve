const BOOKING_WEIGHTS={"Vol.2":0.25,"Vol.3":0.25,"Vol.4":0.25,"Vol.5":0.25,"Vol.7":0.25,"Vol.8":0.5,"X Bar 24":0,"Vol.9":2,"Vol.10":2.5};
baselineAt=function(d){
  if(d<=1)return 1;
  const values=HISTORY.map(e=>({v:valueAt(e.curve,d),w:BOOKING_WEIGHTS[e.name]??1})).filter(x=>x.v!=null&&x.w>0);
  if(!values.length)return null;
  const weightSum=values.reduce((s,x)=>s+x.w,0);
  return values.reduce((s,x)=>s+x.v*x.w,0)/weightSum;
};
if(typeof update==='function')update();
if(typeof renderBookingTable==='function')renderBookingTable();
