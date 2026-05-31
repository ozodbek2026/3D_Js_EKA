const DEG = Math.PI / 180;
var myWorld = document.getElementById("world");
var myContainer = document.getElementById("container");
var myPawn = document.getElementById("pawn");
let lockMouse = false;

var lvl_one_map = [
    { name: "floor", height: 2000, width: 2000, posX: 0, posY: 200, posZ: 0, rotX: 90, rotY: 0, rotZ: 0, color: "violet", opacity: 0.3, img: "./assets/floor.jfif", bgsize: "15%"},
    { name: "ceiling", height: 2000, width: 2000, posX: 0, posY: -200, posZ: 0, rotX: 90, rotY: 0, rotZ: 0, color: "green", opacity: 0.3, img: "./assets/sky.jpg",  bgsize: "cover"},
    
    { name: "right wall", height: 400, width: 2000, posX: 1000, posY: 0, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "blue", opacity: 0.3, img: "./assets/wall.jpg", bgsize: "15%"},
    { name: "left wall", height: 400, width: 2000, posX: -1000, posY: 0, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/wall.jpg", bgsize: "15%"},
    { name: "front wall", height: 400, width: 2000, posX: 0, posY: 0, posZ: 1000, rotX: 0, rotY: 0, rotZ: 0, color: "#ecc0d1", opacity: 0.3, img: "./assets/wall.jpg", bgsize: "15%"},
    { name: "hinter wall", height: 400, width: 2000, posX: 0, posY: 0, posZ: -1000, rotX: 0, rotY: 0, rotZ: 0, color: "yellow", opacity: 0.3, img: "./assets/wall.jpg", bgsize: "15%"},
    // wall 1
    { name: "wall1", height: 300, width: 1200, posX: 700, posY: 50, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "100%"},
    { name: "wall2", height: 300, width: 1200, posX: 600, posY: 50, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "100%"},
    { name: "wall3", height: 300, width: 100, posX: 650, posY: 50, posZ: 600, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "1000%"},
    { name: "wall3", height: 300, width: 100, posX: 650, posY: 50, posZ: -600, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "1000%"},
    // wall 2
    { name: "wall1", height: 300, width: 1200, posX: -700, posY: 50, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "100%"},
    { name: "wall2", height: 300, width: 1200, posX: -600, posY: 50, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "100%"},
    { name: "wall3", height: 300, width: 100, posX: -650, posY: 50, posZ: 600, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "1000%"},
    { name: "wall3", height: 300, width: 100, posX: -650, posY: 50, posZ: -600, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "1000%"},
     // wall 3
    { name: "wall1", height: 300, width: 1200, posX: 0, posY: 50, posZ: 600, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "100%"},
    { name: "wall2", height: 300, width: 1000, posX: -100, posY: 50, posZ: -600, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "100%"},
    { name: "wall2", height: 300, width: 1000, posX: -100, posY: 50, posZ: -500, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "100%"},
    { name: "wall3", height: 300, width: 100, posX: 400, posY: 50, posZ: -550, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/grasswall.jpg", bgsize: "1000%"},
    
];




function createWorld(map) {
    for (let i = 0; i < map.length; i++) {
        var mySquare = document.createElement("div");
        mySquare.id = map[i].name;
        mySquare.style.position = "absolute";
        mySquare.style.height = `${map[i].height}px`;
        mySquare.style.width = `${map[i].width}px`;
        mySquare.style.backgroundColor = map[i].color;
        mySquare.style.backgroundImage = `url("${map[i].img}")`;
        mySquare.style.backgroundSize = map[i].bgsize;
        mySquare.style.backgroundPosition = 'center, center'; 
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

let shapes = [];
 

let dx = dy = dz = dry = 0;
let pressUp = pressDown = pressLeft = pressRight = 0;
let mouseX = mouseY = 0;
let vel = 10;

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
        myWorld.style.transition = "all 0.3s";
        pawn.y = 150;   
         setTimeout(()=>{
             pawn.y = 0; 
        }, 300)
        setTimeout(()=>{
            myWorld.style.transition = null;
        }, 500)
    }
});

document.addEventListener("mousemove", (e) => {
    mouseX = e.movementX;
    mouseY = e.movementY;
});



document.addEventListener("pointerlockchange", ()=>{
    lockMouse = !lockMouse
})

let counter = 0;

function cerateCube(x, z){
     shapes.push(
        { name: "wall1", height: 100, width: 100, posX: 0+x, posY: -100, posZ: 0+z, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img: "./assets/box.jfif", bgsize: "100%"},
        { name: "wall2", height: 100, width: 100, posX: 100+x, posY: -100, posZ: 0+z, rotX: 0, rotY: 90, rotZ: 0, color: "orange", opacity: 0.3, img:  "./assets/box.jfif", bgsize: "100%"},
        { name: "wall2", height: 100, width: 100, posX: 50+x, posY: -100, posZ: -50+z, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img:  "./assets/box.jfif", bgsize: "100%"},
        { name: "wall2", height: 100, width: 100, posX: 50+x, posY: -100, posZ: 50+z, rotX: 0, rotY: 180, rotZ: 0, color: "orange", opacity: 0.3, img:  "./assets/box.jfif", bgsize: "100%"},
        { name: "wall2", height: 100, width: 100, posX: 50+x, posY: -150, posZ: 0+z, rotX: 90, rotY: 0, rotZ: 0, color: "orange", opacity: 0.3, img:  "./assets/box.jfif", bgsize: "100%"},
        { name: "wall2", height: 100, width: 100, posX: 50+x, posY: -50, posZ: 0+z, rotX: 90, rotY: 0, rotZ: 0, color: "orange", opacity: 0.3, img:   "./assets/box.jfif", bgsize: "100%"}
    );
}

document.addEventListener("click", async () => {
    counter++;
    if (!lockMouse) {
        await myContainer.requestPointerLock({
            unadjustedMovement: true,
        });
    }
    if(counter > 1){
        cerateCube(pawn.x, pawn.z)
    }
    createWorld(shapes)
});



function update() {
    // dz = pressUp - pressDown;
    // dx = pressLeft - pressRight;

    dx = (pressLeft - pressRight)*Math.cos(pawn.ry * DEG) + (pressUp - pressDown)*Math.sin(pawn.ry * DEG);
    dz = -(pressLeft - pressRight)*Math.sin(pawn.ry * DEG) + (pressUp - pressDown)*Math.cos(pawn.ry * DEG);

    dry = mouseX;
    drx = mouseY; // 0
    mouseX = mouseY = 0;

    collision(lvl_one_map, pawn);

    
    if(lockMouse){
        pawn.z += dz;
        pawn.x += dx;       
        pawn.ry += dry;
        // pawn.ry = Math.max(-360, Math.min(360, pawn.ry))
        pawn.rx -= drx;
        pawn.rx = Math.max(-40, Math.min(40, pawn.rx));
    }
    myWorld.style.transform = `translateZ(600px) RotateX(${pawn.rx}deg) RotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${pawn.y}px, ${pawn.z}px) `;
}

var game = setInterval(update, 10);

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