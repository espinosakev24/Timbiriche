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

function create() {
    graphics = this.add.graphics(
        {
            fillStyle: { width: 2, color: pointColor.color },
            lineStyle: { width: 4, color: lineHoverColor.color }
        }

    );
    this.cameras.main.setBackgroundColor(backgroundColor);

    this.input.on('pointerdown', function (pointer) {
        if (isLineInsideGrid(line)) {
            lines.push(line);
        }
    }, this);

}

function update() {
    let pointer = this.input.activePointer;

    graphics.clear();



    line = getMouseLine(pointer);

    drawMouseLine(line);

    for (let c = 0; c < gridSize; c++) {
        for (let r = 0; r < gridSize; r++) {
            drawCircle(xOffset + c * cellSize, yOffset + r * cellSize);
        }
    }
    graphics.lineStyle(4, lineColor.color);
    for (let l = 0; l < lines.length; l++) {
        graphics.strokeLineShape(lines[l]);
    }
}

function drawMouseLine(line) {
    if (!isLineInsideGrid(line)) {
        return;
    }

    graphics.lineStyle(4, lineHoverColor.color);

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