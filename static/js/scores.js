/*jslint es6, node, for*/

const scores = [];

scores.push(function pause() {
    "use strict";
    
    let annotations = {
        type: "function",
        text: function generateAnnotation(part) {
            const ANNOTATIONS = [
                "minimum 10 seconds",
                "minimum 30 seconds",
                "minimum 90 seconds"
            ];

            return ANNOTATIONS[part];
        }
    };
    
    annotations.preview = annotations;
    
    return {
        type: "pause",
        annotations: annotations
    };
}());

scores.push(function diagram10_2v1() {
    "use strict";
    
    return {
        type: "scroll_loop",
        image: "diagram10-2v1.png",
        background: "black",
        parts: [
            576,
            719,
            446
        ],
        speed: [
            17.432,
            13.96,
            22.5
        ],
        loudness: [
            [1, 2, 3, 4],   // 0
            [1, 2, 3, 4],   // 1
            [1, 2, 3, 4]    // 2
        ],
        annotations: {
            type: "fixed",
            text: [
                "<br>[dots]<br>percussive sounds<br><br>[white background]<br>silence<br><br>[brown background]<br>low tones<br><br>[gray background]<br>air sounds"
            ],
            preview: {
                type: "array",
                text: [
                    "percussive sounds",
                    "percussive sounds and low tones",
                    "percussive sounds and air sounds"
                ]
            }
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 2) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 2,
                        part: 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function polygon1v1() {
    "use strict";
    
    return {
        type: "map",
        image: "polygon1v1-full.png",
        parts: [
            [453, 1191, 58, 57],    // 0
            [931, 1118, 111, 88],   // 1
            [1261, 1520, 90, 76],   // 2
            [1605, 1220, 69, 68],   // 3
            [1581, 1494, 210, 165], // 4
            [1570, 1718, 96, 101],  // 5
            [1656, 1379, 71, 68],   // 6
            [1713, 1517, 96, 96]    // 7
        ],
        durations: [
            10.404,  // 0
            21.218,  // 1
            15.987,  // 2
            13.513,  // 3
            45,      // 4
            22.121,  // 5
            13.050,  // 6
            20.454   // 7
        ],
        network: [
            [1, 2],             // 0
            [0, 2, 3],          // 1
            [4, 5, 3, 1, 0],    // 2
            [6, 4, 2, 1],       // 3
            [7, 6, 5, 3, 2],    // 4
            [4, 7, 2],          // 5
            [4, 7, 3],          // 6
            [4, 6, 5]           // 7
        ],
        transition: function transition(from, to) {
            let transitions = [];

            let i;

            for (i = 0; i < 8; i += 1) {
                transitions.push([]);
            }

            transitions[0][1] = 15.012;
            transitions[0][2] = 21.709;

            transitions[1][0] = 15.012;
            transitions[1][2] = 15.711;
            transitions[1][3] = 18.604;

            transitions[2][0] = 21.709;
            transitions[2][1] = 15.711;
            transitions[2][3] = 14.486;
            transitions[2][4] = 11.611;
            transitions[2][5] = 12.616;

            transitions[3][1] = 18.604;
            transitions[3][2] = 14.486;
            transitions[3][4] = 10.555;
            transitions[3][6] = 7.731;

            transitions[4][2] = 11.611;
            transitions[4][3] = 10.555;
            transitions[4][5] = 9.277;
            transitions[4][6] = 6.827;
            transitions[4][7] = 6.732;

            transitions[5][2] = 12.616;
            transitions[5][4] = 9.277;
            transitions[5][7] = 9.844;

            transitions[6][3] = 7.731;
            transitions[6][4] = 6.827;
            transitions[6][7] = 7.202;

            transitions[7][4] = 6.732;
            transitions[7][5] = 9.844;
            transitions[7][6] = 7.202;
            
            if (from === -1) {
                return 0;
            }
                    
            return transitions[from][to];
        },
        histogram: [
            0, 0, 0, 0, 0, 0, 0, 0
        ],
        loudness: [
            [1, 2],         // 0
            [1],            // 1
            [1, 2, 3, 4],   // 2
            [1, 2],         // 3
            [1, 2, 3, 4],   // 4
            [1],            // 5
            [1],            // 6
            [1, 2]          // 7
        ],
        annotations: {
            type: "fixed",
            text: "<br><u>static image</u><br><br>each different color in the shape enclosed by the dashed rectangle indicates a different multiphonic<br><br><br><u>moving image</u><br><br>[white background]<br>silence<br><br>[foggy background]<br>air sounds",
            preview: {
                type: "fixed",
                text: "different multiphonics"
            }
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 1,
                        part: 2
                    }
                }];
            }
            if (from === 3) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 5) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 3,
                        part: 3
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function iS1iS2_x1iS6iS5() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "] 3 & [ { }",
            "many",
            ", entangled",
            "",
            "{an irritating hassle that will disappear when",
            "a lot of threads",
            "[",
            "-",
            "",
            "just the flatness of some dust left in a big closed box",
            ". /",
            "   [trying to dissolve into, . 123 ^^  ^  . ^",
            "",
            "   ^",
            "",
            "",
            "a babble in the background",
            "                                 . - - / // / (& the excess of things",
            "                                                                       is just some light",
            ".",
            ".",
            "   _- -  -    - -",
            "nothing more than a wide, stagnant",
            "."
        ],
        parts: [
            1,
            3,
            1,
            1,
            3,
            1,
            6,
            1,
            1,
            1,
            3,
            2
        ],
        loudness: [
            [1, 2, 3, 4],   // 0
            [5],            // 1
            [2, 3, 4, 5],   // 2
            [5],            // 3
            [1, 2, 3, 4],   // 4
            [1, 2, 3, 4],   // 5
            [6],            // 6
            [1, 2, 3],      // 7
            [2, 3, 4],      // 8
            [1, 2],         // 9
            [1, 2, 3, 4],   // 10
            [1, 2, 3]       // 11
        ],
        annotations: {
            type: "array",
            text: [
                "percussive sounds",                                                                    // 0
                "very active and complicated passages with many notes",                                 // 1
                "screeching sounds",                                                                    // 2
                "very active and complicated passages with many notes",                                 // 3
                "percussive sounds",                                                                    // 4
                "long air sounds, with mouthpiece (into and a bit away from mouthpiece) and without mouthpiece (a bit away from mouthpiece) (no whistles), incorporating flutter-tongue and trills, and shaking tube",  // 5
                "interrupt with pauses, several accents in the end",                                    // 6
                "fast, incomprehensible speaking into mouthpiece/tube",                                 // 7
                "percussive sounds, more and more active",                                              // 8
                "long high tones, slightly fluctuating in pitch",                                       // 9
                "percussive sounds",                                                                    // 10
                "long low tones, steady pitch"                                                          // 11
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 2,
                        part: 5
                    }
                }];
            }
            
            if (from === 2) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 4,
                        part: 1
                    }
                }];
            }
            
            if (from === 6) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 11) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 5,
                        part: 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function iS1iS2iS3() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "playing in the junkyard... m \\ scattered",
            "45g xc",
            "",
            ", entangled",
            "qwk0-0,",
            "mU,       gzoO; wqappPQ?U0O + .   s     S >>",
            "mn786\"@$% $| aqwqp     Ö Ü ´´´´",
            ". ..  .    cN ; / a     O",
            "   §:\" 1] $",
            "             ] }",
            "",
            "[ small, even tiny      IN",
            ". /",
            "{0,\"in its ",
            "\"complexity, relative\" significance\"",
            "                                                                 \\\\\\      \\\\ \\\\                               1,",
            "           \\\\",
            "\\\\\\\\\\ //// / //    \\\\\\                      \\\\\\\\\\\\\\\\\\\\",
            "         \\\\",
            "                   \\\\\\ \\\\\\ // \\\\\\\\\\/\\/\\\\\\\\\\\\\\",
            "       /                                                 ****",
            "       \\                                                                      ******************",
            "  ********************",
            "                               | /        //  **",
            "                 /                                   \\       \\\\\\\\",
            " /",
            "                                                                                   * { / /        /could be",
            "",
            "muted agitation - some light but",
            ",  a",
            "cre-",
            "-eaaeaeaaeekkkkk",
            "== creakingly",
            "",
            "maybe                                   **                           */ //",
            "                                                                                                             2:",
            "                                                                                                               ?",
            "",
            "crawling like a"
        ],
        parts: [
            3,
            8,
            4,
            13,
            1,
            5,
            4,
            1
        ],
        loudness: [
            [1, 2, 3, 4],   // 0
            [1, 2, 3, 4],   // 1
            [2],            // 2
            [1, 2, 3, 4],   // 3
            [1],            // 4
            [3, 4, 5],      // 5
            [1, 2, 3, 4],   // 6
            [6]             // 7
        ],
        annotations: {
            type: "array",
            text: [
                "without mouthpiece, whistle sounds, rubbing tube with plastic card",
                "without mouthpiece, syllables",
                "with sax mouthpiece, long tones and multiphonics",
                "with trumpet mouthpiece, percussive sounds",
                "with sax mouthpiece, high tone, constantly changing intonation, timbre, and dynamics (within very soft)",
                "with sax mouthpiece, low tone, beating with voice",
                "with sax mouthpiece, percussive sounds",
                "without mouthpiece, whistle sounds, plastic card"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 5,
                        part: 2
                    }
                }];
            }
            
            if (from === 7) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function tMs3() {
    "use strict";
    
    return {
        type: "audio",
        audio: [
            "tpc-MBP12-put_to_sleep_and_woken_up-key_3_1.mp3",
            "tpc-MBP12-put_to_sleep_and_woken_up-key_3_2.mp3",
            "tpc-MBP12-put_to_sleep_and_woken_up-key_3_3.mp3",
            "tpc-MBP12-put_to_sleep_and_woken_up-key_3_4.mp3"
        ],
        loudness: [
            [4, 5], // 0
            [2, 3], // 1
            [1],    // 2
            [4, 5]  // 3
        ],
        annotations: {
            type: "array",
            text: [
                "chaotic singing and playing, lots of low tones",
                "following melody",
                "very high whistle and air sounds",
                "chaotic singing and playing, lots of low tones"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 3,
                        part: 11
                    }
                }];
            }
            
            if (from === 3) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function pencil2() {
    "use strict";
    
    const annotations = [
        "toothbrush with speed control, multiple motors during (and/or after) the black chaotic figure, moving objects chaotically during the colorful chaotic figure",
        "frothing wand (bent), then multiple motors",
        "low motor sounds (two motors)",
        "low motor sounds (one motor)",
        "rubber band on wooden box",
        "rubber band on plastic package",
        "rubber band on ceramic jar",
        "rubber band on ceramic jar"
    ];
    
    return {
        type: "scroll_mod",
        image: "pencil2-mod.png",
        grid: 800,
        widths: [
            [774, 213],
            [371, 135],
            [108, 66],
            [77, 65],
            [90, 76],
            [155, 69],
            [25, 21],
            [60, 60]
        ],
        speed: 7,
        network: [
            [4, 2, 5, 8, 9],            // 0
            [2, 6],                     // 1
            [9, 10, 12, 13, 8, 7, 14],  // 2
            [4, 5, 1, 8, 0],            // 3
            [2, 8, 1, 9],               // 4
            [2, 1, 9],                  // 5
            [3, 12, 10, 14, 0],         // 6
            [12, 14, 0],                // 7
            [10, 3, 12, 13, 5, 4, 1],   // 8
            [3, 5, 2, 1],               // 9
            [13, 12, 14],               // 10
            [13, 9, 12, 3, 15, 7],      // 11
            [10, 14, 15, 3, 9, 11],     // 12
            [10, 14, 3, 9, 15, 11, 6],  // 13
            [13, 12, 10],               // 14
            [13, 12, 3, 11, 7]          // 15
        ],
        transition: function transition(from, to) {
            let transitions = [];

            let i;

            for (i = 0; i < 16; i += 1) {
                transitions.push([]);
            }

            transitions[0][2] = 107;
            transitions[0][4] = 100;
            transitions[0][5] = 126;
            transitions[0][8] = 196;
            transitions[0][9] = 215;

            transitions[1][2] = 278;
            transitions[1][6] = 300;

            transitions[2][7] = 83;
            transitions[2][8] = 81;
            transitions[2][9] = 42;
            transitions[2][10] = 55;
            transitions[2][12] = 56;
            transitions[2][13] = 64;
            transitions[2][14] = 88;

            transitions[3][0] = 278;
            transitions[3][1] = 107;
            transitions[3][4] = 29;
            transitions[3][5] = 68;
            transitions[3][8] = 156;

            transitions[4][1] = 126;
            transitions[4][2] = 68;
            transitions[4][8] = 116;
            transitions[4][9] = 132;

            transitions[5][1] = 100;
            transitions[5][2] = 29;
            transitions[5][9] = 162;

            transitions[6][0] = 294;
            transitions[6][3] = 83;
            transitions[6][10] = 115;
            transitions[6][12] = 105;
            transitions[6][14] = 121;

            transitions[7][0] = 300;
            transitions[7][12] = 117;
            transitions[7][14] = 138;

            transitions[8][1] = 215;
            transitions[8][3] = 42;
            transitions[8][4] = 162;
            transitions[8][5] = 132;
            transitions[8][10] = 41;
            transitions[8][12] = 63;
            transitions[8][13] = 65;

            transitions[9][1] = 196;
            transitions[9][2] = 156;
            transitions[9][3] = 81;
            transitions[9][5] = 116;
            
            transitions[10][12] = 102;
            transitions[10][13] = 96;
            transitions[10][14] = 120;

            transitions[11][3] = 55;
            transitions[11][7] = 115;
            transitions[11][9] = 41;
            transitions[11][12] = 43;
            transitions[11][13] = 39;
            transitions[11][15] = 85;

            transitions[12][3] = 64;
            transitions[12][9] = 65;
            transitions[12][10] = 39;
            transitions[12][11] = 96;
            transitions[12][14] = 48;
            transitions[12][15] = 63;

            transitions[13][3] = 56;
            transitions[13][6] = 117;
            transitions[13][9] = 63;
            transitions[13][10] = 43;
            transitions[13][11] = 102;
            transitions[13][14] = 50;
            transitions[13][15] = 69;

            transitions[14][10] = 85;
            transitions[14][12] = 69;
            transitions[14][13] = 63;

            transitions[15][3] = 88;
            transitions[15][7] = 121;
            transitions[15][11] = 120;
            transitions[15][12] = 50;
            transitions[15][13] = 48;
            
            return transitions[from][to];
        },
        histogram: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        previous_orientation: [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
        ],
        previous_events: [],
        loudness: [
            [2, 3, 4],  // 0
            [2, 3, 4],  // 1
            [2, 3, 4],  // 2
            [2, 3, 4],  // 3
            [1, 2],     // 4
            [1, 2, 3],  // 5
            [1, 2],     // 6
            [1, 2]      // 7
        ],
        annotations: {
            type: "function",
            text: function generateAnnotation(part) {
                return annotations[part] + "<br><br>[white background]<br>silence";
            },
            preview: {
                type: "function",
                text: function generateAnnotation(part) {
                    return annotations[part];
                }
            }
        },
        link: function link(from, pause) {
            if (from === 1) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 10,
                        part: 0
                    }
                }];
            }
            
            if (from === 3) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function type1v1v1() {
    "use strict";
    
    const combinations = [
        [1, 0, 0, 1, 0, 0],   // 0
        [0, 1, 0, 1, 0, 0],   // 1
        [0, 0, 1, 1, 0, 0],   // 2
        [1, 1, 0, 1, 0, 0],   // 3
        [1, 0, 1, 1, 0, 0],   // 4
        [0, 1, 1, 1, 0, 0],   // 5
        [1, 1, 1, 1, 0, 0],   // 6
        [1, 0, 0, 1, 1, 0],   // 7
        [0, 1, 0, 1, 1, 0],   // 8
        [0, 0, 1, 1, 1, 0],   // 9
        [1, 1, 0, 1, 1, 0],   // 10
        [1, 0, 1, 1, 1, 0],   // 11
        [0, 1, 1, 1, 1, 0],   // 12
        [1, 1, 1, 1, 1, 0],   // 13
        [1, 0, 0, 0, 1, 0],   // 14
        [0, 1, 0, 0, 1, 0],   // 15
        [0, 0, 1, 0, 1, 0],   // 16
        [1, 1, 0, 0, 1, 0],   // 17
        [1, 0, 1, 0, 1, 0],   // 18
        [0, 1, 1, 0, 1, 0],   // 19
        [1, 1, 1, 0, 1, 0],   // 20
        [1, 0, 0, 1, 1, 1],   // 21
        [0, 1, 0, 1, 1, 1],   // 22
        [0, 0, 1, 1, 1, 1],   // 23
        [1, 0, 0, 0, 1, 1],   // 24
        [0, 1, 0, 0, 1, 1],   // 25
        [0, 0, 1, 0, 1, 1],   // 26
        [0, 0, 0, 0, 1, 1]    // 27
    ];
    
    let annotations = {
        type: "function",
        text: function generateAnnotation(part) {
            function modToAnnotation(modules) {
                let annotation = "";

                let motors = [
                    "",
                    "1-2 motors ",
                    "2-4 motors ",
                    "3-6 motors "
                ];

                annotation = motors[modules[0] + modules[1] + modules[2]];

                if (modules[5]) {
                    if (annotation === "") {
                        annotation = "rubber band ";
                    } else {
                        annotation += "and rubber band ";
                    }
                }

                if (modules[3] && !modules[4]) {
                    annotation += "on resonator 1";
                } else if (!modules[3] && modules[4]) {
                    annotation += "on resonator 2";
                } else if (modules[3] && modules[4]) {
                    annotation += "on both resonators";
                }

                return annotation;
            }

            return modToAnnotation(combinations[part]);
        }
    };
    
    annotations.preview = annotations;
    
    return {
        type: "mod_image",
        image: "type1v1v1-mod.png",
        grid: {width: 768, height: 800},
        parts: combinations,
        network: [
            [3, 4, 7, 14],              // 0
            [3, 5, 8, 15],              // 1
            [4, 5, 9, 16],              // 2
            [0, 1, 6, 10, 17],          // 3
            [0, 2, 6, 11, 18],          // 4
            [1, 2, 6, 12, 19],          // 5
            [3, 4, 5, 13, 20],          // 6
            [10, 11, 0, 14, 21],        // 7
            [10, 12, 1, 15, 22],        // 8
            [11, 12, 2, 16, 23],        // 9
            [7, 8, 13, 3, 17],          // 10
            [7, 9, 13, 4, 18],          // 11
            [8, 9, 13, 5, 19],          // 12
            [10, 11, 12, 6, 20],        // 13
            [17, 18, 0, 7, 24, 27],     // 14
            [17, 19, 1, 8, 25, 27],     // 15
            [18, 19, 2, 9, 26, 27],     // 16
            [14, 15, 20, 3, 10],        // 17
            [14, 16, 20, 4, 11],        // 18
            [15, 16, 20, 5, 12],        // 19
            [17, 18, 19, 6, 13],        // 20
            [7, 24],                    // 21
            [8, 25],                    // 22
            [9, 26],                    // 23
            [14, 21, 27],               // 24
            [15, 22, 27],               // 25
            [16, 23, 27],               // 26
            [24, 25, 26, 14, 15, 16]    // 27
        ],
        loudness: [
            [3, 4, 5],  // 0
            [3, 4, 5],  // 1
            [3, 4, 5],  // 2
            [3, 4, 5],  // 3
            [3, 4, 5],  // 4
            [3, 4, 5],  // 5
            [3, 4, 5],  // 6
            [3, 4, 5],  // 7
            [3, 4, 5],  // 8
            [3, 4, 5],  // 9
            [3, 4, 5],  // 10
            [3, 4, 5],  // 11
            [3, 4, 5],  // 12
            [3, 4, 5],  // 13
            [3, 4],     // 14
            [3, 4],     // 15
            [3, 4],     // 16
            [3, 4],     // 17
            [3, 4],     // 18
            [3, 4],     // 19
            [3, 4],     // 20
            [2, 3],     // 21
            [2, 3],     // 22
            [2, 3],     // 23
            [2, 3],     // 24
            [2, 3],     // 25
            [2, 3],     // 26
            [1, 2]      // 27
        ],
        histogram: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        annotations: annotations,
        link: function link(from, pause) {
            if (from === 10) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 9,
                        part: 0
                    }
                }];
            }
            
            if (from === 26) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 27) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 8,
                        part: 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function iS1iS2v1() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "the shortest creak",
            "once in a while",
            "muted agitation - some",
            "creakingly crawling like [ small, even tiny]",
            "",
            "sh"
        ],
        parts: [
            2,
            1,
            2,
            1
        ],
        loudness: [
            [2],        // 0
            [2],        // 1
            [2, 3, 4],  // 2
            [1, 2]      // 3
        ],
        annotations: {
            type: "array",
            text: [
                "rubber band, \"once in a while\"",
                "rubber band, somewhat \"agitating\"",
                "short interrupted motor sounds",
                "static noise-like motor sound"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 6,
                        part: 0,
                        direction: 0
                    }
                }];
            }
            
            if (from === 2) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 3) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 9,
                        part: 3
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function iS4v1() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "this,",
            "as if in a garage",
            "        ~ ZZJH",
            "XUO",
            "(PPP { noisy,",
            "almost a pulse, but still irregular, expanding.",
            "",
            "  trying to interact with, high, short (p l . .. . . k p^",
            "  {",
            "J"
        ],
        parts: [
            2,
            1,
            1,
            1,
            2,
            3
        ],
        loudness: [
            [4],    // 0
            [4, 5], // 1
            [2],    // 2
            [2],    // 3
            [2, 3], // 4
            [1, 2]  // 5
        ],
        annotations: {
            type: "array",
            text: [
                "low motor sounds",
                "high motor sounds",
                "high motor sounds (1)",
                "motor sounds of unclear pitches",
                "rubber band (\"almost a pulse\"), crescendo of motors (\"expanding\")",
                "only rubber band"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 7,
                        part: 10
                    }
                }];
            }
            
            if (from === 3) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 8,
                        part: 3
                    }
                }];
            }
            
            if (from === 5) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function lbclpf7() {
    "use strict";
    
    return {
        type: "audio",
        audio: "31487__lonemonk__bar-crowd-logans-pub-feb-2007.mp3",
        loudness: [
            [2, 3, 4, 5],   // 0
            [1, 2, 3, 4]    // 1
        ],
        annotations: {
            type: "array",
            text: [
                "imitate the atmosphere of the many people talking at the same time",
                "follow just a single voice and imitate it using only a single motor"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 1) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 6,
                        part: 2,
                        direction: 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function diagram9_8() {
    "use strict";
    
    return {
        type: "scroll_loop",
        image: "diagram9-8.jpg",
        background: "black",
        parts: [
            112,
            16,
            208,
            16,
            160,
            16,
            160,
            16,
            192,
            16,
            16,
            752,
            16,
            144,
            16,
            160,
            144
        ],
        speed: [
            52.915, // 0
            140,    // 1
            38.829, // 2
            140,    // 3
            44.272, // 4
            140,    // 5
            44.272, // 6
            140,    // 7
            40.415, // 8
            140,    // 9
            140,    // 10
            20.421, // 11
            140,    // 12
            46.667, // 13
            140,    // 14
            44.272, // 15
            46.667  // 16
        ],
        loudness: [
            [3, 4, 5],  // 0
            [3, 4, 5],  // 1
            [3, 4, 5],  // 2
            [3, 4, 5],  // 3
            [3, 4, 5],  // 4
            [3, 4, 5],  // 5
            [3, 4, 5],  // 6
            [3, 4, 5],  // 7
            [3, 4, 5],  // 8
            [3, 4, 5],  // 9
            [3, 4, 5],  // 10
            [2],        // 11
            [2, 3],     // 12
            [2, 3],     // 13
            [2, 3],     // 14
            [2, 3],     // 15
            [2, 3]      // 16
        ],
        annotations: {
            type: "fixed",
            text: "<br>[grey background]<br>AM noise, altered by touching circuit board<br><br>[white background]<br>FM noise<br><br>[light turquoise background]<br>between battery and trackpad<br><br>[green turquoise background]<br>between battery and trackpad, altered by touching circuit board<br><br>[black rectangles]<br>different stations<br><br>[black curves]<br>feedback",
            preview: {
                type: "function",
                text: function generateAnnotation(part) {
                    if (part < 11) {
                        return "AM noise, altered by touching circuit board (also different stations and feedback)";
                    } else if (part === 11) {
                        return "FM noise (also different stations and feedback)";
                    } else {
                        return "between battery and trackpad (altered by touching circuit board)";
                    }
                }
            }
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 11) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 15,
                        part: 1
                    }
                }];
            }
            
            if (from === 16) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 14,
                        part: 13
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function pen1v1v1v1x1x2pencil1() {
    "use strict";
    
    const annotations = [
        "FM noise, disturbances",
        "FM noise, disturbances, rapid movements of tuning wheel",
        "FM, moving tuning wheel",
        "FM, very intense disturbances",
        "AM noise, disturbances"
    ];
    
    return {
        type: "scroll_mod",
        image: "pen1v1v1v1x1x2pencil1-mod.png",
        grid: 400,
        widths: [
            [164, 43],
            [29, 20],
            [35, 11],
            [41, 16],
            [35, 33],
            [104, 23],
            [382, 182],
            [400, 119],
            [375, 375],
            [193, 156],
            [85, 26]
        ],
        speed: 50,
        network: [
            [2, 6, 3, 10, 8, 4, 9, 11, 22],     //0
            [10, 2, 22],                        //1
            [6, 10, 1, 11],                     //2
            [6, 1, 10, 8, 0, 9],                //3
            [8, 12, 22],                        //4
            [8, 9, 1],                          //5
            [8, 9, 11, 12],                     //6
            [3, 2, 1],                          //7
            [4, 7, 2, 1, 11, 12],               //8
            [4, 5, 7, 2, 1, 11, 22],            //9
            [7, 3, 1, 9, 8, 12],                //10
            [3, 2, 1, 0],                       //11
            [20, 15, 21, 17, 14, 23],           //12
            [5, 9, 15, 18, 7, 21, 20, 11, 19],  //13
            [13, 12, 16],                       //14
            [16, 13, 24, 17],                   //15
            [13, 23, 14],                       //16
            [14, 15, 24],                       //17
            [23, 12],                           //18
            [23, 12],                           //19
            [23, 13, 12],                       //20
            [13, 12],                           //21
            [24, 16, 23, 18, 17, 19],           //22
            [21, 19, 17, 18, 13],               //23
            [22, 16, 14]                        //24
        ],
        transition: function transition(from, to) {
            let transitions = [];

            let i;

            for (i = 0; i < 25; i += 1) {
                transitions.push([]);
            }

            transitions[0][2] = 37;
            transitions[0][3] = 61;
            transitions[0][4] = 179;
            transitions[0][6] = 54;
            transitions[0][8] = 163;
            transitions[0][9] = 182;
            transitions[0][10] = 98;
            transitions[0][11] = 194;
            transitions[0][22] = 0;

            transitions[1][2] = 169;
            transitions[1][10] = 163;
            transitions[1][22] = 0;

            transitions[2][1] = 61;
            transitions[2][6] = 18;
            transitions[2][10] = 58;
            transitions[2][11] = 140;

            transitions[3][0] = 169;
            transitions[3][1] = 37;
            transitions[3][6] = 29;
            transitions[3][8] = 159;
            transitions[3][9] = 172;
            transitions[3][10] = 65;

            transitions[4][8] = 55;
            transitions[4][12] = 254;
            transitions[4][22] = 0;

            transitions[5][1] = 179;
            transitions[5][8] = 23;
            transitions[5][9] = 44;

            transitions[6][8] = 125;
            transitions[6][9] = 129;
            transitions[6][11] = 130;
            transitions[6][12] = 388;

            transitions[7][1] = 54;
            transitions[7][2] = 29;
            transitions[7][3] = 18;

            transitions[8][1] = 182;
            transitions[8][2] = 172;
            transitions[8][4] = 44;
            transitions[8][7] = 129;
            transitions[8][11] = 235;
            transitions[8][12] = 268;

            transitions[9][1] = 163;
            transitions[9][2] = 159;
            transitions[9][4] = 23;
            transitions[9][5] = 55;
            transitions[9][7] = 125;
            transitions[9][11] = 243;
            transitions[9][22] = 0;

            transitions[10][1] = 194;
            transitions[10][3] = 140;
            transitions[10][7] = 130;
            transitions[10][8] = 243;
            transitions[10][9] = 235;
            transitions[10][12] = 455;

            transitions[11][0] = 163;
            transitions[11][1] = 98;
            transitions[11][2] = 65;
            transitions[11][3] = 58;

            transitions[12][14] = 194;
            transitions[12][15] = 40;
            transitions[12][17] = 130;
            transitions[12][20] = 243;
            transitions[12][21] = 235;
            transitions[12][23] = 0;

            transitions[13][5] = 254;
            transitions[13][7] = 388;
            transitions[13][9] = 268;
            transitions[13][11] = 455;
            transitions[13][15] = 350;
            transitions[13][18] = 381;
            transitions[13][19] = 506;
            transitions[13][20] = 416;
            transitions[13][21] = 415;

            transitions[14][12] = 350;
            transitions[14][13] = 78;
            transitions[14][16] = 389;

            transitions[15][13] = 434;
            transitions[15][16] = 28;
            transitions[15][17] = 536;
            transitions[15][24] = 0;

            transitions[16][13] = 232;
            transitions[16][14] = 536;
            transitions[16][23] = 0;

            transitions[17][14] = 28;
            transitions[17][15] = 389;
            transitions[17][24] = 0;

            transitions[18][12] = 506;
            transitions[18][23] = 0;

            transitions[19][12] = 381;
            transitions[19][23] = 0;

            transitions[20][12] = 415;
            transitions[20][13] = 102;
            transitions[20][23] = 0;

            transitions[21][12] = 416;
            transitions[21][13] = 19;

            transitions[22][16] = 25;
            transitions[22][17] = 25;
            transitions[22][18] = 25;
            transitions[22][19] = 25;

            transitions[23][13] = 463;
            transitions[23][17] = 247;
            transitions[23][18] = 267;
            transitions[23][19] = 107;
            transitions[23][21] = 86;

            transitions[24][14] = 439;
            transitions[24][16] = 419;
            transitions[24][22] = 0;
            
            return transitions[from][to];
        },
        histogram: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        previous_orientation: [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
        ],
        previous_events: [],
        loudness: [
            [3, 4], // 0
            [3, 4], // 1
            [3, 4], // 2
            [3, 4], // 3
            [3, 4], // 4
            [3, 4], // 5
            [3, 4], // 6
            [3, 4], // 7
            [3, 4], // 8
            [3, 4], // 9
            [3, 4], // 10
            [2, 3], // 11
            [5],    // 12
            [3, 4]  // 13
        ],
        annotations: {
            type: "function",
            text: function generateAnnotation(part) {
                if (part < 11) {
                    return "disturbances<br><br>[white background]<br>FM noise<br><br>[straight thick vertical lines]<br>rapid movements of tuning wheel";
                }
                                
                return annotations[part - 9];
            },
            preview: {
                type: "function",
                text: function generateAnnotation(part) {
                    if (part < 11) {
                        if (part === 8 || part === 9) {
                            return annotations[1];
                        }
                        
                        return annotations[0];
                    }
                    
                    return annotations[part - 9];
                }
            }
        },
        link: function link(from, pause) {
            if (from === 11) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 12) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 14,
                        part: 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function iS1() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "muted agitation - some light"
        ],
        loudness: [
            [2, 3, 4],  // 0
            [2, 3, 4],  // 1
            [1, 2, 3]   // 2
        ],
        annotations: {
            type: "array",
            text: [
                "moving telephone pickup coils (\"muted agitation\"), hard drive chord (\"some light\")",
                "touching circuit board (\"muted agitation\"), moving telephone pickup coils only around hard drive (\"some light\")",
                "sleep mode, key A and/or caps lock"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 12,
                        part: 13
                    }
                }];
            }
            
            if (from === 1) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 2) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 11,
                        part: 15
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function iS3x2() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "\"co",
            "    //",
            "    x y",
            "                                                                 \\\\\\      \\\\ \\\\",
            "                                                     1,",
            "           \\\\",
            "\\\\\\\\\\ //// / //    \\\\\\                      \\\\\\\\\\\\\\\\\\\\",
            "         \\\\",
            "                   \\\\\\ \\\\\\ // \\\\\\\\\\/\\/\\\\\\\\\\\\\\",
            "       .",
            " /                                                 ****",
            "       \\                                                                      ******************",
            "  ********************",
            "                               |",
            " /        //  **",
            "     -",
            "                 /",
            "                                )",
            "             ////",
            "  /",
            "                                                                                                         *",
            " {",
            " / /        /",
            "",
            "                                                              **                           */ //",
            "                                                                                                             2:",
            "                                                                                                               ?",
            "["
        ],
        parts: [
            1,
            1,
            1,
            1,
            1,
            4,
            1,
            3,
            1,
            1,
            1,
            1,
            1,
            3,
            1,
            3,
            1,
            1,
            1
        ],
        loudness: [
            [2],            // 0
            [1, 2, 3],      // 1
            [2, 3, 4],      // 2
            [1, 2, 3],      // 3
            [2, 3],         // 4
            [1, 2, 3],      // 5
            [2],            // 6
            [1, 2, 3],      // 7
            [2, 3],         // 8
            [1, 2, 3],      // 9
            [2, 3],         // 10
            [1, 2, 3],      // 11
            [1, 2, 3, 4],   // 12
            [1, 2, 3],      // 13
            [2, 3, 4],      // 14
            [1, 2, 3],      // 15
            [3, 4, 5],      // 16
            [1, 2, 3, 4],   // 17
            [2, 3, 4]       // 18
        ],
        annotations: {
            type: "array",
            text: [
                "radio sound",                                              // 0
                "noisy rustles",                                            // 1
                "key T",                                                    // 2
                "noisy rustles",                                            // 3
                "key 6, altered by touching circuit board",                 // 4
                "noisy rustles",                                            // 5
                "trackpad",                                                 // 6
                "noisy rustles (/ and \\), short electric hum sounds (*)",  // 7
                "battery, disconnecting power cable",                       // 8
                "noisy rustles (/), short electric hum sounds (*)",         // 9
                "between trackpad and hard drive",                          // 10
                "noisy rustles",                                            // 11
                "very short radio sound",                                   // 12
                "noisy rustles (/), short electric hum sounds (*)",         // 13
                "opening and closing programs",                             // 14
                "noisy rustles (/), short electric hum sounds (*)",         // 15
                "key 3",                                                    // 16
                "high radio feedback",                                      // 17
                "switching between tabs"                                    // 18
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 12,
                        part: 11
                    }
                }];
            }
            
            if (from === 10) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 13,
                        part: 1
                    }
                }];
            }
            
            if (from === 15) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 15,
                        part: 1
                    }
                }];
            }
            
            if (from === 18) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function lnnsib() {
    "use strict";
    
    return {
        type: "audio",
        audio: "15851__laurent__natural-night-sounds-in-boquete.mp3",
        loudness: [
            [1, 2], // 0
            [2]     // 1
        ],
        annotations: {
            type: "array",
            text: [
                "sleep mode, moving telephone pickup coils",
                "FM, high feedback"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 1) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 11,
                        part: 11,
                        x: 2200
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function diagram3x1() {
    "use strict";
    
    return {
        type: "scroll_map",
        image: "diagram3x1.png",
        background: "black",
        dim: {width: 2825, height: 1875},
        cursor: 200,
        speed: 25,
        loudness: [2, 3],
        annotations: {
            type: "fixed",
            text: "<br>[white background]<br>noise, low LPF res<br><br>[black lines]<br>noise, low LPF cutoff, maximum LPF res<br><br>[purple lines]<br>noise, mid LPF cutoff, maximum LPF res<br><br>[red lines]<br>noise, high LPF cutoff, maximum LPF res<br><br>[green lines]<br>sine waves<br><br>[green lines and black fill]<br>rattling coins",
            preview: {
                type: "fixed",
                text: "noise (low/mid/high LPF cutoff, low/maximum LPF res), sine waves, rattling coins"
            }
        },
        link: function link(x, y, pause) {
            if (x >= 1883 && y < 937) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 18,
                        part: 4
                    }
                }];
            }
            
            if (y >= 937) {
                if (x < 942) {
                    return [{
                        next_event_index: 2,
                        next_event: {
                            score: 19,
                            part: 0
                        }
                    }];
                }
                
                if (x < 1883) {
                    return [{
                        next_event_index: 2,
                        next_event: {
                            score: 0,
                            part: pause || 0
                        }
                    }];
                }
            }
            
            return [];
        }

    };
}());

