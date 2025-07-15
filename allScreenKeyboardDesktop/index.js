const { app, BrowserWindow, ipcMain } = require('electron');
const sharp = require('sharp');
const fs = require('fs');
const { Font } = require('fonteditor-core');

const { dialog } = require('electron');
const path = require('path');
const child_process = require("child_process");
var zipper = require('zip-local');
const archiver = require('archiver');
let activeZip;

let stillEditing = false;
let newProfile = true;

const net  = require('net');

const activeWindow = require("get-windows")


//Temp system for active window detection, need to make it user interactable

// setInterval(() => {
//   console.log(activeWindow.activeWindowSync())
//  if(activeWindow.activeWindowSync().owner.name=="Microsoft Excel"&&newProfile){
//   newProfile=false;
//     sendFile()
//  }
// }, 10000000000);


let validPath = false;

let item;
let folderName;
let win;

let activeProfile;
let profileJson;

let activeKey;


ipcMain.handle('convertSvg', (event, arg) => {
  try {
    const pngBuffer = sharp(Buffer.from(arg.svg))
      .png()
      .toBuffer()
      .then(buffer => {
        const filePath = path.join('fonts', folderName, arg.name.toUpperCase() + '.png');
        let name = arg.name.toUpperCase();

        if (fs.existsSync(filePath)) {
          console.log("EXISTS");
          name = arg.name.toUpperCase() + "1";
        }

        const writePath = path.join('fonts', folderName, name + '.png');

        fs.writeFileSync(writePath, buffer);
        console.log('PNG saved successfully!');

        return { ok: true, path: writePath };
      })
      .catch(err => {
        console.error('Error saving PNG:', err);
        return { ok: false, error: err.message };
      });

    return pngBuffer;
  } catch (err) {
    console.error('convertSvg failed:', err);
    return { ok: false, error: err.message };
  }
});


ipcMain.handle('changePage', async(event,arg)=>{
stillEditing = false;

  win.loadFile('html/'+arg+'.html')
})

ipcMain.handle('setActiveKey',(event, arg)=>{
  console.log(arg)
  activeKey=arg;
})


ipcMain.handle('getActiveKey',()=>{
  return activeKey
})


ipcMain.handle('addImage',async()=>{
    item = await dialog.showOpenDialog({ properties: ['openFile'],  filters: [
    { name: 'Images', extensions: ['png'] }
  ] })

    return item.filePaths[0]
})


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

// Base size for one unit (in pixels)
const baseWidth = 96;
const baseHeight = 96;

