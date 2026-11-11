/* Task creation, editing, filtering and dashboard preview */
(() => {
  const $ = id => document.getElementById(id);
  const tasks = () => SH.state.tasks;
  function openForm(task) {
    $("taskFormPanel").classList.remove("hidden");
    $("taskFormTitle").textContent = task ? "Edit task" : "Create a task";
    $("taskId").value = task?.id || "";
    $("taskTitle").value = task?.title || "";
    $("taskDue").value = task?.due || "";
    $("taskPriority").value = task?.priority || "medium";
    $("taskCategory").value = task?.category || "";
    $("taskFormPanel").scrollIntoView({ behavior:"smooth", block:"center" });
    $("taskTitle").focus();
  }
  function closeForm() { $("taskFormPanel").classList.add("hidden"); $("taskForm").reset(); $("taskId").value = ""; }
  function taskRow(task, compact = false) {
    const titleClass = task.done ? "task-title completed-text" : "task-title";
    const due = task.due ? SH.date(task.due) : "No deadline";
    if (compact) return `<div class="compact-task"><input class="task-check" type="checkbox" data-toggle="${task.id}" ${task.done?"checked":""} aria-label="Complete ${SH.escape(task.title)}"><div class="task-info"><div class="${titleClass}">${SH.escape(task.title)}</div><div class="task-meta">${SH.escape(task.category || "General")} · ${due}</div></div></div>`;
    return `<div class="full-task-row"><input class="task-check" type="checkbox" data-toggle="${task.id}" ${task.done?"checked":""} aria-label="Complete ${SH.escape(task.title)}"><div class="task-info"><div class="${titleClass}">${SH.escape(task.title)}</div><div class="task-meta">${SH.escape(task.category || "General")} · ${due}</div></div><span class="priority-pill priority-${task.priority}">${task.priority}</span><div class="row-actions"><button class="small-action" data-edit="${task.id}">Edit</button><button class="small-action" data-delete="${task.id}" aria-label="Delete task">Delete</button></div></div>`;
  }
  window.renderTasks = function() {
    const query = $("taskSearch").value.toLowerCase().trim();
    const filter = $("taskFilter").value, priority = $("priorityFilter").value;
    const filtered = tasks().filter(t => (filter==="all" || (filter==="active" && !t.done) || (filter==="completed" && t.done)) && (priority==="all" || t.priority===priority) && `${t.title} ${t.category}`.toLowerCase().includes(query));
    $("taskListTitle").textContent = filter === "active" ? "To do" : filter === "completed" ? "Completed tasks" : "All tasks";
    $("taskCountLabel").textContent = `${filtered.length} ${filtered.length===1?"task":"tasks"}`;
    $("taskList").innerHTML = filtered.length ? filtered.map(t => taskRow(t)).join("") : `<div class="empty-state"><strong>No tasks found</strong>${query?"Try another search.":"Add a task to get your study list started."}</div>`;
    $("taskNavCount").textContent = tasks().filter(t=>!t.done).length;
    $("dashboardTasks").innerHTML = tasks().filter(t=>!t.done).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999")).slice(0,4).map(t=>taskRow(t,true)).join("") || `<div class="empty-state"><strong>You're all caught up!</strong>Add a task whenever you're ready.</div>`;
    $("statCompleted").textContent = tasks().filter(t=>t.done).length;
    $("statRemaining").textContent = tasks().filter(t=>!t.done).length;
    const total = tasks().length, done = tasks().filter(t=>t.done).length, rate = total ? Math.round(done/total*100) : 0;
    $("statRate").textContent = `${rate}%`; $("donutPercent").textContent = `${rate}%`;
    $("progressDonut").style.background = `conic-gradient(var(--primary) ${rate*3.6}deg, #eeeff5 ${rate*3.6}deg)`;
    $("legendDone").textContent = done; $("legendLeft").textContent = total-done;
    $("completedHint").textContent = done ? "Nice work!" : "Start with one task";
    $("analyticsTotal").textContent = total; $("analyticsDone").textContent = done;
  };
  $("openTaskForm").addEventListener("click", () => openForm());
  $("closeTaskForm").addEventListener("click", closeForm);
  $("cancelTask").addEventListener("click", closeForm);
  $("taskForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("taskId").value;
    const item = { id: id || SH.id(), title:$("taskTitle").value.trim(), due:$("taskDue").value, priority:$("taskPriority").value, category:$("taskCategory").value.trim(), done:id ? tasks().find(t=>t.id===id)?.done || false : false };
    if (!item.title) return;
    if (id) SH.state.tasks = tasks().map(t=>t.id===id?item:t); else SH.state.tasks.unshift(item);
    SH.save("tasks"); closeForm(); SH.refresh(); SH.toast(id ? "Task updated" : "Task added");
  });
  document.addEventListener("click", event => {
    const edit = event.target.closest("[data-edit]"), del = event.target.closest("[data-delete]");
    if (edit) { const task = tasks().find(t=>t.id===edit.dataset.edit); if(task) openForm(task); }
    if (del) { SH.state.tasks = tasks().filter(t=>t.id!==del.dataset.delete); SH.save("tasks"); SH.refresh(); SH.toast("Task deleted"); }
  });
  document.addEventListener("change", event => {
    if (event.target.matches("[data-toggle]")) {
      const task = tasks().find(t=>t.id===event.target.dataset.toggle);
      if (task) { task.done = event.target.checked; SH.save("tasks"); SH.refresh(); SH.toast(task.done ? "Task completed — great work!" : "Task moved back to to do"); }
    }
  });
  ["taskSearch","taskFilter","priorityFilter"].forEach(id => $(id).addEventListener(id==="taskSearch"?"input":"change", renderTasks));
  window.renderDashboard = renderTasks;
})();