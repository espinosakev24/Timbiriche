var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var graphics;
var gridSize = 10;
var cellSize = 40;
var xOffset = (config.width - gridSize * cellSize) / 2;
var yOffset = (config.height - gridSize * cellSize) / 2;
var backgroundColor = Phaser.Display.Color.RGBStringToColor('rgb(239, 201, 88)');
var lineColor = Phaser.Display.Color.RGBStringToColor('rgb(74, 177, 157)');
var lineHoverColor = Phaser.Display.Color.RGBStringToColor('rgba(74, 177, 157, 0.3)');
var pointColor = Phaser.Display.Color.RGBStringToColor('rgb(239, 61, 89)');
var lines = [];
var line;

// var point = {
//     x: x,
//     y: y,
//     up: false,
//     rigth: false,
//     left: false,
//     down: false,
// }

var arrayOfPointObjs = [];


// var fillPointMap = () => {
//     for(let x = 0; x < gridSize; x++) {
//         for(let y = 0; y < gridSize; y++) {
//             arrayOfPointObjs.push([{
//                 x: x,
//                 y: y,
//                 right: true,
//                 up: false,
//                 left: false,
//                 down: false
//             }]);
//         }
//     }
// }
let listObjs = [];
var fillPointMap = () => {
    for(let x = 0; x < gridSize; x++) {
        for(let y = 0; y < gridSize; y++) {
        	listObjs.push({
                x: x,
                y: y,
                right: false,
                down: false
            })
        }
         arrayOfPointObjs.push(listObjs);
         listObjs = [];
    }
}
function create() {
    fillPointMap();
    graphics = this.add.graphics(
        {
            fillStyle: { width: 2, color: pointColor.color },
            lineStyle: { width: 4, color: lineHoverColor.color }
        }

    );
    this.cameras.main.setBackgroundColor(backgroundColor);

    this.input.on('pointerdown', function (pointer) {
        if (isLineInsideGrid(line)) {
            let x1 = line.x1;
            let x2 = line.x2;
            let y1 = line.y1;
            let y2 = line.y2;

            let gridX1 = (x1 - xOffset) / cellSize;
            let gridY1 = (y1 - yOffset) / cellSize;
            let gridX2 = (x2 - xOffset) / cellSize;
            let gridy2 = (y2 - yOffset) / cellSize;

            for (let c = 0; c < gridSize; c++) {
                for (let r = 0; r < gridSize; r++) {
                    let point = arrayOfPointObjs[c][r];

                    if (point.x === gridX1 && point.y === gridY1) {
                        if (gridX2 > gridX1) {
                            point.right = true;
                        } else if (gridy2 > gridY1) {
                            point.down = true;
                        }
                    }
                }
            }

        }
    }, this);

}

function update() {
    let pointer = this.input.activePointer;

    graphics.clear();



    line = getMouseLine(pointer);

    drawLine(line, 4, lineHoverColor.color);

    graphics.lineStyle(4, lineColor.color);

    for (let c = 0; c < gridSize; c++) {
        for (let r = 0; r < gridSize; r++) {
            let point = arrayOfPointObjs[c][r];

            drawGridLines(point);

            drawCircle(xOffset + point.x * cellSize, yOffset + point.y * cellSize);
            // graphics.strokeLineShape(lines[c])
        	// graphics.strokeLineShape(lines[c]);
        }
    }
}

function drawGridLines(point){

    let line;
    let x1, x2, y1, y2;

    if (point.right) {

        x1 = point.x * cellSize + xOffset;
        y1 = point.y * cellSize + yOffset;
        x2 = (point.x + 1) * cellSize + xOffset;
        y2 = point.y * cellSize + yOffset;

        line = new Phaser.Geom.Line(
            x1, y1, x2, y2
        );
        drawLine(line, 2, lineColor.color);
    }

    if (point.down) {
        x1 = point.x * cellSize + xOffset;
        y1 = point.y * cellSize + yOffset;
        x2 = point.x * cellSize + xOffset;
        y2 = (point.y + 1) * cellSize + yOffset;
        
        line = new Phaser.Geom.Line(
            x1, y1, x2, y2
        );

        drawLine(line, 2, lineColor.color);
    }

    if (!x1 || !x2 || !y1 || !y2){
        return;
    }

}

function drawLine(line, tickness, color) {
    if (!isLineInsideGrid(line)) {
        return;
    }

    graphics.lineStyle(tickness, color);

    graphics.strokeLineShape(line);
}

function getMouseLine(pointer) {
    let mouseX = pointer.worldX;
    let mouseY = pointer.worldY;

    let rowX = (mouseX - xOffset) / cellSize;
    let rowY = (mouseY - yOffset) / cellSize;
    let distX = Math.abs(rowX - Math.round(rowX));
    let distY = Math.abs(rowY - Math.round(rowY));
    if (distY < distX) {
        return new Phaser.Geom.Line(
            xOffset + Math.floor(rowX) * cellSize,
            yOffset + Math.round(rowY) * cellSize,
            xOffset + Math.ceil(rowX) * cellSize,
            yOffset + Math.round(rowY) * cellSize);
    }
    return new Phaser.Geom.Line(
        xOffset + Math.round(rowX) * cellSize,
        yOffset + Math.floor(rowY) * cellSize,
        xOffset + Math.round(rowX) * cellSize,
        yOffset + Math.ceil(rowY) * cellSize);
}

function drawCircle(x, y) {
    var circle = new Phaser.Geom.Circle(x, y, 2);
    graphics.fillCircleShape(circle);
}

function isLineInsideGrid(line) {
    let x1 = line.x1;
    let y1 = line.y1;
    let x2 = line.x2;
    let y2 = line.y2;

    return !(
        x1 - xOffset < 0 || x1 - xOffset > (gridSize - 1) * cellSize
        || x2 - xOffset < 0 || x2 - xOffset > (gridSize - 1) * cellSize
        || y1 - yOffset < 0 || y1 - yOffset > (gridSize - 1) * cellSize
        || y2 - yOffset < 0 || y2 - yOffset > (gridSize - 1) * cellSize)
}