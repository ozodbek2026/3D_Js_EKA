const DEG = Math.PI / 180;
var myContainer = document.getElementById("container");
var myWorld = document.getElementById("world");

var myTextBlock = document.createElement('div');
myTextBlock.id = 'myTextBlock';
myContainer.appendChild(myTextBlock);
var myText = document.createElement('h1');
myText.textContent = 'Please collect all elements!';
myTextBlock.appendChild(myText);

var lock;
var sensitivity = 0.5;

var lvl_one_map = [
    { name: "floor", height: 2000, width: 2000, posX: 0, posY: 100, posZ: 0, rotX: 90, rotY: 0, rotZ: 0, color: "violet", opacity: 1, pattern: "url('assets/textures/grass.jpg')"},
    // { name: "ceiling", height: 2000, width: 2000, posX: 0, posY: -350, posZ: 0, rotX: 90, rotY: 0, rotZ: 0, color: "green", opacity: 0.5 },
    { name: "right wall", height: 700, width: 2000, posX: 1000, posY: 0, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "blue", opacity: 1, pattern: "url('assets/textures/wall.jpg')" },
    { name: "left wall", height: 200, width: 2000, posX: -1000, posY: 0, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 1, pattern: "url('assets/textures/brickwall.jpg')" },
    // { name: "front wall", height: 200, width: 2000, posX: 0, posY: 0, posZ: 1000, rotX: 0, rotY: 0, rotZ: 0, color: "#ecc0d1", opacity: 0.5 },
    { name: "hinter wall", height: 200, width: 2000, posX: 0, posY: 0, posZ: -1000, rotX: 0, rotY: 0, rotZ: 0, color: "yellow", opacity: 1, pattern: "url('assets/textures/brickwall.jpg')" },
    { name: "wall001", height: 200, width: 200, posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0, color: "black", opacity: 0.5}
];

let lvl_one_obj = [
    {name: "coin", height: 50, width: 50, posX: 200, posY: 0, posZ: 300, rotX: 0, rotY: 0, rotZ: 0, color: "yellow"},
    {name: "coin", height: 50, width: 50, posX: -200, posY: 0, posZ: -300, rotX: 0, rotY: 0, rotZ: 0, color: "red"},
    {name: "coin", height: 50, width: 50, posX: -200, posY: 0, posZ: 300, rotX: 0, rotY: 0, rotZ: 0, color: "green"},
    {name: "coin", height: 50, width: 50, posX: 200, posY: 0, posZ: -300, rotX: 0, rotY: 0, rotZ: 0, color: "magenta"},
    {name: "coin", height: 50, width: 50, posX: 200, posY: 0, posZ: 600, rotX: 0, rotY: 0, rotZ: 0, color: "cyan"},

];

var lvl_one_obj_Size = lvl_one_obj.length;
var items_collected = 0;

function createWorld(map) {
    for (let i = 0; i < map.length; i++) {  
        let mySquare = document.createElement("div");
        mySquare.id = map[i].name;
        mySquare.style.position = "absolute";
        mySquare.style.height = `${map[i].height}px`;
        mySquare.style.width = `${map[i].width}px`;
        if (map[i].pattern) {
            mySquare.style.backgroundImage = map[i].pattern;
        } else {
            mySquare.style.backgroundColor = map[i].color;
        }
        mySquare.style.opacity = map[i].opacity;
        mySquare.style.transform = `
            translate3d(
                ${map[i].posX + myWorld.clientWidth / 2 - map[i].width / 2}px, 
                ${map[i].posY + myWorld.clientHeight / 2 - map[i].height / 2}px, 
                ${-map[i].posZ}px
            ) 
            RotateX(${map[i].rotX}deg) 
            RotateY(${map[i].rotY}deg) 
            RotateZ(${map[i].rotZ}deg)
        `;
        myWorld.appendChild(mySquare);
    }
}

