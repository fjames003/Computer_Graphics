/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {

    window.SpriteLibrary = window.SpriteLibrary || { };

    var canvas = document.getElementById("canvas");
    var renderingContext = canvas.getContext("2d");

    var smallestScreenLength = (window.innerWidth < window.innerHeight) ? window.innerWidth * 0.95: window.innerHeight * 0.95;
    renderingContext.save();
    renderingContext.scale(smallestScreenLength / 1000, smallestScreenLength / 1000);

    var tileSize = 122;
    var getTileLocations = function(tileNumber) {
        var tileXLocation = (tileNumber % 8) ? (tileNumber % 8) - 1 : 7;
        var tileYLocation = Math.ceil(tileNumber / 8) - 1;
        var tileOne = (12 + tileSize / 2);
        return {
            tx: tileOne + (tileSize * tileXLocation),
            ty: tileOne + (tileSize * tileYLocation)
        }
    };

    var board = function(specs) {
        SpriteLibrary.drawBoard({
            renderingContext: specs.renderingContext,
            border: specs.border,
            degradation: specs.degradation,
            waveFrequency: specs.waveFrequency
        }); 
    };

    var piece = function(color) {
        return function(specs) {
            var renderingContext = specs.renderingContext;
            renderingContext.save();
            renderingContext.scale(0.48, 0.48);
            SpriteLibrary.drawPiece({
                renderingContext: renderingContext,
                color: color,
                limbAngle: specs.limbAngle,
                elbowAngle: specs.elbowAngle,
                facialExpression: specs.facialExpression,
                opacity: specs.opacity
            }); 
            renderingContext.restore();
        }
    };

    var pieceDefaulters = {
        limbAngle: 90,
        elbowAngle: 90,
        facialExpression: 1, 
        opacity: 255
    };
    
    var sprites = [
    // The CheckerBoard...
        {
            draw: board,
            keyframes: [
                {
                    frame: 0,
                    ease: KeyframeTweener.linear,
                    parameters: {
                        waveFrequency: 0.03,
                        degradation: 0
                    }
                },
                {
                    frame: 1000,
                    parameters: {
                        waveFrequency: 0.1,
                        degradation: 100 
                    }  
                }
            ]
        },
    // Black Piece 1
        {
            draw: piece("black"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(2)["tx"],
                    ty: getTileLocations(2)["ty"],
                    parameters: {
                        limbAngle: 120,
                        elbowAngle: 90,
                        facialExpression: 1
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 101,
                    tx: getTileLocations(11)["tx"],
                    ty: getTileLocations(11)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 0
                    },                    
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        rotate: KeyframeTweener.quadEaseOut,
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 150,
                    tx: getTileLocations(10)["tx"],
                    ty: getTileLocations(10)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    rotate: -360,
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(10)["tx"],
                    ty: getTileLocations(10)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 225,
                    tx: getTileLocations(19)["tx"],
                    ty: getTileLocations(19)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 120
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                    }
                },
                {
                    frame: 300,
                    tx: getTileLocations(28)["tx"],
                    ty: getTileLocations(28)["ty"],
                    parameters: {
                        limbAngle: 50,
                        elbowAngle: -120
                    }
                },
                {
                    frame: 695,
                    tx: getTileLocations(28)["tx"],
                    ty: getTileLocations(28)["ty"],
                    rotate: -360,
                    parameters: {
                        limbAngle: 50,
                        elbowAngle: -120
                    }
                },
                {
                    frame: 715,
                    tx: getTileLocations(27.5)["tx"],
                    ty: getTileLocations(28)["ty"] - tileSize / 2,
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 0
                    }
                },
                {
                    frame: 750,
                    tx: getTileLocations(27.5)["tx"],
                    ty: getTileLocations(28)["ty"] - tileSize / 2,
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 0,
                        opacity: 0
                    }
                }
            ]
        },
    // Black Piece 2
        {
            draw: piece("black"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(4)["tx"],
                    ty: getTileLocations(4)["ty"],
                    parameters: {
                        limbAngle: 120,
                        elbowAngle: 90
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 125,
                    tx: getTileLocations(12)["tx"],
                    ty: getTileLocations(12)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 0
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }       
                },
                {
                    frame: 150,
                    tx: getTileLocations(11)["tx"],
                    ty: getTileLocations(11)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    rotate: -360,
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    } 
                },
                {
                    frame: 200,
                    tx: getTileLocations(10)["tx"],
                    ty: getTileLocations(10)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 225,
                    tx: getTileLocations(20)["tx"],
                    ty: getTileLocations(20)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 120
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.inOutCirc
                    }
                },
                {
                    frame: 300,
                    tx: getTileLocations(20)["tx"],
                    ty: getTileLocations(20)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 120
                    },
                    rotate: -90,
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.inOutCirc
                    }
                },
                {
                    frame: 500,
                    tx: getTileLocations(19)["tx"],
                    ty: getTileLocations(19)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        opacity: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 650,
                    tx: getTileLocations(19)["tx"],
                    ty: getTileLocations(19)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 5,
                        opacity: 0
                    }
                }
            ]
        },
    // Black Piece 3
        {
            draw: piece("black"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(6)["tx"],
                    ty: getTileLocations(6)["ty"],
                    parameters: {
                        limbAngle: 120,
                        elbowAngle: 90,
                        facialExpression: 1
                    },                    
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 101,
                    tx: getTileLocations(14)["tx"],
                    ty: getTileLocations(14)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 0
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 150,
                    tx: getTileLocations(13)["tx"],
                    ty: getTileLocations(13)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    rotate: -360,
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(10)["tx"],
                    ty: getTileLocations(10)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 225,
                    tx: getTileLocations(22)["tx"],
                    ty: getTileLocations(22)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 120
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 250,
                    tx: getTileLocations(21)["tx"],
                    ty: getTileLocations(21)["ty"],
                    parameters: {
                        limbAngle: 50,
                        elbowAngle: -120
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.inOutCirc
                    }
                },
                {
                    frame: 300,
                    tx: getTileLocations(21)["tx"],
                    ty: getTileLocations(21)["ty"],
                    parameters: {
                        limbAngle: 50,
                        elbowAngle: -120,
                        facialExpression: -1
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.inOutCirc
                    },
                    rotate: -90
                },
                {
                    frame: 500,
                    tx: getTileLocations(22)["tx"],
                    ty: getTileLocations(22)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: -5
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        opacity: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 650,
                    tx: getTileLocations(22)["tx"],
                    ty: getTileLocations(22)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: -1,
                        opacity: 0
                    }
                }

            ]
        },
    // Black Piece 4
        {
            draw: piece("black"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(8)["tx"],
                    ty: getTileLocations(8)["ty"],
                    parameters: {
                        limbAngle: 120,
                        elbowAngle: 90,
                        facialExpression: 1
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 125,
                    tx: getTileLocations(15)["tx"],
                    ty: getTileLocations(15)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 0
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 150,
                    tx: getTileLocations(14)["tx"],
                    ty: getTileLocations(14)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    rotate: -360,
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(10)["tx"],
                    ty: getTileLocations(10)["ty"],
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: -270
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut,
                        rotate: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 225,
                    tx: getTileLocations(23)["tx"],
                    ty: getTileLocations(23)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 120
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 250,
                    tx: getTileLocations(22)["tx"],
                    ty: getTileLocations(22)["ty"],
                    parameters: {
                        limbAngle: 50,
                        elbowAngle: -120
                    },
                    ease: KeyframeTweener.inOutCirc,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.quadEaseOut,
                        elbowAngle: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 300,
                    tx: getTileLocations(29)["tx"],
                    ty: getTileLocations(29)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 120
                    }
                },
                {
                    frame: 695,
                    tx: getTileLocations(29)["tx"],
                    ty: getTileLocations(29)["ty"],
                    rotate: 360,
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 120
                    }
                },
                {
                    frame: 715,
                    tx: getTileLocations(29.5)["tx"],
                    ty: getTileLocations(28)["ty"] - tileSize / 2,
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 0
                    }
                },
                {
                    frame: 750,
                    tx: getTileLocations(29.5)["tx"],
                    ty: getTileLocations(28)["ty"] - tileSize / 2,
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 0,
                        opacity: 0
                    }
                }
            ]
        },
    // Red Piece 1
        {
            draw: piece("red"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(57)["tx"],
                    ty: getTileLocations(57)["ty"],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 101,
                    tx: getTileLocations(50)["tx"],
                    ty: getTileLocations(50)["ty"],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 125,
                    tx: getTileLocations(50)["tx"],
                    ty: getTileLocations(50)["ty"],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(51)["tx"],
                    ty: getTileLocations(51)["ty"],
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                        tx: KeyframeTweener.inOutCirc,
                        ty: KeyframeTweener.inOutCirc
                    }
                },
                {
                    frame: 250,
                    tx: getTileLocations(43)["tx"],
                    ty: getTileLocations(43)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 135
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                        facialExpression: KeyframeTweener.backAndForth,
                        rotate: KeyframeTweener.inOutCirc,
                        tx: KeyframeTweener.inOutCirc,
                        ty: KeyframeTweener.inOutCirc
                    }
                },
                {
                    frame: 325,
                    tx: getTileLocations(44)["tx"],
                    ty: getTileLocations(44)["ty"],
                    rotate: -360,
                    parameters: {
                        limbAngle: 1,
                        elbowAngle: 225,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 500,
                    tx: getTileLocations(44.5)["tx"],
                    ty: getTileLocations(44.5)["ty"],
                    rotate: -360,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 90,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                  frame: 650,
                    tx: getTileLocations(44.5)["tx"],
                    ty: getTileLocations(40.5)["ty"],
                    rotate: -270,
                    parameters: {
                        limbAngle: 120,
                        elbowAngle: 90
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }  
                },
                {
                    frame: 725,
                    tx: getTileLocations(44.5)["tx"],
                    ty: getTileLocations(28)["ty"] + tileSize / 2,
                    rotate: -450,
                    parameters: {
                        limbAngle: 60,
                        elbowAngle: 90
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 950,
                    tx: getTileLocations(28.5)["tx"],
                    ty: getTileLocations(28)["ty"] + tileSize / 2,
                    rotate: -360,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 90
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 1050,
                    tx: getTileLocations(28.5)["tx"],
                    ty: getTileLocations(28)["ty"] + tileSize / 2,
                    rotate: -360,
                    sx: 3,
                    sy: 3,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 90
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                }
            ]
        },
    // Red Piece 2
        {
            draw: piece("red"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(59)["tx"],
                    ty: getTileLocations(59)["ty"],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 125,
                    tx: getTileLocations(51)["tx"],
                    ty: getTileLocations(51)["ty"],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(52)["tx"],
                    ty: getTileLocations(52)["ty"],
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 250,
                    tx: getTileLocations(44)["tx"],
                    ty: getTileLocations(44)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 135
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 325,
                    tx: getTileLocations(36)["tx"],
                    ty: getTileLocations(36)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 500,
                    tx: getTileLocations(35.5)["tx"],
                    ty: getTileLocations(36)["ty"],
                    rotate: 450,
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 675,
                    tx: getTileLocations(35.5)["tx"],
                    ty: getTileLocations(36)["ty"],
                    rotate: -450,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 180,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                        opacity: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 800,
                    tx: getTileLocations(35.5)["tx"],
                    ty: getTileLocations(36)["ty"],
                    rotate: -450,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 180,
                        facialExpression: 5,
                        opacity: 0
                    }
                }
            ]
        },
    // Red Piece 3
        {
            draw: piece("red"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(tileSize / 2)["tx"],
                    ty: getTileLocations(tileSize / 2)["ty"],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 125,
                    tx: getTileLocations(53)["tx"],
                    ty: getTileLocations(53)["ty"],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(54)["tx"],
                    ty: getTileLocations(54)["ty"],                 
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 250,
                    tx: getTileLocations(46)["tx"],
                    ty: getTileLocations(46)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 135
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 325,
                    tx: getTileLocations(37)["tx"],
                    ty: getTileLocations(37)["ty"],
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 500,
                    tx: getTileLocations(37.5)["tx"],
                    ty: getTileLocations(37.5)["ty"],
                    rotate: -450,
                    parameters: {
                        limbAngle: 190,
                        elbowAngle: 225,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 675,
                    tx: getTileLocations(37.5)["tx"],
                    ty: getTileLocations(37.5)["ty"],
                    rotate: 450,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 180,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                        opacity: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 800,
                    tx: getTileLocations(37.5)["tx"],
                    ty: getTileLocations(37.5)["ty"],
                    rotate: 450,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 180,
                        facialExpression: 5,
                        opacity: 0
                    }
                }
            ]
        },
    // Red Piece 4
        {
            draw: piece("red"),
            defaulter: pieceDefaulters,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(63)["tx"],
                    ty: getTileLocations(63)["ty"],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 101,
                    tx: getTileLocations(54)["tx"],
                    ty: getTileLocations(54)["ty"],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 125,
                    tx: getTileLocations(54)["tx"],
                    ty: getTileLocations(54)["ty"],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(55)["tx"],
                    ty: getTileLocations(55)["ty"],
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                        tx: KeyframeTweener.inOutCirc,
                        ty: KeyframeTweener.inOutCirc
                    }
                },
                {
                    frame: 250,
                    tx: getTileLocations(47)["tx"],
                    ty: getTileLocations(47)["ty"],
                    parameters: {
                        limbAngle: 135,
                        elbowAngle: 135
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                        facialExpression: KeyframeTweener.backAndForth,
                        rotate: KeyframeTweener.inOutCirc,
                        tx: KeyframeTweener.inOutCirc,
                        ty: KeyframeTweener.inOutCirc
                    }
                },
                {
                    frame: 325,
                    tx: getTileLocations(45)["tx"],
                    ty: getTileLocations(45)["ty"],
                    rotate: 360,
                    parameters: {
                        limbAngle: 1,
                        elbowAngle: 225,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                    }
                },
                {
                    frame: 500,
                    tx: getTileLocations(44.5)["tx"],
                    ty: getTileLocations(44.5)["ty"],
                    rotate: 360,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 270,
                        facialExpression: 5
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                    }
                },
                {
                  frame: 650,
                    tx: getTileLocations(44.5)["tx"],
                    ty: getTileLocations(40.5)["ty"],
                    rotate: 450,
                    parameters: {
                        limbAngle: 120,
                        elbowAngle: 270,
                        facialExpression: 4
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }  
                },
                {
                    frame: 725,
                    tx: getTileLocations(44.5)["tx"],
                    ty: getTileLocations(28)["ty"] + tileSize / 2,
                    rotate: 270,
                    parameters: {
                        limbAngle: 60,
                        elbowAngle: 270,
                        facialExpression: 3
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 950,
                    tx: getTileLocations(28.5)["tx"],
                    ty: getTileLocations(28)["ty"] + tileSize / 2,
                    rotate: 360,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 270,
                        facialExpression: 2
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth,
                        facialExpression: KeyframeTweener.quadEaseOut
                    }
                },
                {
                    frame: 1050,
                    tx: getTileLocations(28.5)["tx"],
                    ty: getTileLocations(28)["ty"] + tileSize / 2,
                    rotate: 360,
                    sx: 3,
                    sy: 3,
                    parameters: {
                        limbAngle: 90,
                        elbowAngle: 270,
                        facialExpression: 1
                    },
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth,
                        elbowAngle: KeyframeTweener.backAndForth
                    }
                }
            ]
        }
    ];

    var holdSpritePositions = function(frame) {
        for (var sprite = 1; sprite < sprites.length; sprite++) {
            var previousKeyframeLength = sprites[sprite].keyframes.length;
            sprites[sprite].keyframes[previousKeyframeLength] = Object.create(sprites[sprite].keyframes[previousKeyframeLength - 1]);
            sprites[sprite].keyframes[previousKeyframeLength].frame = frame;
        }
    };

    // holdSpritePositions(sprites[0].keyframes[sprites[0].keyframes.length - 1].frame);

    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());