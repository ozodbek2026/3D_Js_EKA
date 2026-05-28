const DEG = Math.PI / 180;
var myContainer = document.getElementById("container");
var myWorld = document.getElementById("world");

var lvl_one_map = [
    { name: "floor", height: 2600, width: 2600, posX: 0, posY: 100, posZ: 0, rotX: 90, rotY: 0, rotZ: 0, color: "#4f8f2f", opacity: 1, type: "floor" },
    { name: "ceiling", height: 2600, width: 2600, posX: 0, posY: -180, posZ: 0, rotX: 90, rotY: 0, rotZ: 0, color: "#87ceeb", opacity: 1, type: "ceiling" },

    { name: "right wall", height: 260, width: 2200, depth: 80, posX: 1100, posY: -20, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "left wall", height: 260, width: 2200, depth: 80, posX: -1100, posY: -20, posZ: 0, rotX: 0, rotY: 90, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "back wall", height: 260, width: 2200, depth: 80, posX: 0, posY: -20, posZ: -1100, rotX: 0, rotY: 0, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "front wall", height: 260, width: 2200, depth: 80, posX: 0, posY: -20, posZ: 1100, rotX: 0, rotY: 0, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },

    { name: "maze1", height: 260, width: 800, depth: 80, posX: -350, posY: -20, posZ: -700, rotX: 0, rotY: 0, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "maze2", height: 260, width: 700, depth: 80, posX: 450, posY: -20, posZ: -450, rotX: 0, rotY: 90, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "maze3", height: 260, width: 700, depth: 80, posX: -650, posY: -20, posZ: -100, rotX: 0, rotY: 90, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "maze4", height: 260, width: 850, depth: 80, posX: 150, posY: -20, posZ: 200, rotX: 0, rotY: 0, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "maze5", height: 260, width: 650, depth: 80, posX: -250, posY: -20, posZ: 600, rotX: 0, rotY: 90, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" },
    { name: "maze6", height: 260, width: 850, depth: 80, posX: 450, posY: -20, posZ: 850, rotX: 0, rotY: 0, rotZ: 0, color: "#c76a34", opacity: 1, type: "wall3d" }
];

function setBrickStyle(el, color) {
    el.style.backgroundColor = color;
    el.style.backgroundImage = `
        linear-gradient(rgba(255,255,255,.18) 2px, transparent 2px),
        linear-gradient(90deg, rgba(255,255,255,.18) 2px, transparent 2px),
        linear-gradient(90deg, transparent 39px, rgba(50,20,10,.45) 40px, transparent 41px)
    `;
    el.style.backgroundSize = "80px 35px";
    el.style.boxShadow = "inset 0 0 20px rgba(0,0,0,.25)";
}

function createWall3D(wall) {
    var box = document.createElement("div");
    box.id = wall.name;
    box.style.position = "absolute";
    box.style.width = wall.width + "px";
    box.style.height = wall.height + "px";
    box.style.transformStyle = "preserve-3d";

    var front = document.createElement("div");
    front.style.position = "absolute";
    front.style.width = wall.width + "px";
    front.style.height = wall.height + "px";
    front.style.transform = "translateZ(" + wall.depth / 2 + "px)";
    setBrickStyle(front, wall.color);
    box.appendChild(front);

    var back = document.createElement("div");
    back.style.position = "absolute";
    back.style.width = wall.width + "px";
    back.style.height = wall.height + "px";
    back.style.transform = "rotateY(180deg) translateZ(" + wall.depth / 2 + "px)";
    setBrickStyle(back, wall.color);
    box.appendChild(back);

    var left = document.createElement("div");
    left.style.position = "absolute";
    left.style.width = wall.depth + "px";
    left.style.height = wall.height + "px";
    left.style.left = -wall.depth / 2 + "px";
    left.style.transform = "rotateY(-90deg)";
    setBrickStyle(left, "#9c4f27");
    box.appendChild(left);

    var right = document.createElement("div");
    right.style.position = "absolute";
    right.style.width = wall.depth + "px";
    right.style.height = wall.height + "px";
    right.style.left = wall.width - wall.depth / 2 + "px";
    right.style.transform = "rotateY(90deg)";
    setBrickStyle(right, "#9c4f27");
    box.appendChild(right);

    var top = document.createElement("div");
    top.style.position = "absolute";
    top.style.width = wall.width + "px";
    top.style.height = wall.depth + "px";
    top.style.top = -wall.depth / 2 + "px";
    top.style.transform = "rotateX(90deg)";
    setBrickStyle(top, "#7a3218");
    box.appendChild(top);

    var bottom = document.createElement("div");
    bottom.style.position = "absolute";
    bottom.style.width = wall.width + "px";
    bottom.style.height = wall.depth + "px";
    bottom.style.top = wall.height - wall.depth / 2 + "px";
    bottom.style.transform = "rotateX(-90deg)";
    setBrickStyle(bottom, "#7a3218");
    box.appendChild(bottom);

    box.style.transform = `
        translate3d(
            ${wall.posX + myWorld.clientWidth / 2 - wall.width / 2}px,
            ${wall.posY + myWorld.clientHeight / 2 - wall.height / 2}px,
            ${-wall.posZ}px
        )
        rotateY(${wall.rotY}deg)
    `;

    myWorld.appendChild(box);
}

function createWorld(map) {
    for (let i = 0; i < map.length; i++) {

        if (map[i].type == "wall3d") {
            createWall3D(map[i]);
            continue;
        }

        var mySquare = document.createElement("div");
        mySquare.id = map[i].name;
        mySquare.style.position = "absolute";
        mySquare.style.height = `${map[i].height}px`;
        mySquare.style.width = `${map[i].width}px`;
        mySquare.style.backgroundColor = map[i].color;
        mySquare.style.opacity = map[i].opacity;

        if (map[i].type == "floor") {
            mySquare.style.backgroundImage = `
                repeating-linear-gradient(25deg, rgba(20,80,15,.45) 0 2px, transparent 2px 7px),
                repeating-linear-gradient(-20deg, rgba(120,190,45,.35) 0 3px, transparent 3px 9px)
            `;
            mySquare.style.backgroundSize = "55px 55px";
        }

        if (map[i].type == "ceiling") {
            mySquare.style.backgroundImage = `
                radial-gradient(circle at 25% 35%, rgba(255,255,255,.9), transparent 20%),
                radial-gradient(circle at 70% 45%, rgba(255,255,255,.75), transparent 22%),
                linear-gradient(to bottom, #6ec6ff, #bfe8ff)
            `;
            mySquare.style.backgroundSize = "800px 800px";
        }

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

let dx = dy = dz = dry = 0;
let pressUp = pressDown = pressLeft = pressRight = 0;
let mouseX = 0, mouseY = 0;

let vel = 10;
let gravity = -0.4;
let jumpStrength = 12;
let isGrounded = true;

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
    if (e.code == "KeyW") pressUp = pawn.vz;
    if (e.code == "KeyS") pressDown = pawn.vz;
    if (e.code == "KeyD") pressLeft = pawn.vx;
    if (e.code == "KeyA") pressRight = pawn.vx;

    if (e.code == "Space" && isGrounded) {
        dy = jumpStrength;
        isGrounded = false;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code == "KeyW") pressUp = 0;
    if (e.code == "KeyS") pressDown = 0;
    if (e.code == "KeyD") pressLeft = 0;
    if (e.code == "KeyA") pressRight = 0;
});

document.addEventListener("mousemove", (e) => {
    mouseX = e.movementX;
    mouseY = e.movementY;
});

myContainer.addEventListener("click", async () => {
    await myContainer.requestPointerLock({ unadjustedMovement: true });
});

function update() {
    dx = (pressLeft - pressRight) * Math.cos(pawn.ry * DEG) +
         (pressUp - pressDown) * Math.sin(pawn.ry * DEG);

    dz = -(pressLeft - pressRight) * Math.sin(pawn.ry * DEG) +
          (pressUp - pressDown) * Math.cos(pawn.ry * DEG);

    if (!isGrounded) dy += gravity;

    dry = mouseX * 0.75;
    let drx = mouseY * 0.45;

    mouseX = 0;
    mouseY = 0;

    collision(lvl_one_map, pawn);

    pawn.x += dx;
    pawn.z += dz;
    pawn.y += dy;

    pawn.ry += dry;
    pawn.rx -= drx;

    if (pawn.rx > 45) pawn.rx = 45;
    if (pawn.rx < -45) pawn.rx = -45;

    if (pawn.y <= 0) {
        pawn.y = 0;
        dy = 0;
        isGrounded = true;
    }

    myWorld.style.transform =
        `translateZ(600px) RotateX(${pawn.rx}deg) RotateY(${pawn.ry}deg) translate3d(${-pawn.x}px, ${pawn.y}px, ${pawn.z}px)`;
}

var game = setInterval(update, 10);

function hitWall(px, pz, wall) {
    let lx = px - wall.posX;
    let lz = pz - wall.posZ;

    let angle = -wall.rotY * DEG;

    let rx = lx * Math.cos(angle) - lz * Math.sin(angle);
    let rz = lx * Math.sin(angle) + lz * Math.cos(angle);

    if (
        Math.abs(rx) < wall.width / 2 + 45 &&
        Math.abs(rz) < wall.depth / 2 + 45
    ) {
        return true;
    }

    return false;
}

function collision(mapObj, leadObj) {
    for (let i = 0; i < mapObj.length; i++) {

        if (mapObj[i].type != "wall3d") continue;

        if (hitWall(leadObj.x + dx, leadObj.z, mapObj[i])) {
            dx = 0;
        }

        if (hitWall(leadObj.x, leadObj.z + dz, mapObj[i])) {
            dz = 0;
        }
    }
}