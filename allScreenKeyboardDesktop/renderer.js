

//ARRAY NEEDS TO BE REFINED AND MADE MODULAR
layout = [
    {section:'main',row:0,col:0, span:1, code:'S1', label:'S1', softCode:24},
  {section:'main',row:0,col:1, span:1, code:'S2',     label:'S2', softCode:25},
  {section:'main',row:0,col:2, span:1, code:'S3',     label:'S3', softCode:26},
  {section:'main',row:0,col:3, span:1, code:'S4',     label:'S4', softCode:27},
  {section:'main',row:0,col:4, span:1, code:'S5',     label:'S5', softCode:48},
  {section:'main',row:0,col:5, span:1, code:'S6',     label:'S6', softCode:49},
  {section:'main',row:0,col:6, span:1, code:'S7',     label:'S7', softCode:50},
  {section:'main',row:0,col:7, span:1, code:'S8',     label:'S8', softCode:54},
  /* ========== MAIN BLOCK (15‑col × 5‑row) =========================== */
  // Row 0 – Function row
  {section:'main',row:1,col:0, span:1, code:'Escape', label:'Esc', softCode:0},
  {section:'main',row:1,col:1, span:1, code:'F1',     label:'F1', softCode:28},
  {section:'main',row:1,col:2, span:1, code:'F2',     label:'F2', softCode:29},
  {section:'main',row:1,col:3, span:1, code:'F3',     label:'F3', softCode:30},
  {section:'main',row:1,col:4, span:1, code:'F4',     label:'F4', softCode:31},
  {section:'main',row:1,col:5, span:1, code:'F5',     label:'F5', softCode:51},
  {section:'main',row:1,col:6, span:1, code:'F6',     label:'F6', softCode:52},
  {section:'main',row:1,col:7, span:1, code:'F7',     label:'F7', softCode:53},
  {section:'main',row:1,col:8, span:1, code:'F8',     label:'F8', softCode:55},
  {section:'main',row:1,col:9, span:1, code:'F9',     label:'F9', softCode:64},
  {section:'main',row:1,col:10,span:1, code:'F10',    label:'F10', softCode:65},
  {section:'main',row:1,col:11,span:1, code:'F11',    label:'F11', softCode:80},
  {section:'main',row:1,col:12,span:1, code:'F12',    label:'F12', softCode:81},

  // Row 1 – Number row
  {section:'main',row:2,col:0, span:1, code:'Backquote', label:'~\\n`', softCode:1},
  {section:'main',row:2,col:1, span:1, code:'Digit1',    label:'!\\n1', softCode:8},
  {section:'main',row:2,col:2, span:1, code:'Digit2',    label:'@\\n2', softCode:16},
  {section:'main',row:2,col:3, span:1, code:'Digit3',    label:'#\\n3', softCode:17},
  {section:'main',row:2,col:4, span:1, code:'Digit4',    label:'$\\n4', softCode:18},
  {section:'main',row:2,col:5, span:1, code:'Digit5',    label:'%\\n5', softCode:32},
  {section:'main',row:2,col:6, span:1, code:'Digit6',    label:'^\\n6', softCode:33},
  {section:'main',row:2,col:7, span:1, code:'Digit7',    label:'&\\n7', softCode:40},
  {section:'main',row:2,col:8, span:1, code:'Digit8',    label:'*\\n8', softCode:41},
  {section:'main',row:2,col:9, span:1, code:'Digit9',    label:'(\\n9', softCode:56},
  {section:'main',row:2,col:10,span:1, code:'Digit0',    label:')\\n0', softCode:57},
  {section:'main',row:2,col:11,span:1, code:'Minus',     label:'_\\n-', softCode:66},
  {section:'main',row:2,col:12,span:1, code:'Equal',     label:'+\\n=', softCode:67},
  {section:'main',row:2,col:13,span:2, code:'Backspace', label:'⌫', softCode:68},

  // Row 2 – Q row
  {section:'main',row:3,col:0, span:2,  code:'Tab',         label:'Tab', softCode:2},
  {section:'main',row:3,col:2, span:1,  code:'KeyQ',        label:'Q', softCode:9},
  {section:'main',row:3,col:3, span:1,  code:'KeyW',        label:'W', softCode:10},
  {section:'main',row:3,col:4, span:1,  code:'KeyE',        label:'E', softCode:19},
  {section:'main',row:3,col:5, span:1,  code:'KeyR',        label:'R', softCode:20},
  {section:'main',row:3,col:6, span:1,  code:'KeyT',        label:'T', softCode:34},
  {section:'main',row:3,col:7, span:1,  code:'KeyY',        label:'Y', softCode:35},
  {section:'main',row:3,col:8, span:1,  code:'KeyU',        label:'U', softCode:42},
  {section:'main',row:3,col:9, span:1,  code:'KeyI',        label:'I', softCode:43},
  {section:'main',row:3,col:10,span:1,  code:'KeyO',        label:'O', softCode:58},
  {section:'main',row:3,col:11,span:1,  code:'KeyP',        label:'P', softCode:59},
  {section:'main',row:3,col:12,span:1,  code:'BracketLeft', label:'{\\n[', softCode:72},
  {section:'main',row:3,col:13,span:1,  code:'BracketRight',label:'}\\n]', softCode:69},
  {section:'main',row:3,col:14,span:1,  code:'Backslash',   label:'|\\n\\\\', softCode:70},

  // Row 3 – A row
  {section:'main',row:4,col:0, span:3, code:'CapsLock', label:'Caps', softCode:3},
  {section:'main',row:4,col:2.25, span:1, code:'KeyA',     label:'A', softCode:11},
  {section:'main',row:4,col:3.25, span:1, code:'KeyS',     label:'S', softCode:12},
  {section:'main',row:4,col:4.25, span:1, code:'KeyD',     label:'D', softCode:21},
  {section:'main',row:4,col:5.25, span:1, code:'KeyF',     label:'F', softCode:22},
  {section:'main',row:4,col:6.25, span:1, code:'KeyG',     label:'G', softCode:36},
  {section:'main',row:4,col:7.25, span:1, code:'KeyH',     label:'H', softCode:37},
  {section:'main',row:4,col:8.25, span:1, code:'KeyJ',     label:'J', softCode:44},
  {section:'main',row:4,col:9.25, span:1, code:'KeyK',     label:'K', softCode:45},
  {section:'main',row:4,col:10.25,span:1, code:'KeyL',     label:'L', softCode:60},
  {section:'main',row:4,col:11.25,span:1, code:'Semicolon',label:':\\n;', softCode:61},
  {section:'main',row:4,col:12.25,span:1, code:'Quote',    label:'\"\\n\'', softCode:73},
  {section:'main',row:4,col:13.25,span:1.75, code:'Enter', label:'⏎', softCode:71},

  // Row 4 – Z row
  {section:'main',row:5,col:0, span:3, code:'ShiftLeft',  label:'Shift', softCode:4},
  {section:'main',row:5,col:2.25, span:1, code:'KeyZ',       label:'Z', softCode:13},
  {section:'main',row:5,col:3.25, span:1, code:'KeyX',       label:'X', softCode:14},
  {section:'main',row:5,col:4.25, span:1, code:'KeyC',       label:'C', softCode:23},
  {section:'main',row:5,col:5.25, span:1, code:'KeyV',       label:'V', softCode:38},
  {section:'main',row:5,col:6.25, span:1, code:'KeyB',       label:'B', softCode:39},
  {section:'main',row:5,col:7.25, span:1, code:'KeyN',       label:'N', softCode:46},
  {section:'main',row:5,col:8.25, span:1, code:'KeyM',       label:'M', softCode:47},
  {section:'main',row:5,col:9.25, span:1, code:'Comma',      label:'<\\n,', softCode:62},
  {section:'main',row:5,col:10.25,span:1, code:'Period',     label:'>\\n.', softCode:63},
  {section:'main',row:5,col:11.25,span:1, code:'Slash',      label:'?\\n/', softCode:74},
  {section:'main',row:5,col:12.25,span:3.75, code:'ShiftRight', label:'Shift', softCode:75},

  // Space row (row 5)
  {section:'main',row:6,col:0, span:1., code:'ControlLeft', label:'Ctrl', softCode:5},
  {section:'main',row:6,col:1, span:1, code:'MetaLeft',  label:'Win', softCode:6},
  {section:'main',row:6,col:2, span:1, code:'AltLeft',    label:'Alt', softCode:7},
  {section:'main',row:6,col:3, span:7, code:'Space',     label:'', softCode:15},
  {section:'main',row:6,col:10, span:1, code:'AltRight',    label:'Alt', softCode:76},
  {section:'main',row:6,col:11,span:1, code:'MetaRight', label:'Win', softCode:77},
  {section:'main',row:6,col:12, span:1., code:'ContextMenu',label:'Menu', softCode:78},
  {section:'main',row:6,col:13,span:1, code:'ControlRight',label:'Ctrl', softCode:79},

  /* ========== NAVIGATION (3‑col grid) =============================== */
  // Row 0
  {section:'nav',row:1,col:0, span:1, code:'PrintScreen', label:'PrtSc', softCode:88},
  {section:'nav',row:1,col:1, span:1, code:'ScrollLock',  label:'ScrLk', softCode:89},
  {section:'nav',row:1,col:2, span:1, code:'Pause',       label:'Pause', softCode:90},
  // Row 1
  {section:'nav',row:2,col:0, span:1, code:'Insert', label:'Ins', softCode:82},
  {section:'nav',row:2,col:1, span:1, code:'Home',   label:'Home', softCode:91},
  {section:'nav',row:2,col:2, span:1, code:'PageUp', label:'PgUp', softCode:92},
  // Row 2
  {section:'nav',row:3,col:0, span:1, code:'Delete', label:'Del', softCode:83},
  {section:'nav',row:3,col:1, span:1, code:'End',    label:'End', softCode:93},
  {section:'nav',row:3,col:2, span:1, code:'PageDown',label:'PgDn', softCode:94},
  // Arrow cluster (rows 3‑4)
  {section:'nav',row:4,col:1, span:1, code:'ArrowUp',   label:'↑', softCode:84},
  {section:'nav',row:5,col:0, span:1, code:'ArrowLeft', label:'←', softCode:85},
  {section:'nav',row:5,col:1, span:1, code:'ArrowDown', label:'↓', softCode:86},
  {section:'nav',row:5,col:2, span:1, code:'ArrowRight',label:'→', softCode:87},

  /* ========== NUMPAD (4‑col grid) =================================== */
  // Row 0
  {section:'num',row:1,col:0, span:1, code:'NumLock',        label:'Num', softCode:95},
  {section:'num',row:1,col:1, span:1, code:'NumpadDivide',   label:'/', softCode:96},
  {section:'num',row:1,col:2, span:1, code:'NumpadMultiply', label:'*', softCode:104},
  {section:'num',row:1,col:3, span:1, code:'NumpadSubtract', label:'-', softCode:109},
  // Row 1
  {section:'num',row:2,col:0, span:1, code:'Numpad7', label:'7', softCode:97},
  {section:'num',row:2,col:1, span:1, code:'Numpad8', label:'8', softCode:98},
  {section:'num',row:2,col:2, span:1, code:'Numpad9', label:'9', softCode:105},
  {section:'num',row:2,col:3, span:1, code:'NumpadAdd', label:'+', softCode:110, height:2},   // will span two rows in CSS
  // Row 2
  {section:'num',row:3,col:0, span:1, code:'Numpad4', label:'4', softCode:99},
  {section:'num',row:3,col:1, span:1, code:'Numpad5', label:'5', softCode:100},
  {section:'num',row:3,col:2, span:1, code:'Numpad6', label:'6', softCode:106},
  // Row 3
  {section:'num',row:4,col:0, span:1, code:'Numpad1', label:'1', softCode:101},
  {section:'num',row:4,col:1, span:1, code:'Numpad2', label:'2', softCode:102},
  {section:'num',row:4,col:2, span:1, code:'Numpad3', label:'3', softCode:107},
  {section:'num',row:5,col:3, span:1, code:'NumpadEnter', label:'⏎', softCode:111, height:2}, // spans two rows
  // Row 4
  {section:'num',row:5,col:0, span:2, code:'Numpad0', label:'0', softCode:103},
  {section:'num',row:5,col:2, span:1, code:'NumpadDecimal', label:'.', softCode:24108}
];