function createObjects(map) {
    for (let i = 0; i < map.length; i++) {  
        let mySquare = document.createElement("div");
        mySquare.id = map[i].name + `${i}`;
        map[i].name = map[i].name + `${i}`;
        mySquare.style.position = "absolute";
        mySquare.style.height = `${map[i].height}px`;
        mySquare.style.width = `${map[i].width}px`;
        if (map[i].pattern) {
            mySquare.style.backgroundImage = map[i].pattern;
        } else {
            mySquare.style.backgroundColor = map[i].color;
        }
        mySquare.style.opacity = map[i].opacity;
        mySquare.style.transform = `
            translate3d(
                ${map[i].posX + myWorld.clientWidth / 2 - map[i].width / 2}px, 
                ${map[i].posY + myWorld.clientHeight / 2 - map[i].height / 2}px, 
                ${-map[i].posZ}px
            ) 
            RotateX(${map[i].rotX}deg) 
            RotateY(${map[i].rotY}deg) 
            RotateZ(${map[i].rotZ}deg)  
        `;
        myWorld.appendChild(mySquare);
    }
}

createWorld(lvl_one_map);
createObjects(lvl_one_obj);   

let dx = dy = dz = dry = 0;
let pressUp = pressDown = pressLeft = pressRight = jump = 0;
let mouseX = mouseY = 0;
let vel = 10;
var gravity = 1;
var onGround = false;

function player(x, y, z, rx, ry, rz, vx, vy, vz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
}

let pawn = new player(0, 0, 0, 0, 0, 0, vel, vel, vel);

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyW") {
        pressUp = pawn.vz;
    }
    if (e.code == "KeyS") {
        pressDown = pawn.vz;
    }
    if (e.code == "KeyD") {
        pressLeft = pawn.vx;
    }
    if (e.code == "KeyA") {
        pressRight = pawn.vx;
    }
    if (e.code == "Space") {
        jump = pawn.vy;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code == "KeyW") {
        pressUp = 0;
    }
    if (e.code == "KeyS") {
        pressDown = 0;
    }
        if (e.code == "KeyD") {
        pressLeft = 0;
    }
    if (e.code == "KeyA") {
        pressRight = 0;
    }
    if (e.code == "Space") {
        jump = 0;
    }
});

document.addEventListener("mousemove", (e) => {
    mouseX = e.movementX;
    mouseY = e.movementY;
});

document.addEventListener("pointerlockchange", (event) => {
    lock = !lock;
});

myContainer.addEventListener("click", async () => {
    if (!lock) {
        await myContainer.requestPointerLock({
            unadjustedMovement: true,
        });
    } 
        
//   myContainer.style.width = "1920px";
//   myContainer.style.height = "1200px";
//   myContainer.requestFullscreen();
//   console.log(myContainer.style.width, myContainer.style.height);
});

function update() {
    dx = (pressLeft - pressRight)*Math.cos(pawn.ry * DEG) + (pressUp - pressDown)*Math.sin(pawn.ry * DEG);
    dz = -(pressLeft - pressRight)*Math.sin(pawn.ry * DEG) + (pressUp - pressDown)*Math.cos(pawn.ry * DEG);

    dry = mouseX * sensitivity;
    drx = mouseY * sensitivity;
    mouseX = mouseY = 0;

    if (onGround) {
        dy = 0;
        if (jump) {
            pawn.y = -jump;
            onGround = false;
        }
    } else {
        dy = gravity;
    }

    collision(lvl_one_map, pawn);

    if (lock) {
        pawn.z += dz;
        pawn.x += dx;
        pawn.y += dy;
        pawn.ry += dry;
        pawn.rx -= drx;
        if (pawn.rx > 57) {
            pawn.rx = 57;
        } else if (pawn.rx < -57) {
            pawn.rx = -57;
        }
    }

    myWorld.style.transform = `translateZ(600px) RotateX(${pawn.rx}deg) RotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${pawn.z}px) `;

    interact(lvl_one_obj);
}

var game = setInterval(update, 10);

function interact(obj) {
  for (let i = 0; i < obj.length; i++) {
    let r = (pawn.x - obj[i].posX) ** 2 + (pawn.y - obj[i].posY) ** 2 + (pawn.z - obj[i].posZ) ** 2;
      if (r < (obj[i].width) ** 2 + (obj[i].height) ** 2) {
        //   console.log("interaction");
          let myTmpObj = document.getElementById(obj[i].name);
          items_collected++;
          lvl_one_obj.splice(i, 1); 
          myWorld.removeChild(myTmpObj);
          myText.textContent = `You have collected ${items_collected} of ${lvl_one_obj_Size}`;
        //   obj[i].posX = 10000;
        //   obj[i].posY = 10000;
        //   obj[i].posZ = 10000;
        //   let myTmpObj = document.getElementById(obj[i].name);
        //   myTmpObj.style.transform = `
        //     translate3d(
        //         ${obj[i].posX + myWorld.clientWidth / 2 - obj[i].width / 2}px, 
        //         ${obj[i].posY + myWorld.clientHeight / 2 - obj[i].height / 2}px, 
        //         ${-obj[i].posZ}px
        //     ) 
        //     RotateX(${obj}deg) 
        //     RotateY(${obj[i].rotY}deg) 
        //     RotateZ(${obj[i].rotZ}deg)  
        // `;

        //   obj[i].dissappear();
        
      }
  }
}

