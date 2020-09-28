var config = {
    width: 500,
    height: 500,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};
let game = new Phaser.Game(config);
let graphics;
let gridSize = 10;
let cellSize = 40;
let xOffset = (config.width - gridSize * cellSize) / 2;
let yOffset = (config.height - gridSize * cellSize) / 2;
let backgroundColor = Phaser.Display.Color.RGBStringToColor('rgb(85, 185, 243)');
let lineColor = Phaser.Display.Color.RGBStringToColor('rgb(74, 177, 157)');
let lineHoverColor = Phaser.Display.Color.RGBStringToColor('rgba(74, 177, 157, 0.3)');
let pointColor = Phaser.Display.Color.RGBStringToColor('rgb(239, 61, 89)');
let gameSquares = [];
let line;
let arrayOfPointObjs = [];
let listObjs = [];

let players = {
    player1: {
        turn: true,
        color: Phaser.Display.Color.RGBStringToColor('rgb(20, 40, 212)'),
        score: 0
    },
    player2: {
        turn: false,
        color: Phaser.Display.Color.RGBStringToColor('rgb(212, 20, 40)'),
        score: 0
    }
}
var fillPointMap = () => {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
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

        players.player1.turn = !players.player1.turn;
        players.player2.turn = !players.player2.turn;

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

                        // validate if there is a line in this point

                        if (gridX2 > gridX1 && !point.right) {
                            point.right = true;
                            checkSquares(point, arrayOfPointObjs[c + 1][r], false);
                        } else if (gridy2 > gridY1 && !point.down) {
                            point.down = true;
                            checkSquares(point, arrayOfPointObjs[c][r + 1], true);
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
        }
    }

    for (let s = 0; s < gameSquares.length; s++){
        let rect = gameSquares[s].rect;
        let color = gameSquares[s].color;

        graphics.fillStyle(color, 1);
        graphics.fillRectShape(rect);
    }
}

function drawGridLines(point) {

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

    if (!x1 || !x2 || !y1 || !y2) {
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
function checkSquares(a, b, vertical) {
    console.log(a.x, a.y, vertical);
    if (vertical) {
        // test horizontally

        // test if a is not in the left side
        if (a.x > 0) {
            let c = arrayOfPointObjs[a.x - 1][a.y];
            let d = arrayOfPointObjs[a.x - 1][a.y + 1];

            if (a.down && c.right && c.down && d.right) {
                gameSquares.push({
                    color: players.player1.turn ? players.player1.color.color : players.player2.color.color,
                    rect: new Phaser.Geom.Rectangle(
                        c.x * cellSize + xOffset,
                        c.y * cellSize + yOffset,
                        cellSize,
                        cellSize)
                });
            }
        }
        // this is a is not in the right side
        if (a.x < gridSize - 1){
            let c = arrayOfPointObjs[a.x + 1][a.y];

            if (a.down && a.right && c.down && b.right) {
                gameSquares.push({
                    color: players.player1.turn ? players.player1.color.color : players.player2.color.color,
                    rect: new Phaser.Geom.Rectangle(
                        a.x * cellSize + xOffset,
                        a.y * cellSize + yOffset,
                        cellSize,
                        cellSize)
                });
            }
        }

    }
    else {
        // test vertically
        if (a.y > 0) {
            let c = arrayOfPointObjs[a.x][a.y - 1];
            let d = arrayOfPointObjs[a.x + 1][a.y - 1];
            if (a.right && c.right && c.down && d.down){
                gameSquares.push({
                    color: players.player1.turn ? players.player1.color.color : players.player2.color.color,
                    rect: new Phaser.Geom.Rectangle(
                        c.x * cellSize + xOffset,
                        c.y * cellSize + yOffset,
                        cellSize,
                        cellSize)
                });
            }

            if (a.y < gridSize - 1){
                let c = arrayOfPointObjs[a.x][a.y + 1];

                if (a.right && a.down && c.right && b.down){
                    gameSquares.push({
                        color: players.player1.turn ? players.player1.color.color : players.player2.color.color,
                        rect: new Phaser.Geom.Rectangle(
                            a.x * cellSize + xOffset,
                            a.y * cellSize + yOffset,
                            cellSize,
                            cellSize)
                    });
                }
            }
        }
    }
    // pushLinesforfill
    // drawSquare()
}

function debugMe() {
    console.log(players.player1.color.color);
}