scores.push(function polygon1() {
    "use strict";
    
    const annotations = [
        "combination of sine waves and noise (a bit more sine waves than noise, high LPF res)",
        "combination of sine waves and noise (more sine waves than noise, high LPF res)",
        "combination of sine waves and noise (high LPF res)",
        "combination of sine waves and noise (a bit more sine waves than noise, low LPF res)",
        "combination of sine waves and noise (more sine waves than noise, low LPF res)",
        "only sine waves, rattling (may be shorter than the indicated duration)",
        "combination of sine waves and noise (a bit more noise than sine waves, high LPF res)",
        "combination of sine waves and noise (more noise than sine waves, high LPF res)",
        "combination of sine waves and noise (a bit more noise than sine waves, high LPF res)",
        "combination of sine waves and noise (a bit more noise than sine waves, high LPF res)",
        "only sine waves, complex beating patterns, noisy rattling"
    ];

    return {
        type: "map",
        image: "polygon1-full.png",
        parts: [
            [246, 1084, 96, 82],    // 0
            [279, 773, 115, 98],    // 1
            [581, 977, 126, 134],   // 2
            [794, 1001, 93, 79],    // 3
            [1109, 893, 110, 87],   // 4
            [1314, 876, 115, 129],  // 5
            [1599, 1062, 59, 57],   // 6
            [1547, 1137, 70, 69],   // 7
            [1596, 1297, 75, 71],   // 8
            [1510, 1635, 103, 115], // 9
            [1172, 1330, 760, 782]  // 10
        ],
        durations: [
            28.064,  // 0
            31.366,  // 1
            38.744,  // 2
            25.856,  // 3
            30.072,  // 4
            34.583,  // 5
            19.260,  // 6
            22.777,  // 7
            23.004,  // 8
            33.835,  // 9
            135      // 10
        ],
        network: [
            [1, 2],             // 0
            [0, 2],             // 1
            [3, 0, 1],          // 2
            [2, 4, 10],         // 3
            [5, 3, 10],         // 4
            [4, 6, 7, 10],      // 5
            [7, 5],             // 6
            [6, 8, 5, 10],      // 7
            [7, 9, 10],         // 8
            [8, 10],            // 9
            [7, 8, 4, 9, 5, 3]  // 10
        ],
        transition: function transition(from, to) {
            let transitions = [];

            let i;
            
            for (i = 0; i < 11; i += 1) {
                transitions.push([]);
            }

            transitions[0][1] = 20.823;
            transitions[0][2] = 21.834;

            transitions[1][0] = 20.823;
            transitions[1][2] = 22.156;

            transitions[2][0] = 21.834;
            transitions[2][1] = 22.156;
            transitions[2][3] = 17.829;

            transitions[3][2] = 17.829;
            transitions[3][4] = 21.383;
            transitions[3][10] = 25.312;

            transitions[4][3] = 21.383;
            transitions[4][5] = 17.549;
            transitions[4][10] = 24.017;

            transitions[5][4] = 17.549;
            transitions[5][6] = 21.535;
            transitions[5][7] = 21.804;
            transitions[5][10] = 24.751;

            transitions[6][5] = 21.535;
            transitions[6][7] = 12.523;

            transitions[7][5] = 21.804;
            transitions[7][6] = 12.523;
            transitions[7][8] = 16.088;
            transitions[7][10] = 23.545;

            transitions[8][7] = 16.088;
            transitions[8][9] = 21.804;
            transitions[8][10] = 23.624;

            transitions[9][8] = 21.804;
            transitions[9][10] = 24.324;

            transitions[10][3] = 25.312;
            transitions[10][4] = 24.017;
            transitions[10][5] = 24.751;
            transitions[10][7] = 23.545;
            transitions[10][8] = 23.624;
            transitions[10][9] = 24.324;
            
            if (from === -1) {
                return 0;
            }
            
            return transitions[from][to];
        },
        histogram: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        loudness: [
            [2],    // 0
            [2],    // 1
            [2],    // 2
            [2],    // 3
            [1],    // 4
            [3, 4], // 5
            [2],    // 6
            [2],    // 7
            [2],    // 8
            [1],    // 9
            [5]     // 10
        ],
        annotations: {
            type: "function",
            text: function generateAnnotation(part) {
                return "<br><u>static image</u><br><br>" + annotations[part] + "<br><br><br><u>moving image</u><br><br>[white background]<br>silence<br><br>[foggy background]<br>soft noise<br>medium LPF res<br><br>[light foggy background]<br>very soft noise<br>low LPF res";
            },
            preview: {
                type: "function",
                text: function generateAnnotation(part) {
                    return annotations[part];
                }
            }
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 5) {
                return [{
                    next_event_index: 2,
                    next_event: {
                        score: 20,
                        part: 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function iS1v2iS2() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "muted aggregates of, -",
            "                                          {dark",
            ", long creaks",
            "creakingly crawling",
            "scattered",
            " \\ m",
            "0",
            "",
            "like a giant being [ tiny",
            "                                          IN {0"
        ],
        parts: [
            2,
            1,
            1,
            4,
            2
        ],
        loudness: [
            [2],    // 0
            [2, 3], // 1
            [2],    // 2
            [2],    // 3
            [2]     // 4
        ],
        annotations: {
            type: "array",
            text: [
                "noise, medium LPF res, occasionally louder for a short duration",
                "noise, high LPF cutoff, high to maximum LPF res",
                "noise, downward glissando (by lowering LPF cutoff, high to maximum LPF res)",
                "noise, low LPF res, occasionally adding sine waves, several accents (volume, LPF res)",
                "low sine wave"
            ]
        },
        link: function link(from, pause) {
            if (from === 0) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            if (from === 4) {
                return [
                    {
                        next_event_index: 2,
                        next_event: {
                            score: 16,
                            x: 2500,
                            y: 200
                        }
                    },
                    {
                        next_event_index: 3,
                        next_event: {
                            score: 20,
                            part: 0
                        }
                    }
                ];
            }
            
            return [];
        }
    };
}());

scores.push(function iS5() {
    "use strict";
    
    return {
        type: "text",
        text: [
            "plenty, entangled",
            "many (are)",
            "   [trying to dissolve, . 1 ^^  ^",
            "but threads, a lot of them",
            "{an irritating hassle that will disappear when",
            "",
            "[",
            "        not without some dust left in a big closed box",
            "] 2& { }"
        ],
        parts: [
            2,
            1,
            1,
            3,
            1,
            1
        ],
        loudness: [
            [3, 4],     // 0
            [6],        // 1
            [2, 3, 4],  // 2
            [5],        // 3
            [1, 2],     // 4
            [2]         // 5
        ],
        annotations: {
            type: "array",
            text: [
                "noise, full modulation of LPF cutoff, high to maximum LPF res, very fast to maximum rLFO rate",
                "reducing noise mix, modulation of LPF cutoff, and rLFO rate, but in the end accents (high values of all these parameters) (although not very often)",
                "sine waves, full modulation of freq shift, very fast to maximum rLFO rate, low to medium rLFO glide, complex beating patterns",
                "rattling, abrupt silence",
                "rattling aluminum foil",
                "complex texture of the rattling aluminum foil, occasionally louder"
            ]
        },
        link: function link(from, pause) {
            if (from === 2) {
                return [{
                    next_event_index: 1,
                    next_event: {
                        score: 17,
                        part: 3
                    }
                }];
            }
            
            if (from === 5) {
                return [{
                    next_event_index: 3,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                }];
            }
            
            return [];
        }
    };
}());

scores.push(function zr1tS() {
    "use strict";
    
    let annotations = {
        type: "fixed",
        text: "rattling plastic box"
    };
    
    annotations.preview = annotations;
    
    return {
        type: "audio",
        audio: "zH5pB-rwf-1-666timesSlower.mp3",
        loudness: [
            [3, 4]      // 0
        ],
        annotations: annotations,
        link: function link(from, pause) {
            from = from;
            
            return [
                {
                    next_event_index: 1,
                    next_event: {
                        score: 0,
                        part: pause || 0
                    }
                },
                {
                    next_event_index: 2,
                    next_event: {
                        score: 17,
                        part: 5
                    }
                }
            ];
        }
    };
}());

if (typeof exports !== "undefined") {
    exports.scores = scores;
}