const outputDir = path.join(__dirname, 'templateImages');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Helper to create transparent PNG of given width/height and save as filename
async function createTransparentPNG(width, height, filename) {
  const buffer = await sharp({
    create: {
      width: Math.round(width),
      height: Math.round(height),
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .png()
    .toBuffer();

  await sharp(buffer).toFile(filename);
}

async function generatePNGs() {
  for (const key of layout) {
    const width = (key.span || 1) * baseWidth;
    const height = (key.height || 1) * baseHeight;
    const filename = path.join(outputDir, `${key.code}.png`);

    try {
      await createTransparentPNG(width, height, filename);
      console.log(`Created: ${filename} (${width}x${height})`);
    } catch (err) {
      console.error(`Error creating PNG for ${key.code}:`, err);
    }
  }
}

// generatePNGs();


ipcMain.handle('editProfile',async()=>{
    item = await dialog.showOpenDialog({ properties: ['openFile'],  filters: [
    { name: 'Profiles', extensions: ['json'] }
  ] })

        let parts = item.filePaths[0].split("\\");
  let name = parts[parts.length-2]


  let json = JSON.parse(fs.readFileSync(item.filePaths[0]))
  console.log("new json",json)
  profileJson=json
  console.log(name,"editing name")

  activeProfile=name;
})

ipcMain.handle('getFontNames',()=>{
  const dirPath = './fonts/';
const subfolders = fs.readdirSync(dirPath)
  .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory());

  console.log(subfolders)

  return subfolders;
})

ipcMain.handle('createProfile', (event, arg) => {
  const dirPath = path.join('profiles', arg); // profile folder
  const filePath = path.join(dirPath, 'format.json');
  const json = {keys:[]};
  console.log(arg,"path")
  activeProfile = arg
  profileJson=json
  try {
    fs.mkdirSync(dirPath, { recursive: true }); // ensure folder exists
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2)); // write JSON file
    return { ok: true, path: filePath };
  } catch (err) {
    console.error('Error creating profile:', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('uploadProfile', (event, arg) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then(item => {
    if (item.canceled || !item.filePaths.length) return;

    const srcRoot = item.filePaths[0];
    const parts = srcRoot.split(path.sep);
    const name = parts[parts.length - 1];
    const outFolder = path.join(srcRoot, name + 'Prof');

    // Step 1: Ensure the output folder exists
    fs.mkdir(outFolder, { recursive: true }, err => {
      if (err) return console.error('mkdir failed:', err);

      // Step 2: Read and start layout.prof
      const templatePath = path.join(__dirname, 'profiles', 'template.prof');
      fs.readFile(templatePath, 'utf8', (err, templateData) => {
        if (err) return console.error('read template failed:', err);

        let layoutData = templateData + '\n';

        // Step 3: Read format.json
        const formatPath = path.join(srcRoot, 'format.json');
        fs.readFile(formatPath, 'utf8', (err, jsonStr) => {
          if (err) return console.error('read format.json failed:', err);

          let profileJson = JSON.parse(jsonStr);
          let pending = profileJson.keys.length;
          if (pending === 0) return writeLayout(); // no keys, just write

          profileJson.keys.forEach(k => {
            layoutData += `K  ${k.softCode}  0   ${k.label}\n`;
              console.log(name,k,k.image.split(name+'\\')[1])
            const imageRel = k.image.split(name+'\\')[1].replace(/\\/g, '/');
            const destImg = path.join(outFolder, imageRel);
            const destImgDir = path.dirname(destImg);

            fs.mkdir(destImgDir, { recursive: true }, err => {
              if (err) return console.error('mkdir image path failed:', err);

              fs.copyFile(k.image, destImg, err => {
                if (err) return console.error('copy image failed:', err);

                layoutData += `T  ${k.softCode}  0   profiles/${name}Prof/${imageRel}  0.81  0.81\n`;
                pending--;
                if (pending === 0) {
                  //Temp system to for background image into prof file, will redo later to allow for user uploading
              //                   fs.copyFile("C:\\Github\\all-screen-keyboard-revamp\\allScreenKeyboardDesktop\\profiles\\Canva\\bg.jpg", path.join(outFolder, "bg.jpg"), err => {
              //   if (err) return console.error('copy image failed:', err);

              //     layoutData+="B	profiles/CanvaProf/bg.jpg"
                  
                  writeLayout();
                  
              // });
                  }
              });
            });
          });

          function writeLayout() {
            const layoutPath = path.join(outFolder, 'layout.prof');
            fs.writeFile(layoutPath, layoutData, err => {
              if (err) return console.error('write layout.prof failed:', err);

              // Step 4: Create .zip with top-level folder
              const outZip = path.join(srcRoot, name + '.zip');
              const output = fs.createWriteStream(outZip);
              const archive = archiver('zip', { zlib: { level: 9 } });

              output.on('close', () => {
                console.log(`Created zip: ${outZip} (${archive.pointer()} bytes)`);
                activeZip = outZip;
              });

              archive.on('error', err => {
                console.error('archiver error:', err);
              });

              archive.pipe(output);
              archive.directory(outFolder, name + 'Prof'); // top-level folder
              archive.finalize();
            });
          }
        });
      });
    });
  });
});

ipcMain.handle('saveCanvasImage', async (event, { base64, filename }) => {
  try {
    const savePath = path.join(__dirname, 'profiles',activeProfile, filename);

    // Ensure the folder exists
    fs.mkdirSync(path.dirname(savePath), { recursive: true });

    // Write image to file
    fs.writeFileSync(savePath, Buffer.from(base64, 'base64'));
    updateProfile(savePath)

    stillEditing = true;
win.loadFile('html/profile.html')


    return { ok: true, path: savePath };
  } catch (err) {
    console.error('Failed to save image:', err);
    return { ok: false, error: err.message };
  }
});






ipcMain.handle('getStillEditing', () => {

  return stillEditing;     
});

async function updateProfile(pathGiven){

    const dirPath = path.join('profiles', activeProfile); // profile folder
  const filePath = path.join(dirPath, 'format.json');
  const json = profileJson;
  let tempJson = {softCode:activeKey.softCode, label:activeKey.label, image:pathGiven}
  profileJson.keys.push(tempJson)
  try {
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2)); // write JSON file
    profileJson=json;
    return { ok: true, path: filePath };
  } catch (err) {
    console.error('Error creating profile:', err);
    return { ok: false, error: err.message };
  }
}


ipcMain.handle('getFontCharacterNames', (event, fontDir) => {
  // directory that holds the font’s character images
  const dirPath = path.join(__dirname, 'fonts', fontDir);

  // read every entry, keep only files, then map to { name, path }
  const files = fs.readdirSync(dirPath)
    .filter(file => fs.statSync(path.join(dirPath, file)).isFile())
    .map(file => ({
      name: file,                         // e.g. "A.png"
      path: path.join(dirPath, file)      // e.g. "C:\app\fonts\MyFont\A.png"
    }));
    
  return files;            // [{name:"A.png", path:"…"}, …]
});


//Exposed function for sending zip file on active window change, will redo system to allow user to upload
//in menu, and switch between them with a string request to allow for greatly reduced load times
async function sendFile(){

  console.log("SENDING FILE")
  const PIPE_PATH = '\\\\.\\pipe\\keyboard_serial';   // must match VBox “Host Pipe”


// ---------------- sanity checks ----------------------------------
if (!fs.existsSync(activeZip)) {
  console.error(` ZIP file "${activeZip}" not found`);
  process.exit(1);
}
console.log(activeZip,PIPE_PATH)
const zipBuf = fs.readFileSync(activeZip);
const lenBuf = Buffer.alloc(4);
lenBuf.writeUInt32BE(zipBuf.length, 0);

console.log(`ZIP size: ${zipBuf.length} bytes`);
console.log(`Opening pipe: ${PIPE_PATH}`);

// ---------------- connect & send ---------------------------------
const sock = net.createConnection({ path: PIPE_PATH });

sock.on('connect', () => {
  console.log(' Pipe connected sending header + data …');
  sock.write(lenBuf);   // 4‑byte length header
  sock.write(zipBuf);   // ZIP payload
  sock.end();           // done – politely close
});

sock.on('error', (err) => {
  console.error(' Pipe error:', err.message);
});

sock.on('end', () => {
  console.log('Pipe closed transfer finished');
});
}




ipcMain.handle('sendFile', async(event, arg)=>{

  console.log("SENDING FILE")
  const PIPE_PATH = '\\\\.\\pipe\\keyboard_serial';   // must match VBox “Host Pipe”


// ---------------- sanity checks ----------------------------------
if (!fs.existsSync(activeZip)) {
  console.error(` ZIP file "${activeZip}" not found`);
  process.exit(1);
}
console.log(activeZip,PIPE_PATH)
const zipBuf = fs.readFileSync(activeZip);
const lenBuf = Buffer.alloc(4);
lenBuf.writeUInt32BE(zipBuf.length, 0);

console.log(`ZIP size: ${zipBuf.length} bytes`);
console.log(`Opening pipe: ${PIPE_PATH}`);

// ---------------- connect & send ---------------------------------
const sock = net.createConnection({ path: PIPE_PATH });

sock.on('connect', () => {
  console.log(' Pipe connected  sending header + data …');
  sock.write(lenBuf);   // 4‑byte length header
  sock.write(zipBuf);   // ZIP payload
  sock.end();           // done – politely close
});

sock.on('error', (err) => {
  console.error(' Pipe error:', err.message);
});

sock.on('end', () => {
  console.log('Pipe closed transfer finished');
});
})



ipcMain.handle('uploadFont', async()=>{
  item = await dialog.showOpenDialog({ properties: ['openFile'],  filters: [
    { name: 'Font Packs', extensions: ['ttf', 'tiff'] }
  ] })


      let parts = item.filePaths[0].split("\\");
  let name = parts[parts.length-1]
  folderName=name;
const dirPath = './fonts/';
const subfolders = fs.readdirSync(dirPath)
  .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory());

  if(!subfolders.includes(name)){
    validPath=true;
    return name;
} else {
  return "Font already uploaded"
}



  }
)

