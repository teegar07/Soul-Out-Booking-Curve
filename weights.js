// Recent events better reflect the current ticketing behavior, so they receive more weight.
// Older Google Form-era events remain useful context without dominating the forecast.
const BOOKING_WEIGHTS={
  'Vol.2':0.5,
  'Vol.3':0.5,
  'Vol.4':0.5,
  'Vol.5':0.5,
  'Vol.7':0.75,
  'Vol.8':1.0,
  'X Bar 24':1.25,
  'Vol.9':2.0,
  'Vol.10':2.5
};

baselineAt=function(d){
  const points=HISTORY.map(event=>({
    value:valueAt(event.curve,d),
    weight:BOOKING_WEIGHTS[event.name]??1
  })).filter(point=>point.value!=null);
  if(!points.length)return null;
  const weightSum=points.reduce((sum,point)=>sum+point.weight,0);
  return points.reduce((sum,point)=>sum+point.value*point.weight,0)/weightSum;
};

// app.js renders once before this override is loaded; refresh the dashboard with the weighted baseline.
update();
if(typeof renderBookingTable==='function')renderBookingTable();