let activeCode;
let activeHeight;
let activeSpan;

function contoursToSVGPath(contours) {
  let path = '';

  contours.forEach(contour => {
    if (contour.length === 0) return;
    let first = contour[0];
    path += `M${first.x} ${first.y}`;

    for (let i = 1; i < contour.length; i++) {
      let pt = contour[i];
      if (pt.onCurve) {
        path += ` L${pt.x} ${pt.y}`;
      } else {
        const next = contour[i + 1] || contour[0];
        if (next.onCurve) {
          path += ` Q${pt.x} ${pt.y} ${next.x} ${next.y}`;
          i++;
        } else {
          const midX = (pt.x + next.x) / 2;
          const midY = (pt.y + next.y) / 2;
          path += ` Q${pt.x} ${pt.y} ${midX} ${midY}`;
        }
      }
    }

    path += ' Z';
  });

  return path;
}

// Normalize glyph contours to fit inside 900x900 box with margin
function normalizeContours(contours, glyph) {
  const xMin = glyph.xMin ?? 0;
  const yMin = glyph.yMin ?? 0;
  const xMax = glyph.xMax ?? 1000;
  const yMax = glyph.yMax ?? 1000;

  const vbWidth = xMax - xMin;
  const vbHeight = yMax - yMin;
  const maxDim = Math.max(vbWidth, vbHeight);
  const scale = 900 / maxDim; // scale to fit inside 900x900 box
  const offsetX = -xMin;
  const offsetY = -yMin;

  return contours.map(contour =>
    contour.map(pt => ({
      x: (pt.x + offsetX) * scale + 50, // add 50 margin
      y: (pt.y + offsetY) * scale + 50,
      onCurve: pt.onCurve,
    }))
  );
}

