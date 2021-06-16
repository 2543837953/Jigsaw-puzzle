// 游戏名字:拖拽拼图
// 作者:杜茂非
// 描述:控制div实现拼图游戏
// 完成时间:2020年4月8日
// 邮箱:2543837953@qq.com
 let file = document.querySelector('#file');
 let game = document.querySelector('#game');
 let reader = new FileReader()
 file.onchange = function () {
     reader.readAsDataURL(file.files[0])
     reader.onload = function () {
         gc.url = reader.result;
         file.remove();
         init();
     }
 }
 let gc = {
     size: '4*4',
     url: '',
     margin: 2,
     cell: '150',
     rotate: [0,90,180,270,360],
     opacity: 0.2,
     randDiv: '',
     rightDiv: '',
     rId: 0,
     randId:0,
     sortObj: {
         rW: '',
         rH: '',
         rightList: [],
         randomList: []
     }
 }
 let cellX = gc.size.split('*')[0];
 let cellY = gc.size.split('*')[1];
 gc.sortObj.rW = cellX * gc.cell + (cellX * gc.margin)-gc.margin
 gc.sortObj.rH = cellY * gc.cell + (cellY * gc.margin)-gc.margin

 function init() {
     gc.randDiv = document.createElement('div')
     gc.randDiv.className = 'randDiv'
     gc.rightDiv = document.createElement('div')
     gc.rightDiv.className = 'rightDiv'
     game.append(gc.randDiv, gc.rightDiv);
     gc.randDiv.style.width = gc.sortObj.rW + 'px';
     gc.randDiv.style.height = gc.sortObj.rH + 'px';
     gc.randDiv.style.display = "flex";
     gc.randDiv.style.flexWrap = "wrap";

     gc.rightDiv.style.width = gc.sortObj.rW + 'px';
     gc.rightDiv.style.height = gc.sortObj.rH + 'px';
     gc.rightDiv.style.display = "flex";
     gc.rightDiv.style.flexWrap = "wrap";
     drawDiv();
 }

 function drawDiv() {
     let xy=[];
     let current;
     for (let y = 0; y < cellY; y++) {
         for (let x = 0; x < cellX; x++) {
             gc.sortObj.rightList.push(new Cell(
                 gc.cell,
                 gc.cell,
                 x*gc.cell+(x*gc.margin),
                 y*gc.cell+(y*gc.margin),
                 0,
                 x * -gc.cell,
                 y * -gc.cell,
                 gc.url,
                 gc.rightDiv,
                 gc.opacity,
                 gc.rId++
             ))
             gc.sortObj.randomList.push(new Cell(
                 gc.cell,
                 gc.cell,
                 x*gc.cell+(x*gc.margin),
                 y*gc.cell+(y*gc.margin),
                 gc.rotate[random(0, gc.rotate.length - 1)],
                 x * -gc.cell,
                 y * -gc.cell,
                 gc.url,
                 gc.randDiv,
                 1,
                 gc.randId++
             ))
         }
     }
     gc.sortObj.randomList.forEach(r=>{
         xy.push({'x':r.x,'y':r.y});
     })
     gc.sortObj.randomList.forEach(c=>{
         current=xy.splice(random(0,xy.length-1),1)[0]
         c.x=current.x
         c.y=current.y
         c.init();
     });
     gc.sortObj.rightList.forEach(c=>{
         c.init();
     })
 }

 class Cell {
     constructor(width, height,x,y,rotate, bgX, bgY, url, parent, opacity, id) {
         this.el = ''
         this.width = width
         this.height = height
         this.rotate = rotate
         this.x = x
         this.y = y
         this.bgX = bgX
         this.bgY = bgY
         this.url = url
         this.parent = parent
         this.opacity = opacity
         this.id = id
         this.dir=''
         this.correctMove=false
     }
     init() {
         this.el = document.createElement('div');
         this.el.className = 'item';
         this.el.style.width = this.width + 'px';
         this.el.style.height = this.height + 'px';
         this.el.style.left= this.x + 'px';
         this.el.style.top= this.y + 'px';
         this.el.style.opacity = this.opacity;
         this.el.style.transform = `rotate(${this.rotate}deg)`;
         this.el.style.background = `url(${this.url})`;
         this.el.style.backgroundPositionX = this.bgX + 'px';
         this.el.style.backgroundPositionY = this.bgY + 'px';
         this.parent.append(this.el);
     }
     move(){
         this.el.style.left= this.x + 'px';
         this.el.style.top= this.y + 'px';
         this.el.style.zIndex= 1000;
         this.el.style.transform = `rotate(${this.rotate}deg) scale(1.1)`;
     }
     r(){
         switch (this.dir) {
             case "right":
                 this.rotate=this.rotate+90>360?0:this.rotate+90;
                 console.log(this.rotate);
                 this.el.style.transform = `rotate(${this.rotate}deg) scale(1.1)`;
                 break;
             case "left":
                 this.rotate=this.rotate-90<-360?0:this.rotate-90;
                 console.log(this.rotate);
                 this.el.style.transform = `rotate(${this.rotate}deg) scale(1.1)`;
                 break;
         }
         this.el.style.transition =`transform 0.5s`;
     }
     rest(){
         this.el.style.left= this.x + 'px';
         this.el.style.top= this.y + 'px';
         this.el.style.zIndex= 1000;
         this.el.style.transform = `rotate(${this.rotate}deg) scale(1)`;
     }
     restCell(){
         this.el.style.left= this.x + 'px';
         this.el.style.top= this.y + 'px';
         this.el.style.zIndex= -1;
         this.el.style.transform = `rotate(${this.rotate}deg) scale(1)`;
     }
     success(){
         if (correctCount===gc.sortObj.randomList.length&&
             document.querySelector('.randDiv').children.length===0){
             console.log('你赢了')
         }
     }
 }
 let cell;
 let move=false;
 let prevX,prevY,prevRotate;
 document.onmousedown=function (e){
     if(e.target.parentElement.className!=="randDiv") return;
     let downX=e.clientX;
     let downY=e.clientY;
     cell=getCell(downX,downY)[0]
     prevX=cell.x;
     prevY=cell.y;
     prevRotate=cell.rotate
     move=true;
 }
 document.onmousemove=function (e){
     if (move){
         if(e.target.parentElement.parentElement.id!=="game") return;
         cell.x=e.clientX-80
         cell.y=e.clientY-80
         cell.move()
     }
 }
 document.addEventListener('keydown',(e)=>{
     if (e.code.indexOf('Arrow')===0){
         cell.dir=e.code.replace('Arrow','').toLowerCase();
         cell.r();
     }
 })
 let correctCount=0;
 document.addEventListener('mouseup',(e)=>{
     if(e.target.parentElement.parentElement.id!=="game") return;
     let restCell=getRightCell(e.clientX-gc.sortObj.rW-40,e.clientY)[0]
     if (!restCell){
         move=false;
         cell.x=prevX;
         cell.y=prevY;
         cell.rotate=prevRotate;
         cell.rest();
     }else {
         move=false;
         if (restCell.id===cell.id&&(cell.rotate===0||cell.rotate===360)){
             restCell.parent.append(cell.el);
             cell.correctMove=true;
             cell.x=restCell.x;
             cell.y=restCell.y;
             cell.parent=restCell.parent
             cell.restCell();
             correctCount++;
             cell.success()
         }else {
             cell.x=prevX;
             cell.y=prevY;
             cell.rotate=prevRotate;
             cell.rest();
         }
     }
 })
 function getCell(x,y){
     return gc.sortObj.randomList.filter(r=>!r.correctMove&&x>r.x&&x<r.x+parseInt(gc.cell)&&y>r.y&&y<r.y+parseInt(gc.cell));
 }
 function getRightCell(x,y){
     return gc.sortObj.rightList.filter(r=>x>r.x&&x<r.x+parseInt(gc.cell)&&y>r.y&&y<r.y+parseInt(gc.cell));
 }
 function random(min, max) {
     return Math.floor(Math.random() * (max - min + 1)) + min
 }

 function randomSort(a, b) {
     return Math.random() > .5 ? -1 : 1;
 }