// Editor inline compartilhado — CMS e WebBuilder
// Define window.WB_EDITOR_SRC: IIFE injetada no iframe do preview
window.WB_EDITOR_SRC = `
(function(){
if(window.parent===window)return;
var activeEl=null,activeOverlay=null,hoverChip=null;

function escHTML(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function closeEditor(){
  if(activeEl){activeEl.classList.remove("wb-editing");activeEl=null;}
  if(activeOverlay){activeOverlay.remove();activeOverlay=null;}
  hideChip();
}
function getEditableText(el){
  var clone=el.cloneNode(true);
  var svgs=clone.querySelectorAll("svg");for(var i=0;i<svgs.length;i++)svgs[i].remove();
  var scripts=clone.querySelectorAll("script");for(var i=0;i<scripts.length;i++)scripts[i].remove();
  var styles=clone.querySelectorAll("style");for(var i=0;i<styles.length;i++)styles[i].remove();
  return clone.textContent.replace(/ /g," ").trim();
}
function positionPopup(p,r){
  var t=r.bottom+8,l=Math.max(8,r.left);
  if(t+220>window.innerHeight)t=r.top-220;
  if(l+290>window.innerWidth)l=window.innerWidth-300;
  return{top:t,left:l};
}

// ── Chip ✏️ no hover ──
function showChip(el){
  hideChip();
  var r=el.getBoundingClientRect();
  var chip=document.createElement("div");
  chip.className="wb-edit-chip";
  chip.textContent="✏️";
  chip.style.cssText="position:fixed;z-index:99998;top:"+(r.top-6)+"px;left:"+(r.right-4)+"px;"
    +"background:#4C43F7;color:#fff;font-size:11px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;"
    +"border-radius:50%;pointer-events:none;box-shadow:0 2px 8px rgba(76,67,247,.5);";
  document.body.appendChild(chip);
  hoverChip=chip;
}
function hideChip(){if(hoverChip){hoverChip.remove();hoverChip=null;}}

// ── Sinalizador fixo de editabilidade no canto ──
function addEditBadge(el){
  if(el.querySelector(".wb-edit-badge"))return;
  if(window.getComputedStyle(el).display==="none")return;
  if(el.offsetHeight===0)return;
  var badge=document.createElement("span");
  badge.className="wb-edit-badge";
  badge.innerHTML="&#9998;";
  badge.title="Clique para editar";
  el.style.position=el.style.position||"relative";
  el.appendChild(badge);
}
function removeEditBadge(el){
  var b=el.querySelector(".wb-edit-badge");
  if(b)b.remove();
}

// ── Editor de Texto ──
function openTextEditor(el,key){
  var r=el.getBoundingClientRect();
  var v=getEditableText(el);
  el.classList.add("wb-editing");activeEl=el;hideChip();
  var p=document.createElement("div");p.className="wb-editor-popup";
  var lb=key.replace(/-/g," ").replace(/\b\w/g,function(c){return c.toUpperCase();});
  p.innerHTML='<div class="wb-field-label">📝 '+lb+'</div>'
    +'<textarea id="wb-inline-ta" rows="2">'+escHTML(v)+'</textarea>'
    +'<div class="wb-actions">'
    +'<button class="wb-btn-apply">✅ Aplicar</button>'
    +'<button class="wb-btn-cancel">Cancelar</button>'
    +'</div>';
  document.body.appendChild(p);activeOverlay=p;
  var pos=positionPopup(p,r);p.style.top=pos.top+"px";p.style.left=pos.left+"px";
  var ta=p.querySelector("textarea");
  function autoResize(){ta.style.height="auto";ta.style.height=Math.min(ta.scrollHeight,260)+"px";}
  ta.addEventListener("input",autoResize);
  autoResize();
  ta.focus();ta.select();
  p.querySelector(".wb-btn-apply").onclick=function(){
    var key2=activeEl.getAttribute("data-editable-text")||activeEl.getAttribute("data-editable");
    var ta2=document.getElementById("wb-inline-ta");
    window.parent.postMessage({type:"wb-edit-text",key:key2,value:ta2?ta2.value:""},"*");
    closeEditor();
  };
  p.querySelector(".wb-btn-cancel").onclick=function(){closeEditor();};
  ta.addEventListener("keydown",function(ev){
    if(ev.key==="Enter"&&!ev.shiftKey&&!ev.ctrlKey){ev.preventDefault();p.querySelector(".wb-btn-apply").click();}
    if(ev.key==="Enter"&&ev.ctrlKey){ev.preventDefault();var t=ev.target;var s=t.selectionStart;t.value=t.value.slice(0,s)+"\\n"+t.value.slice(t.selectionEnd);t.selectionStart=t.selectionEnd=s+1;autoResize();}
    if(ev.key==="Escape"){ev.preventDefault();closeEditor();}
  });
}

// ── Editor de Imagem ──
function openImageEditor(el,key){
  var r=el.getBoundingClientRect();var src=el.getAttribute("src")||"";
  el.classList.add("wb-editing");activeEl=el;hideChip();
  var p=document.createElement("div");p.className="wb-editor-popup";
  var lb=key.replace(/-/g," ").replace(/\b\w/g,function(c){return c.toUpperCase();});
  p.innerHTML='<div class="wb-field-label">🖼️ '+lb+'</div>'
    +(src&&!src.startsWith("data:image/svg")?'<img src="'+escHTML(src)+'" class="wb-img-preview-thumb">':'')
    +'<div class="wb-actions">'
    +'<button class="wb-btn-img">📁 Alterar Imagem</button>'
    +'<button class="wb-btn-cancel">Cancelar</button>'
    +'</div>';
  document.body.appendChild(p);activeOverlay=p;
  var pos=positionPopup(p,r);p.style.top=pos.top+"px";p.style.left=pos.left+"px";
  p.querySelector(".wb-btn-img").onclick=function(){
    var key2=activeEl.getAttribute("data-editable");
    window.parent.postMessage({type:"wb-edit-image",key:key2},"*");
    closeEditor();
  };
  p.querySelector(".wb-btn-cancel").onclick=function(){closeEditor();};
}

// ── Estilos ──
var style=document.createElement("style");
style.textContent=""
  +".wb-hover{outline:2px dashed #4C43F7!important;outline-offset:3px!important;cursor:pointer!important;transition:outline .15s}"
  +".wb-hover-img{outline:2px dashed #56D9DF!important;cursor:pointer!important}"
  +".wb-editing{outline:2px solid #6359FF!important;outline-offset:3px!important;position:relative;z-index:99}"
  +".wb-edit-badge{position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:#4C43F7;color:#fff;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:90;opacity:0;transition:opacity .15s;box-shadow:0 1px 4px rgba(76,67,247,.4)}"
  +".wb-hover .wb-edit-badge,.wb-hover-img .wb-edit-badge{opacity:1}"
  +".wb-editor-popup{position:fixed;z-index:99999;background:#1a1f2e;border:1px solid #4C43F7;border-radius:12px;padding:12px;min-width:280px;max-width:340px;box-shadow:0 16px 48px rgba(0,0,0,.6);font-family:Inter,system-ui,sans-serif;font-size:12px}"
  +".wb-editor-popup textarea{width:100%;min-height:52px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;padding:10px;font-size:13px;font-family:inherit;resize:none;outline:none;line-height:1.5;overflow-y:auto}"
  +".wb-editor-popup textarea:focus{border-color:#4C43F7}"
  +".wb-editor-popup .wb-actions{display:flex;gap:6px;margin-top:8px}"
  +".wb-editor-popup button{padding:6px 14px;border-radius:20px;border:none;cursor:pointer;font-size:11px;font-weight:600;font-family:inherit;transition:all .15s}"
  +".wb-btn-apply{background:#4C43F7;color:#fff}.wb-btn-apply:hover{background:#6359FF}"
  +".wb-btn-cancel{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7)}.wb-btn-cancel:hover{background:rgba(255,255,255,.15)}"
  +".wb-btn-img{background:#56D9DF;color:#000}.wb-btn-img:hover{background:#6FE5EB}"
  +".wb-img-preview-thumb{max-width:100%;max-height:120px;border-radius:8px;margin-bottom:8px;border:1px solid rgba(255,255,255,.1);object-fit:contain;background:rgba(0,0,0,.3)}"
  +".wb-field-label{font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}"
  +"";
document.head.appendChild(style);

// ── Adiciona badges de edição nos elementos editáveis ──
function addAllBadges(){
  // data-editable-text
  document.querySelectorAll("[data-editable-text]").forEach(function(el){
    if(window.getComputedStyle(el).display!=="none"&&el.offsetHeight>0)addEditBadge(el);
  });
  // img[data-editable]
  document.querySelectorAll("img[data-editable]").forEach(function(el){
    if(el.offsetHeight>0)addEditBadge(el);
  });
  // [data-editable] com texto (não IMG, não escondido)
  document.querySelectorAll("[data-editable]").forEach(function(el){
    if(el.tagName==="IMG")return;
    if(window.getComputedStyle(el).display==="none"||el.offsetHeight===0)return;
    var txt=getEditableText(el);
    if(txt||el.tagName==="A")addEditBadge(el);
  });
}
setTimeout(addAllBadges,300);

// ── Eventos de Hover ──
document.addEventListener("mouseover",function(e){
  var tel=e.target.closest("[data-editable-text]");
  if(tel){tel.classList.add("wb-hover");showChip(tel);return;}
  var iel=e.target.closest("img[data-editable]");
  if(iel){iel.classList.add("wb-hover-img");showChip(iel);return;}
  var dl=e.target.closest("[data-editable]");
  if(dl&&dl.tagName!=="IMG"){
    var txt=getEditableText(dl);
    if(txt||dl.tagName==="A"){dl.classList.add("wb-hover");showChip(dl);}
  }
});
document.addEventListener("mouseout",function(e){
  var tel=e.target.closest("[data-editable-text]");
  if(tel){tel.classList.remove("wb-hover");hideChip();return;}
  var iel=e.target.closest("img[data-editable]");
  if(iel){iel.classList.remove("wb-hover-img");hideChip();return;}
  var dl=e.target.closest("[data-editable]");
  if(dl){dl.classList.remove("wb-hover");hideChip();}
});

// ── Eventos de Click ──
document.addEventListener("click",function(e){
  if(e.target.closest(".wb-editor-popup"))return;
  closeEditor();
  var tel=e.target.closest("[data-editable-text]");
  if(tel){e.preventDefault();e.stopPropagation();openTextEditor(tel,tel.getAttribute("data-editable-text"));return;}
  var iel=e.target.closest("img[data-editable]");
  if(iel){e.preventDefault();e.stopPropagation();openImageEditor(iel,iel.getAttribute("data-editable"));return;}
  var dl=e.target.closest("[data-editable]");
  if(dl&&dl.tagName!=="IMG"){
    var txt=getEditableText(dl);
    if(txt||(dl.tagName==="A"&&!dl.getAttribute("data-editable-text"))){
      e.preventDefault();e.stopPropagation();
      openTextEditor(dl,dl.getAttribute("data-editable"));
      return;
    }
  }
  // Intercepta navegação de links
  var linkEl=e.target.closest("a[href]");
  if(linkEl&&linkEl.getAttribute("href")!=="#"){e.preventDefault();e.stopPropagation();}
});
document.addEventListener("click",function(e){
  if(!e.target.closest(".wb-editor-popup")&&!e.target.closest("[data-editable]")&&!e.target.closest("[data-editable-text]"))closeEditor();
});

// ── Refresh in-place (mensagens do parent) ──
window.addEventListener("message",function(e){
  if(!e.data||!e.data.type)return;
  if(e.data.type==="wb-refresh-text"){
    var els=document.querySelectorAll('[data-editable-text="'+e.data.key+'"]');
    if(els.length){
      for(var i=0;i<els.length;i++){
        if(els[i].tagName==="INPUT"||els[i].tagName==="TEXTAREA"){els[i].value=e.data.value;}
        else{els[i].textContent=e.data.value;}
      }
    }else{
      var el=document.querySelector('[data-editable="'+e.data.key+'"]');
      if(el){
        if(el.tagName==="INPUT"||el.tagName==="TEXTAREA"){el.value=e.data.value;}
        else if(el.tagName==="TITLE"||el.tagName==="META"){el.setAttribute("content",e.data.value);}
        else{el.textContent=e.data.value;}
      }
    }
    // Re-adiciona badges após atualizar texto
    setTimeout(addAllBadges,200);
  }
  if(e.data.type==="wb-refresh-img"){
    var el=document.querySelector('img[data-editable="'+e.data.key+'"]');
    if(el){el.setAttribute("src",e.data.value);}
  }
});
})();
`;