async function getGlyphs() {
  console.log('Renderer: getGlyphs called');
  try {
    const glyphs = await window.fontAPI.getGlyphs();
    console.log(`Renderer: received ${glyphs.length} glyphs`);
    renderGlyphs(glyphs);
  } catch (err) {
    console.error('Renderer: Failed to get glyphs:', err);
  }
}

async function changePage(page){
  console.log("changing",page)
    try {
      console.log("inside try",page)
    await window.pageApi.changePage(page);
  } catch (err) {
    console.error('Renderer: Failed to change page:', err);
  }
}

async function setActiveKey(key){
    try {
      console.log("inside try",key)
    await window.keyApi.setActiveKey(key);
  } catch (err) {
    console.error('Renderer: Failed to set key:', err);
  }
}

 function renderGlyphs(glyphs) {
  console.log('Renderer: Starting to render glyphs');
  const svgNS = "http://www.w3.org/2000/svg";

  glyphs.forEach(async(glyph, i) => {
    
    //  if(glyph.name!="A") return
    if (!glyph.contours || glyph.contours.length === 0) {
      console.log(`Renderer: Skipping glyph ${glyph.name || '?'}, no contours`);
      return;
    }
     console.log(glyph.name)
    console.log(`Renderer: Rendering glyph ${glyph.name || '?'} (index ${i}) with ${glyph.contours.length} contours`);

    const container = document.createElement('div');
    container.className = 'glyph-container';

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.setAttribute('width', '64');
    svg.setAttribute('height', '64');
    svg.style.border = '1px solid #666'; // Debug border

    const normalizedContours = normalizeContours(glyph.contours, glyph);
    const d = contoursToSVGPath(normalizedContours);

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'white');

    // Create group <g> to flip vertically inside SVG
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', 'scale(1, -1) translate(0, -1000)');
    g.appendChild(path);

    svg.appendChild(g);

    let res = await sendSvg(svg,glyph.name);
    if(res=="break")return;

  });

  console.log('Renderer: Finished rendering glyphs');
}

