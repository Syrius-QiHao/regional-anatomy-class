(function(root){
  'use strict';
  const data=root.SOURCE_YEAR_DATA||{sources:{},questions:{}};
  const escape=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const excluded=id=>/^ATL0[123]$/.test(String(id||''))||/奈特|Netter/i.test(String(id||''));
  const aliases=new Map();
  Object.entries(data.sources).forEach(([id,s])=>[id,s.name,...s.aliases||[]].filter(Boolean).forEach(k=>aliases.set(k,{...s,id})));
  function record(id){return excluded(id)?null:aliases.get(id);}
  function label(id){if(excluded(id))return '';return record(id)?.label||'资料年份未注明';}
  function tag(text,note){return text?'<span class="source-year"'+(note?' title="'+escape(note)+'"':'')+'>'+escape(text)+'</span>':'';}
  function source(id){const s=record(id);return tag(label(id),s?.note||'');}
  function matches(text){
    text=String(text||'');const found=new Map();
    aliases.forEach((s,key)=>{
      const idToken=/^[A-Z]+\d+$/.test(key);
      const hit=idToken?new RegExp('(^|[^A-Za-z0-9])'+key+'(?![A-Za-z0-9])').test(text):text.includes(key);
      if(hit&&!excluded(s.id))found.set(s.id,s);
    });
    return [...found.values()];
  }
  function citation(text){return matches(text).map(s=>source(s.id)).join('');}
  function question(q,collection){
    const s=data.questions[(collection?collection+':':'')+q.id]||data.questions[q.id];
    let text=s?.label||'题目年份未注明';
    if(s?.examYear)text='考试：'+s.examYear+'年'+(s.cohort?' · '+s.cohort:'');
    return '<div class="question-year">'+tag(text,s?.note||'')+'</div>';
  }
  root.SourceYears={source,label,citation,question,record,matches,excluded};
})(typeof window!=='undefined'?window:globalThis);
