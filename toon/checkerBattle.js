/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {

    window.SpriteLibrary = window.SpriteLibrary || { };

    var canvas = document.getElementById("canvas");
    var renderingContext = canvas.getContext("2d");

    var smallestScreenLength = (window.innerWidth < window.innerHeight) ? window.innerWidth: window.innerHeight;
    renderingContext.save();
    renderingContext.scale(smallestScreenLength / 1000, smallestScreenLength / 1000);

    var getTileLocations = function(tileNumber) {
        var tileSize = 122;
            var tileXLocation = (tileNumber % 8) ? (tileNumber % 8) - 1 : 7;
            var tileYLocation = Math.ceil(tileNumber / 8) - 1;
            var tileOne = (12 + tileSize / 2);
            return [tileOne + (tileSize * tileXLocation), tileOne + (tileSize * tileYLocation)];
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
                facialExpression: specs.facialExpression
            }); 
            renderingContext.restore();
        }
    }

    var pieceDefaults = {
        limbAngle: 90,
        elbowAngle: 90,
        facialExpression: 1
    }
    

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
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(2)[0],
                    ty: getTileLocations(2)[1],
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
                    tx: getTileLocations(11)[0],
                    ty: getTileLocations(11)[1],
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
                    tx: getTileLocations(10)[0],
                    ty: getTileLocations(10)[1],
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
                }
            ]
        },
    // Black Piece 2
        {
            draw: piece("black"),
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(4)[0],
                    ty: getTileLocations(4)[1],
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
                    tx: getTileLocations(12)[0],
                    ty: getTileLocations(12)[1],
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
                    tx: getTileLocations(11)[0],
                    ty: getTileLocations(11)[1],
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
                    
                }
            ]
        },
    // Black Piece 3
        {
            draw: piece("black"),
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(6)[0],
                    ty: getTileLocations(6)[1],
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
                    tx: getTileLocations(14)[0],
                    ty: getTileLocations(14)[1],
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
                    tx: getTileLocations(13)[0],
                    ty: getTileLocations(13)[1],
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
                }

            ]
        },
    // Black Piece 4
        {
            draw: piece("black"),
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(8)[0],
                    ty: getTileLocations(8)[1],
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
                    tx: getTileLocations(15)[0],
                    ty: getTileLocations(15)[1],
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
                    tx: getTileLocations(14)[0],
                    ty: getTileLocations(14)[1],
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
                }
            ]
        },
    // Red Piece 1
        {
            draw: piece("red"),
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(57)[0],
                    ty: getTileLocations(57)[1],
                    ease: KeyframeTweener.backwardsAndPast
                },

                {
                    frame: 101,
                    tx: getTileLocations(50)[0],
                    ty: getTileLocations(50)[1],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 125,
                    tx: getTileLocations(50)[0],
                    ty: getTileLocations(50)[1],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(51)[0],
                    ty: getTileLocations(51)[1],
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast
                }
            ]
        },
    // Red Piece 2
        {
            draw: piece("red"),
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(59)[0],
                    ty: getTileLocations(59)[1],
                    ease: KeyframeTweener.backwardsAndPast
                },

                {
                    frame: 125,
                    tx: getTileLocations(51)[0],
                    ty: getTileLocations(51)[1],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(52)[0],
                    ty: getTileLocations(52)[1],
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast
                }
            ]
        },
    // Red Piece 3
        {
            draw: piece("red"),
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(61)[0],
                    ty: getTileLocations(61)[1],
                    ease: KeyframeTweener.backwardsAndPast
                },

                {
                    frame: 125,
                    tx: getTileLocations(53)[0],
                    ty: getTileLocations(53)[1],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(54)[0],
                    ty: getTileLocations(54)[1],                 
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast
                }
            ]
        },
    // Red Piece 4
        {
            draw: piece("red"),
            default: pieceDefaults,
            keyframes: [
                {
                    frame: 0,
                    tx: getTileLocations(63)[0],
                    ty: getTileLocations(63)[1],
                    ease: KeyframeTweener.backwardsAndPast
                },

                {
                    frame: 101,
                    tx: getTileLocations(54)[0],
                    ty: getTileLocations(54)[1],
                    ease: KeyframeTweener.backwardsAndPast
                },
                {
                    frame: 125,
                    tx: getTileLocations(54)[0],
                    ty: getTileLocations(54)[1],
                    ease: KeyframeTweener.backwardsAndPast,
                    easeAdjust: {
                        limbAngle: KeyframeTweener.backAndForth
                    }
                },
                {
                    frame: 200,
                    tx: getTileLocations(55)[0],
                    ty: getTileLocations(55)[1],
                    parameters: {
                        limbAngle: 190
                    },
                    ease: KeyframeTweener.backwardsAndPast
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
    }


    // var keyframeCopier = function(sprite, oldFrame, newFrame, updates) {
    //     var previousKeyframeLength = sprites[sprite].keyframes.length;
    //     for (var keyframe = 0; keyframe < previousKeyframeLength; keyframe++) {
    //         if (sprites[sprite].keyframes[keyframe].frame === oldFrame) {

    //             sprites[sprite].keyframes[previousKeyframeLength] = {};
    //             for (var property in sprites[sprite].keyframes[keyframe]) {
    //                 if (sprites[sprite].keyframes[keyframe].hasOwnProperty(property)) {
    //                     sprites[sprite].keyframes[previousKeyframeLength][property] = 
    //                     sprites[sprite].keyframes[keyframe][property];
    //                 }
    //             }

    //             console.log(sprites[sprite].keyframes[previousKeyframeLength]);
    //             sprites[sprite].keyframes[previousKeyframeLength].frame = newFrame;
    //             for (var update in updates) {
    //                 if (update === "parameters") {
    //                     for (var paramUpdate in updates[update]) {
    //                         console.log(sprites[sprite].keyframes[previousKeyframeLength][update]);
    //                         console.log(!sprites[sprite].keyframes[previousKeyframeLength][update]);
    //                         if (!sprites[sprite].keyframes[previousKeyframeLength][update]) {
    //                             sprites[sprite].keyframes[previousKeyframeLength][update] = {};
    //                         }
    //                         sprites[sprite].keyframes[previousKeyframeLength][update][paramUpdate] = updates[update][paramUpdate];
    //                     }
    //                 } else {
    //                 sprites[sprite].keyframes[previousKeyframeLength][update] = updates[update];                       
    //                 }
    //             }
    //             console.log(sprites[sprite].keyframes[previousKeyframeLength]);
    //         }
    //     }
    // }

    // keyframeCopier(5, 101, 125, {});
    // keyframeCopier(8, 101, 125, {});
    // // Sprites currently [0 = board, 1-4 = black pieces, 5-8 = red pieces]
    // // Current Ending frames, 150 for black, 125 for red...
    // keyframeCopier(5, 125, 200, {tx: getTileLocations(51)[0], parameters: {limbAngle: 0}});
    // keyframeCopier(6, 125, 200, {tx: getTileLocations(52)[0], parameters: {limbAngle: 0}});
    // keyframeCopier(7, 125, 200, {tx: getTileLocations(54)[0], parameters: {limbAngle: 0}});
    // keyframeCopier(8, 125, 200, {tx: getTileLocations(55)[0], parameters: {limbAngle: 0}});
    // keyframeCopier(1, 150, 200, {});
    // keyframeCopier(2, 150, 200, {});
    // keyframeCopier(3, 150, 200, {});
    // keyframeCopier(4, 150, 200, {});
    // // All at frame 200...
    // keyframeCopier(1, 200, 250, {tx: getTileLocations(19)[0], ty: getTileLocations(19)[1], parameters: {limbAngle: 190}});
    // keyframeCopier(2, 200, 250, {tx: getTileLocations(20)[0], ty: getTileLocations(20)[1], parameters: {limbAngle: 190}});
    // keyframeCopier(3, 200, 250, {tx: getTileLocations(22)[0], ty: getTileLocations(22)[1], parameters: {limbAngle: 190}});
    // keyframeCopier(4, 200, 250, {tx: getTileLocations(23)[0], ty: getTileLocations(23)[1], parameters: {limbAngle: 190}});



    holdSpritePositions(sprites[0].keyframes[sprites[0].keyframes.length - 1].frame);

    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());