window.getGlyphs = getGlyphs; // expose for button onclick
window.changePage = changePage; // expose for button onclick
window.setActiveKey = setActiveKey; // expose for button onclick
const sections = {
  main: document.getElementById('main-block'),
  nav:  document.getElementById('nav-block'),
  num:  document.getElementById('numpad-block')
};

function buildKey(key) {
  const k = { ...key };
  const el = document.createElement('button');
  if(el==null)return
  el.className = 'kb-key';
  el.dataset.code = k.code;
  el.style.width=96*k.span
  el.style.height=96*k.span
  el.setAttribute("data-placement","top")
  el.setAttribute("data-toggle","tooltip")
  el.setAttribute("title",k.code)
  el.setAttribute("code",k.softCode)
  el.addEventListener("click",async ()=>{
    await setActiveKey(k)

    changePage("keyCanvas")
  })
  // Grid placement
  el.style.gridColumn = `${k.col + 1} / span ${k.span}`;
  el.style.gridRow    =  k.row + 1;

  return el;
}



/**
 * Export the visible editing canvas at a smaller scale.
 *
 * @param {HTMLCanvasElement} srcCanvas  – the big editing canvas
 * @param {Number} realW                 – width of the final image in px
 * @param {Number} realH                 – height of the final image in px
 * @param {String} filename              – file name to save on disk
 */
