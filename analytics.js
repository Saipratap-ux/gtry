/* Analytics visualizations */
(() => {
  window.renderAnalytics = function(){
    const total=SH.state.tasks.length,done=SH.state.tasks.filter(t=>t.done).length,left=total-done;
    const max=Math.max(total,1);
    document.getElementById("chartCompleted").style.height=`${done/max*100}%`;
    document.getElementById("chartRemaining").style.height=`${left/max*100}%`;
    document.getElementById("analyticsTotal").textContent=total;
    document.getElementById("analyticsDone").textContent=done;
    document.getElementById("analyticsSessions").textContent=SH.state.sessions.length;
    document.getElementById("analyticsTodaySessions").textContent=SH.state.sessions.filter(s=>s.date===new Date().toISOString().slice(0,10)).length;
  };
})();