/* Notes editor with browser persistence */
(() => {
  const $=id=>document.getElementById(id);
  const notes=()=>SH.state.notes;
  function open(note){
    $("noteEditor").classList.remove("hidden");$("noteEditorHeading").textContent=note?"Edit note":"New note";
    $("noteId").value=note?.id||"";$("noteTitle").value=note?.title||"";$("noteContent").value=note?.content||"";
    $("deleteNoteButton").style.visibility=note?"visible":"hidden";
    $("noteTitle").focus();
  }
  function close(){$("noteEditor").classList.add("hidden");$("noteForm").reset();$("noteId").value="";}
  function render(){
    const query=$("noteSearch").value.toLowerCase().trim();
    const found=notes().filter(n=>`${n.title} ${n.content}`.toLowerCase().includes(query));
    $("noteCount").textContent=`${notes().length} ${notes().length===1?"note":"notes"}`;
    $("notesGrid").innerHTML=found.length?found.map(n=>`<article class="note-card" data-note-open="${n.id}" tabindex="0" role="button" aria-label="Edit note ${SH.escape(n.title)}"><h3>${SH.escape(n.title)}</h3><p>${SH.escape(n.content)}</p><small>Updated ${new Date(n.updated).toLocaleDateString()}</small></article>`).join(""):`<div class="empty-state"><strong>${query?"No matching notes":"Your notes start here"}</strong>${query?"Try a different search.":"Create a note to keep important ideas close."}</div>`;
  }
  window.renderNotes=render;
  $("newNoteButton").addEventListener("click",()=>open());
  $("closeNoteEditor").addEventListener("click",close);
  $("noteSearch").addEventListener("input",render);
  $("noteForm").addEventListener("submit",event=>{
    event.preventDefault();
    const id=$("noteId").value, old=notes().find(n=>n.id===id);
    const note={id:id||SH.id(),title:$("noteTitle").value.trim(),content:$("noteContent").value.trim(),updated:new Date().toISOString()};
    if(id)SH.state.notes=notes().map(n=>n.id===id?note:n);else SH.state.notes.unshift(note);
    SH.save("notes");close();render();SH.toast(old?"Note updated":"Note saved");
  });
  $("deleteNoteButton").addEventListener("click",()=>{
    const id=$("noteId").value;if(!id)return;
    SH.state.notes=notes().filter(n=>n.id!==id);SH.save("notes");close();render();SH.toast("Note deleted");
  });
  document.addEventListener("click",event=>{const card=event.target.closest("[data-note-open]");if(card){const note=notes().find(n=>n.id===card.dataset.noteOpen);if(note)open(note);}});
  document.addEventListener("keydown",event=>{const card=event.target.closest("[data-note-open]");if(card&&(event.key==="Enter"||event.key===" ")){event.preventDefault();const note=notes().find(n=>n.id===card.dataset.noteOpen);if(note)open(note);}});
})();