async function exportScaled(srcCanvas, realW, realH, filename = 'output.png') {

  let key = await getActiveKey()
  // 1. Create an off‑screen canvas at the *target* resolution
  const exportCanvas        = document.createElement('canvas');
  exportCanvas.width        = realW;
  exportCanvas.height       = realH;
  const exportCtx           = exportCanvas.getContext('2d');

  // 2. High‑quality down‑scaling (optional, but helps text & lines)
  exportCtx.imageSmoothingEnabled       = true;
  exportCtx.imageSmoothingQuality       = 'high';

  // 3. Draw the big canvas onto the small canvas (this does the scaling)
  exportCtx.drawImage(srcCanvas, 0, 0, realW, realH);

  // 4. Convert to PNG base64 (or use toBlob for large files)
  const dataURL   = exportCanvas.toDataURL('image/png');
  const base64PNG = dataURL.replace(/^data:image\/png;base64,/, '');

  // 5. Hand over to main process
  const res = await window.profileApi.savePng({ base64: base64PNG, filename:key.code+".png" });

  if (res.ok) console.log('Saved to', res.path);
  else        console.error('Save failed:', res.error);



}


async function sendSvg(svgEl,name) {
  console.log("got here 1")
  const markup = new XMLSerializer().serializeToString(svgEl);
  const pngBuf = await window.svgConverter.convertSvg({svg:markup,name:name});
  return pngBuf
  // …use pngBuf (e.g. createObjectURL) …
}

async function uploadFont(){
  let name = await window.fontAPI.uploadFont();
  console.log("returned", name)
  document.getElementById("nameOrWarning").innerText=name;
}

async function uploadProfile(){
  console.log("upload")
  let name = await window.profileApi.uploadProfile();
  //console.log("returned", name)
  //document.getElementById("nameOrWarning").innerText=name;
}


async function saveProfile(){
  let name = await window.profileApi.saveProfile();
  console.log("returned", name)
  document.getElementById("nameOrWarning").innerText=name;
}


async function sendFile(){
  console.log("calling send")
  let name = await window.profileApi.sendFile();

}


async function saveFont(){
  await window.fontAPI.saveFont();
  getGlyphs();
}

async function getFontNames(){

 let names = await window.fontAPI.getFontNames();

 return names;
}

async function getFontCharacterNames(font){

 let names = await window.fontAPI.getFontCharacterNames(font);

 return names;
}

async function getActiveKey(){

 let names = await window.keyApi.getActiveKey();

 return names;
}

async function getStillEditing(){
  let editing = await window.profileApi.getStillEditing();
  if(editing){
      document.getElementById("keyboard").classList=[];

  }
}

async function editProfile(){
  await window.profileApi.editProfile();

}