ipcMain.handle('saveFont', async()=>{
    let parts = item.filePaths[0].split("\\");
  let name = parts[parts.length-1]
  folderName=name;
  console.log("name",name)
const dirPath = './fonts/';
const subfolders = fs.readdirSync(dirPath)
  .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory());


  if(!subfolders.includes(name)){
const folderPath = path.join(__dirname, dirPath+name);
console.log(folderPath,"folder path")
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true }); // Creates any needed parent dirs too
  console.log('Folder created:', folderPath);
} else {
  console.log('Folder already exists:', folderPath);
  return;
}


  try {
    fs.copyFileSync(item.filePaths[0], folderPath+"/"+name);
    console.log(`Copied ${name} to ${folderPath+"/"+name}`);
  } catch (err) {
    console.error('Error copying file:', err);
  }

}
})


ipcMain.handle('get-glyphs', async () => {

  if(!validPath) return;
  console.log("got here")
  const buffer = fs.readFileSync('./fonts/'+folderName+'/'+folderName);
  const font = Font.create(buffer, { type: 'ttf', hinting: true });
  const glyphs = font.get().glyf;

  console.log('new glyph');

  validPath=false;

// win.loadFile('html/fontAdding.html')
  return glyphs.map(glyph => ({
    name: glyph.name,
    unicode: glyph.unicode,
    contours: glyph.contours,
    xMin: glyph.xMin,
    yMin: glyph.yMin,
    xMax: glyph.xMax,
    yMax: glyph.yMax,
  }));
});

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
        webPreferences: {
      preload: __dirname + '/preload.js', // recommended for secure IPC
      contextIsolation: true,
      nodeIntegration: false,
    }
  })

  win.loadFile('html/home.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})




