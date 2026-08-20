function localToday(){
  const now=new Date();
  const y=now.getFullYear();
  const m=String(now.getMonth()+1).padStart(2,'0');
  const d=String(now.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

// Tracking is a live dashboard: always start from today's local date,
// rather than restoring yesterday's saved tracking date.
const trackingDate=document.getElementById('asOfDate');
if(trackingDate){
  trackingDate.value=localToday();
  update();
  if(typeof renderBookingTable==='function') renderBookingTable();
}