document.addEventListener('DOMContentLoaded', async () => {
  getStillEditing();
  getFontNames();
async function addImagePath(){
  let path = await window.profileApi.addImage();

  addImage([{name:"Uploaded",path:path }]);

}
  const btn = document.getElementById('getGlyphsBtn');
  if (!btn) {
    console.error('Button with id getGlyphsBtn not found!');
  }
  if(btn){
  btn.addEventListener('click', getGlyphs);}
  if(sections.main!=null){
  layout.forEach(k => sections[k.section].appendChild(buildKey(k)));
}
  document.getElementById("home").addEventListener('click',()=>{changePage("home")})
  document.getElementById("profile").addEventListener('click',()=>{changePage("profile")})
  document.getElementById("image").addEventListener('click',()=>{changePage("image")})
  document.getElementById("font").addEventListener('click',()=>{changePage("font")})



  let fontsDropdown = document.getElementById("fontsMenu");

  if(fontsDropdown){
    let names = await getFontNames();
    for(let x = 0; x<names.length; x++){
    let el = document.createElement("li");
    let a = document.createElement("a");
    a.className="dropdown-item";
    a.href="#"
    a.setAttribute("data-value",names[x]);
    a.innerText=names[x]
    let currentName = names[x]
    el.appendChild(a);
    el.addEventListener('click',async ()=>{
      console.log(currentName)
      // await getFontCharacterNames(currentName)
      populateCharacters(currentName);
    })
    fontsDropdown.appendChild(el)
    }
      // <li><a class="dropdown-item" href="#" data-value="AF">Afghanistan</a></li>

  }





// Usage example:


async function populateCharacters(givenName){

  let characterDropdown = document.getElementById("characterMenu");

      if(characterDropdown){
    let names = await getFontCharacterNames(givenName);
    for(let x = 0; x<names.length; x++){
    let el = document.createElement("li");
    let a = document.createElement("a");
    a.className="dropdown-item";
    a.href="#"
    a.setAttribute("data-value", names[x].name);
    a.innerText= names[x].name
    let img = document.createElement("img");
    img.src=names[x].path
    let currentName = names[x].name
    a.appendChild(img)

    el.appendChild(a);
    el.addEventListener('click',()=>{
      console.log(currentName)
      addImage([{name:names[x].name,path:names[x].path}])
      // getFontCharacterNames(currentName)
    })
    characterDropdown.appendChild(el)
    }
      // <li><a class="dropdown-item" href="#" data-value="AF">Afghanistan</a></li>

  }
}

const canvasDragInstance = await initCanvasDrag({
  canvasId: 'canvas',
  imageSources: [

  ]
});

// Later, when you want to add more images:
async function addImage(image) {
  await canvasDragInstance.addImages(image);
}

  if(document.getElementById("packSelect")!=null){
  document.getElementById("packSelect").addEventListener('click',()=>{uploadFont()})
  document.getElementById("saveFont").addEventListener('click',()=>{saveFont()})
}


  let createProfile = document.getElementById("createNewProfile")
  console.log("got here")
  if(createProfile){
    document.getElementById("editProfile").addEventListener("click",async()=>{
     await editProfile();
      document.getElementById("keyboard").classList=[];

    })
    createProfile.addEventListener("click",async ()=>{

      let name = document.getElementById("name").value;

      console.log(name)
      window.profileApi.createProfile(name);

      document.getElementById("keyboard").classList=[];
    })
  }
  document.getElementById("uploadProfile").addEventListener("click",()=>{
  console.log("calling send 2")

  sendFile();
})









document.getElementById("profileSelect").addEventListener("click",()=>{
  uploadProfile();
})


async function initCanvasDrag({
  canvasId      = 'canvas',
  imageSources  = null,
  getImages     = null,
  imageSize     = 128,
  startX        = 0,
  startY        = 0,
  gap           = 0
} = {}) {
  
  const canvas = document.getElementById(canvasId);
    if (!canvas) return console.error(`Canvas #${canvasId} not found`);
    // Disable default context‑menu so right‑click is ours to use
canvas.addEventListener('contextmenu', e => e.preventDefault());

  let active = await getActiveKey();
  let height = active.height? active.height:1;
  let width=active.span;
  console.log(active)
  document.getElementById("uploadImage").addEventListener("click",addImagePath)
  const ctx = canvas.getContext('2d');
  console.log(canvas.width)
  console.log(ctx.canvas.width)
  ctx.canvas.width=192*width
  ctx.canvas.height=192*height
  const sprites = [];
  let dragging  = null;
  let offsetX   = 0;
  let offsetY   = 0;

try{





document.getElementById("saveKey").addEventListener("click",async()=>{
await exportScaled(canvas,ctx.canvas.width/2,ctx.canvas.height/2);
})

}catch{}

  const drawAll = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sprites.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.w, s.h));
  };

  const asFileURL = p => p.startsWith('http') ? p : `file://${p.replace(/\\/g, '/')}`;