function collision(mapObj, leadObj) {
    onGround = false;
    for (let i = 0; i < mapObj.length; i++) {
        //spēlētāja koordinātes katra taiststūra koordināšu sistēmā
        let x0 = (leadObj.x - mapObj[i].posX);
        let y0 = (leadObj.y - mapObj[i].posY);
        let z0 = (leadObj.z - mapObj[i].posZ);

        if ((x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2) < (mapObj[i].width ** 2 + mapObj[i].height ** 2)) {
            //Pārvietošanās
            let x1 = x0 + dx;
            let y1 = y0 + dy;
            let z1 = z0 + dz;

            //Jaunā punkta koodrinātes
            let point0 = coorTransform(x0, y0, z0, mapObj[i].rotX, mapObj[i].rotY, mapObj[i].rotZ);
            let point1 = coorTransform(x1, y1, z1, mapObj[i].rotX, mapObj[i].rotY, mapObj[i].rotZ);
            let normal = coorReTransform(0, 0, 1, mapObj[i].rotX, mapObj[i].rotY, mapObj[i].rotZ);
            // let point2 = new Array();

            if (Math.abs(point1[0]) < (mapObj[i].width + 70) / 2 && Math.abs(point1[1]) < (mapObj[i].height + 70) / 2 && Math.abs(point1[2]) < 50) {
                // console.log("collision!");
                point1[2] = Math.sign(point0[2]) * 50;
                let point2 = coorReTransform(point1[0], point1[1], point1[2], mapObj[i].rotX, mapObj[i].rotY, mapObj[i].rotZ);
                let point3 = coorReTransform(point1[0], point1[1], 0, mapObj[i].rotX, mapObj[i].rotY, mapObj[i].rotZ);
                dx = point2[0] - x0;
                dy = point2[1] - y0;
                dz = point2[2] - z0;

                if (Math.abs(normal[1]) > 0.8) {
                    if (point3[1] > point2[1]) {
                        onGround = true;
                        // console.log("OnGround!");
                    }
                } else {
                    dy = y1 - y0;
                }
            }
        }
    };
}

function coorTransform(x0, y0, z0, rxc, ryc, rzc) {
    let x1 = x0;
    let y1 = y0 * Math.cos(rxc * DEG) + z0 * Math.sin(rxc * DEG);
    let z1 = -y0 * Math.sin(rxc * DEG) + z0 * Math.cos(rxc * DEG);

    let x2 = x1 * Math.cos(ryc * DEG) - z1 * Math.sin(ryc * DEG);
    let y2 = y1;
    let z2 = x1 * Math.sin(ryc * DEG) + z1 * Math.cos(ryc * DEG);

    let x3 = x2 * Math.cos(rzc * DEG) + y2 * Math.sin(rzc * DEG);
    let y3 = -x2 * Math.sin(rzc * DEG) + y2 * Math.cos(rzc * DEG);
    let z3 = z2;
    return [x3, y3, z3];
}

function coorReTransform(x3, y3, z3, rxc, ryc, rzc) {
    let x2 = x3 * Math.cos(rzc * DEG) - y3 * Math.sin(rzc * DEG);
    let y2 = x3 * Math.sin(rzc * DEG) + y3 * Math.cos(rzc * DEG);
    let z2 = z3;

    let x1 = x2 * Math.cos(ryc * DEG) + z2 * Math.sin(ryc * DEG);
    let y1 = y2;
    let z1 = -x2 * Math.sin(ryc * DEG) + z2 * Math.cos(ryc * DEG);

    let x0 = x1;
    let y0 = y1 * Math.cos(rxc * DEG) - z1 * Math.sin(rxc * DEG);
    let z0 = y1 * Math.sin(rxc * DEG) + z1 * Math.cos(rxc * DEG);

    return [x0, y0, z0];
}