const loadSprite = async ({name, path, native = false}, posX, posY) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {

      let w, h;

     if (native) {
  w = img.width;
  h = img.height;
  // Center inside imageSize × imageSize slot
  posX += (imageSize - w) * 2;
  posY += (imageSize - h) * 2;
} else {
        // Old behaviour: shrink to a square "cell"
        const scale = imageSize / Math.max(img.width, img.height);
        w = img.width  * 2;
        h = img.height * 2;
      }

      sprites.push({ img, x: posX, y: posY, w, h, name });

 
      resolve();
    };
    img.onerror = () => reject(`Failed to load image: ${path}`);
    img.src = asFileURL(path);
  });
};


  const loadAllSprites = async () => {
    let data;
    if (Array.isArray(imageSources)) {
      data = imageSources.map((url, i) => ({ name: `img${i}`, path: url }));
    } else if (typeof getImages === 'function') {
      data = await getImages();
    } else {
      console.warn('CanvasDrag: no images provided');
      return;
    }

    let x = startX, y = startY;
    for (const imgData of data) {
      try {
        await loadSprite(imgData, x, y);
      } catch (e) {
        console.error(e);
      }
      x += imageSize + gap;
      if (x + imageSize > canvas.width) {
        x = startX; y += imageSize + gap;
      }
    }
    drawAll();
  };

  canvas.addEventListener('mousedown', e => {
    const { left, top } = canvas.getBoundingClientRect();
    const mx = e.clientX - left, my = e.clientY - top;

    for (let i = sprites.length - 1; i >= 0; i--) {
      const s = sprites[i];
      if (mx >= s.x && mx <= s.x + s.w && my >= s.y && my <= s.y + s.h) {
if (e.button === 0) {
  /* left button → start drag (your old logic) */
  dragging = s;
  offsetX  = mx - s.x;
  offsetY  = my - s.y;
  sprites.splice(i, 1);
  sprites.push(s);

} else if (e.button === 2) {
  /* right button → delete sprite */
  sprites.splice(i, 1);   // remove from array
  drawAll();              // repaint canvas
}
        break;
      }
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (!dragging) return;
    const { left, top } = canvas.getBoundingClientRect();
    dragging.x = e.clientX - left - offsetX;
    dragging.y = e.clientY - top - offsetY;
    drawAll();
  });

  ['mouseup', 'mouseleave'].forEach(ev =>
    canvas.addEventListener(ev, () => (dragging = null))
  );

  // Start by loading initial images
  loadAllSprites();

  // Return a function to add images dynamically at runtime
  return {
    addImages: async (newImages) => {
      // newImages: Array<{name, path}>
      // Position new images below existing sprites in a new row:
      let x = startX;
      // Find max y + height of current sprites to place new row below
      let maxY = sprites.reduce((max, s) => Math.max(max, s.y + s.h), 0);
      let y = maxY + gap;

      for (const imgData of newImages) {
        try {
          await loadSprite(imgData, x, y);
        } catch (e) {
          console.error(e);
        }
        x += imageSize + gap;
        if (x + imageSize > canvas.width) {
          x = startX;
          y += imageSize + gap;
        }
      }
      drawAll();
    }
  };
}



});
