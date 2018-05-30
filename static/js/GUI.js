/*global window, aux, scores, score_types*/

/*jslint es6, for*/

const GUI = (function GUI_() {
    "use strict";
    
    let monitor = false;

    let screen_info = {};
    let elements = {};
    
    let previously_drawn = [];
    
    let large_font_size;
    
    let border_width;
    
    function dragAndDrop() {
        document.body.innerHTML = "<div class='simple-text' id='drag-and-drop'>" +
                "Drag and drop a ccloudlab1-3 log file." +
                "</div>";
        
        const drag_and_drop = document.getElementById("drag-and-drop");
        
        drag_and_drop.style.width = window.innerWidth + "px";
        drag_and_drop.style.height = window.innerHeight + "px";
        
        window.onresize = dragAndDrop;
    }
    
    function load() {
        document.body.innerHTML = "<div class='simple-text'>" +
                "Loading." +
                "</div>";
    }
    
    function clear() {
        document.body.innerHTML = "";
    }
    
    function setToMonitor() {
        monitor = true;
    }
            
    function init() {
        function resize() {
            const ratio = 1.6;

            let zoom = 1;

            if (monitor) {
                zoom = 0.5;
            }

            if (window.innerWidth / window.innerHeight <= ratio) {
                screen_info.screen_width = window.innerWidth * zoom;
                screen_info.screen_height = screen_info.screen_width / ratio;
            } else {
                screen_info.screen_height = window.innerHeight * zoom;
                screen_info.screen_width = screen_info.screen_height * ratio;
            }

            const scale = screen_info.screen_width / 1280;
            
            elements.window.style.width = window.innerWidth + "px";
            elements.window.style.height = window.innerHeight + "px";

            elements.columns.forEach(function resizeRow(column) {
                column.style.width = screen_info.screen_width + "px";
                column.style.height = window.innerHeight + "px";
            });

            if (monitor) {
                border_width = Math.ceil(scale) * 2;
            }

            elements.screens.forEach(function resizeScreen(screen, index) {
                screen.frame.style.width = screen_info.screen_width + "px";
                screen.frame.style.height = screen_info.screen_height + "px";
                
                if (monitor) {
                    screen.frame.style.borderWidth = border_width + "px";
                }

                screen.current_event.width = Math.ceil(screen_info.screen_width * 0.601); // bug correction, supposed to be 0.6
                screen.current_event.height = screen_info.screen_height;
                                                                
                screen.annotation1.style.fontSize = (17 * scale) + "px";
                screen.annotation2.style.fontSize = (17 * scale) + "px";
                screen.annotation3.style.fontSize = (17 * scale) + "px";

                large_font_size = (21 * scale);

                screen.clock.style.fontSize = (21 * scale) + "px";

                screen.next_event_1.width = screen_info.screen_width * 0.16;
                screen.next_event_1.height = screen.next_event_1.width / 0.96;
                screen.next_event_2.width = screen_info.screen_width * 0.16;
                screen.next_event_2.height = screen.next_event_2.width / 0.96;
                screen.next_event_3.width = screen_info.screen_width * 0.16;
                screen.next_event_3.height = screen.next_event_3.width / 0.96;

                previously_drawn[index] = {
                    current_event: {score: -1, part: -1},
                    next_event_1: {score: -1, part: -1, direction: -1, orientation: -1},
                    next_event_2: {score: -1, part: -1, direction: -1, orientation: -1},
                    next_event_3: {score: -1, part: -1, direction: -1, orientation: -1}
                };
            });

            if (monitor) {
                elements.screens[0].frame.style.borderBottomStyle = "solid";
                elements.screens[0].frame.style.borderRightStyle = "solid";
                elements.screens[1].frame.style.borderTopStyle = "solid";
                elements.screens[1].frame.style.borderRightStyle = "solid";
                elements.screens[2].frame.style.borderBottomStyle = "solid";
                elements.screens[2].frame.style.borderLeftStyle = "solid";
                elements.screens[3].frame.style.borderTopStyle = "solid";
                elements.screens[3].frame.style.borderLeftStyle = "solid";
            }
        }
        
        let HTML = "<div class='window' id='window'>";
        
        let i;
        let j;
        
        let index = 0;
        
        let columns = 1;
        let rows = 1;
        
        if (monitor) {
            columns = 2;
            rows = 2;
        }
        
        for (i = 0; i < columns; i += 1) {
            HTML += "<div class='column' id='column" + i + "'>";
                
            for (j = 0; j < rows; j += 1) {
                HTML += "<div class='screen' id='screen" + index + "'>" +
                        "   <div class='annotations'>" +
                        "       <table class='annotations-table'>" +
                        "           <tr class='annotations-row'>" +
                        "               <td id='" + index + "-annotation1' />" +
                        "           </tr>" +
                        "           <tr class='annotations-row'>" +
                        "               <td id='" + index + "-annotation2' />" +
                        "           </tr>" +
                        "           <tr class='annotations-row'>" +
                        "               <td id='" + index + "-annotation3' />" +
                        "           </tr>" +
                        "       </table>" +
                        "   </div>" +
                        "   <div class='main'>" +
                        "       <canvas id='" + index + "-current_event' />" +
                        "   </div>" +
                        "   <div class='clock-and-previews'>" +
                        "       <div class='clock-frame'>" +
                        "           <span id='clock" + index + "' class='clock' />" +
                        "       </div>" +
                        "       <div class='preview-frame'>" +
                        "           <canvas id='" + index + "-next_event_1' />" +
                        "       </div>" +
                        "       <div class='preview-frame'>" +
                        "           <canvas id='" + index + "-next_event_2' />" +
                        "       </div>" +
                        "       <div class='preview-frame'>" +
                        "           <canvas id='" + index + "-next_event_3' />" +
                        "       </div>" +
                        "   </div>" +
                        "</div>";

                index += 1;
            }
            
            HTML += "</div>";
        }
        
        HTML += "</div>";

        document.body.innerHTML = HTML;
        
        elements.window = document.getElementById("window");
        
        elements.columns = [];
        
        for (i = 0; i < columns; i += 1) {
            elements.columns.push(document.getElementById("column" + i));
        }
        
        elements.screens = [];
        
        for (i = 0; i < rows * columns; i += 1) {
            elements.screens.push({
                frame: document.getElementById("screen" + i),
                annotation1: document.getElementById(i + "-annotation1"),
                annotation2: document.getElementById(i + "-annotation2"),
                annotation3: document.getElementById(i + "-annotation3"),
                current_event: document.getElementById(i + "-current_event"),
                clock: document.getElementById("clock" + i),
                next_event_1: document.getElementById(i + "-next_event_1"),
                next_event_2: document.getElementById(i + "-next_event_2"),
                next_event_3: document.getElementById(i + "-next_event_3")
            });

            elements.screens[i].current_event_ctx = elements.screens[i].current_event.getContext("2d");
            elements.screens[i].next_event_1_ctx = elements.screens[i].next_event_1.getContext("2d");
            elements.screens[i].next_event_2_ctx = elements.screens[i].next_event_2.getContext("2d");
            elements.screens[i].next_event_3_ctx = elements.screens[i].next_event_3.getContext("2d");
        }
        
        window.onresize = resize;
        
        resize();
    }
                
    function draw(performers) {
        function writeAnnotations(performer, index) {
            function formatLoudness(event) {
                const indications = ["silence", "very soft", "soft", "Medium", "LOUD", "VERY LOUD", "fade out"];
                const abbreviations = [".", "s-", "s", "M", "L", "L+", ">."];
                
                let loudness;
                let loudness_array;
                                
                if (event === 1 || event === -1) {
                    loudness_array = scores[performer.current_event.score].loudness[performer.current_event.part + event];
                    
                    loudness = loudness_array[Math.floor(performer.general_loudness * (loudness_array.length - 1))];
                } else {
                    if (performer[event].score !== 0) {
                        loudness_array = scores[performer[event].score].loudness;

                        if (performer[event].score !== 16) { // diagram3x1
                            loudness_array = loudness_array[performer[event].part];
                        }
                    } else {
                        loudness_array = [0];
                    }
                    
                    loudness = performer[event].loudness;
                }
                
                let loudness_string = "<span style='font-size: " + large_font_size + "px'>";
                
                let bold_italics = false;
                
                if (event === "current_event" && performer.middle_foot_switch > 1) {
                    bold_italics = true;
                    loudness_string += "<b><i>";
                    loudness = loudness_array[(loudness_array.indexOf(loudness) + Math.max(Math.floor(performer.middle_foot_switch) - 1, 0)) % loudness_array.length];
                }

                if (loudness_array.indexOf(loudness) > 0) {
                    loudness_string += "< ";
                }

                loudness_string += indications[loudness];

                if (loudness_array.indexOf(loudness) < loudness_array.length - 1) {
                    loudness_string += " >";
                }
                    
                if (bold_italics) {
                    loudness_string += "</i></b>";
                }
                
                loudness_string += "</span><br>";
                
                if (event === "current_event") {
                    let others_loudness;
                    
                    if (performer.others_loudness) {
                        others_loudness = performer.others_loudness;
                    }

                    if (monitor) {
                        others_loudness = [];
                        
                        performers.forEach(function (performer, index2) {
                            if (index !== index2 && performer.current_event) {
                                others_loudness.push(performer.current_event.loudness);
                            }
                        });
                    }
                    
                    if (others_loudness) {
                        loudness_string += "[ " + abbreviations[others_loudness[0]] + " / " + abbreviations[others_loudness[1]] + " / " + abbreviations[others_loudness[2]] + " ]<br>";
                    }
                }
                
                return loudness_string;
            }
            
            function previewAnnotation(event) {
                
                if (scores[performer[event].score].annotations.type !== "array") {
                    if (scores[performer[event].score].annotations.preview.type === "fixed") {
                        return scores[performer[event].score].annotations.preview.text;
                    }

                    if (scores[performer[event].score].annotations.preview.type === "function") {
                        return scores[performer[event].score].annotations.preview.text(performer[event].part);
                    }
                    
                    if (scores[performer[event].score].annotations.preview.type === "array") {
                        return scores[performer[event].score].annotations.preview.text[performer[event].part];
                    }
                } else {
                    return scores[performer[event].score].annotations.text[performer[event].part];
                }
            }
                                    
            let annotation1 = "";
            let annotation2 = "";
            let annotation3 = "";
            
            if (scores[performer.current_event.score].annotations.type === "array") {
                elements.screens[index].annotation1.classList = "next-event";
                elements.screens[index].annotation2.classList = "current-event";
                elements.screens[index].annotation3.classList = "next-event";
                
                annotation2 = formatLoudness("current_event", index) + scores[performer.current_event.score].annotations.text[performer.current_event.part];
                
                if (performer.current_event.part > 0) {
                    annotation1 = "<u>left foot switch:</u><br>" + formatLoudness(-1) + scores[performer.current_event.score].annotations.text[performer.current_event.part - 1];
                }
                
                if (performer.current_event.part < scores[performer.current_event.score].annotations.text.length - 1) {
                    annotation3 = "<u>right foot switch:</u><br>" + formatLoudness(1) + scores[performer.current_event.score].annotations.text[performer.current_event.part + 1];
                }
                
                if (performer.next_event_1 !== "[]") {
                    annotation1 = "<u>left foot switch:</u><br>" + formatLoudness("next_event_1") + previewAnnotation("next_event_1");
                }
                
                if (performer.next_event_3 !== "[]") {
                    annotation3 = "<u>right foot switch:</u><br>" + formatLoudness("next_event_3") + previewAnnotation("next_event_3");
                }
                
                if (performer.next_event_2 !== "[]") {
                    annotation3 = "<u>middle foot switch:</u><br>" + formatLoudness("next_event_2") + previewAnnotation("next_event_2") + "<br><br>" + annotation3;
                }
            } else {
                elements.screens[index].annotation1.classList = "current-event";
                elements.screens[index].annotation2.classList = "next-event";
                elements.screens[index].annotation3.classList = "next-event";
                                
                if (scores[performer.current_event.score].annotations.type === "fixed") {
                    annotation1 = formatLoudness("current_event", index) + scores[performer.current_event.score].annotations.text;
                    
                    if (performer.current_event.score === 11) { // diagram9-8
                        if (performer.current_event.part > 0) {
                            annotation3 += "<u>left foot switch</u><br>" + formatLoudness(-1) + "<br>";
                        }
                    }
                }
                
                if (scores[performer.current_event.score].annotations.type === "function") {
                    annotation1 = formatLoudness("current_event", index) + scores[performer.current_event.score].annotations.text(performer.current_event.part);
                }
                
                if (!performer.next_event_index) {
                    let annotation2_1 = "";
                    let annotation2_2 = "";
                    let annotation2_3 = "";
                    
                    if (performer.current_event.score === 11) { // diagram9-8
                        if (performer.current_event.part < scores[11].parts.length - 1) {
                            annotation2_3 += formatLoudness(1);
                        }
                    }
                    
                    if (performer.next_event_1 !== "[]") {
                        annotation2_1 = formatLoudness("next_event_1") + previewAnnotation("next_event_1");
                    }
                    
                    if (performer.next_event_2 !== "[]") {
                        annotation2_2 = formatLoudness("next_event_2") + previewAnnotation("next_event_2");
                    }
                    
                    if (performer.next_event_3 !== "[]") {
                        annotation2_3 = formatLoudness("next_event_3") + previewAnnotation("next_event_3");
                    }
                    
                    if (annotation2_1 === annotation2_2 && annotation2_1 !== "") {
                        annotation2_2 += " (1)";
                    }
                    
                    if (annotation2_1 !== annotation2_2 && (annotation2_1 === annotation2_3 || annotation2_2 === annotation2_3) && annotation2_3 !== "") {
                        annotation2_3 += " (1)";
                    }
                    
                    if (annotation2_1 === annotation2_2 && annotation2_2 === annotation2_3 && annotation2_1 !== "") {
                        annotation2_3 += " (2)";
                    }
                    
                    if (annotation2_1 !== "") {
                        annotation2 += "<u>left foot switch</u><br>" + annotation2_1 + "<br><br>";
                    }
                    
                    if (annotation2_2 !== "") {
                        annotation2 += "<u>middle foot switch</u><br>" + annotation2_2 + "<br><br>";
                    }
                    
                    if (annotation2_3 !== "") {
                        annotation2 += "<u>right foot switch</u><br>" + annotation2_3 + "<br><br>";
                    }
                    
                    if (performer.current_event.score === 11) { // diagram9-8
                        annotation2 = "";
                        
                        if (annotation2_1 !== "") {
                            annotation3 += "<u>left foot switch</u><br>" + annotation2_1 + "<br><br>";
                        }

                        if (annotation2_2 !== "") {
                            annotation3 += "<u>middle foot switch</u><br>" + annotation2_2 + "<br><br>";
                        }

                        if (annotation2_3 !== "") {
                            annotation3 += "<u>right foot switch</u><br>" + annotation2_3 + "<br><br>";
                        }
                    }
                } else {
                    const next_event = "next_event_" + performer.next_event_index;
                    
                    const next = "<span style='font-size: " + large_font_size + "px'><b>NEXT</b></span><br><br>";
                    
                    if (scores[performer.current_event.score].annotations.type !== "fixed" || performer[next_event].score !== performer.current_event.score) {
                        annotation2 = next + formatLoudness(next_event) + previewAnnotation(next_event);
                        
                        if (performer.current_event.score === 12 && performer[next_event].score === performer.current_event.score && performer[next_event].part < 11) { // pen1v1v1v1x1x2pencil1
                            annotation2 = "";
                        }
                    } else if (performer.current_event.score === 2) { // polygon1v1
                        annotation2 = next + formatLoudness(next_event);
                    } else {
                        annotation2 = "";
                    }
                }
            }
            
            if (performer.current_event.score === 11) { // diagram9-8
                annotation2 += "<br><br>";
            }
            
            elements.screens[index].annotation1.innerHTML = annotation1;
            elements.screens[index].annotation2.innerHTML = annotation2;
            elements.screens[index].annotation3.innerHTML = annotation3;
        }
        
        function drawEvent(performer, index, event) {
            const ctx = elements.screens[index][event + "_ctx"];
            
            ctx.fillStyle = scores[performer[event].score].background || "white";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            let scale = ctx.canvas.width / 768;
            
            if (score_types[scores[performer[event].score].type].imageCoords) {
                const image_coords = score_types[scores[performer[event].score].type].imageCoords(performer, event, scale);
                const image = scores[performer[event].score].image;
                
                image_coords.forEach(function drawImage(coords) {
                    ctx.drawImage(
                        image,
                        coords.sx,
                        coords.sy,
                        coords.swidth,
                        coords.sheight,
                        coords.dx,
                        coords.dy,
                        coords.dwidth,
                        coords.dheight
                    );
                });
            }
            
            if (score_types[scores[performer[event].score].type].maskCoords) {
                ctx.fillStyle = score_types[scores[performer[event].score].type].mask_color;

                const mask_coords = score_types[scores[performer[event].score].type].maskCoords(performer, event, scale);

                mask_coords.forEach(function drawMask(coords) {
                    ctx.fillRect(
                        coords.x,
                        coords.y,
                        coords.width,
                        coords.height
                    );
                });
            }
                        
            if (score_types[scores[performer[event].score].type].cursor) {
                const cursor = score_types[scores[performer[event].score].type].cursor(performer, event, scale);
                
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2 * scale;
                
                if (cursor.type === "arrow") {
                    ctx.beginPath();
                    ctx.setLineDash([6 * scale, 4 * scale]);
                    ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height / 2 - cursor.dim.height / 2);
                    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height / 2 + cursor.dim.height / 2 + cursor.dim.offset);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.setLineDash([]);
                    ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height / 2 - cursor.dim.height / 2 - 30 * scale);
                    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height / 2 - cursor.dim.height / 2 - 10 * scale);
                    ctx.lineTo(ctx.canvas.width / 2 + 5 * scale, ctx.canvas.height / 2 - cursor.dim.height / 2 - 15 * scale);
                    ctx.lineTo(ctx.canvas.width / 2 - 5 * scale, ctx.canvas.height / 2 - cursor.dim.height / 2 - 15 * scale);
                    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height / 2 - cursor.dim.height / 2 - 10 * scale);
                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.stroke();
                }

                if (cursor.type === "rectangle") {
                    ctx.beginPath();
                    ctx.setLineDash([Math.ceil(6 * scale), Math.ceil(4 * scale)]);
                    ctx.strokeRect(Math.floor((ctx.canvas.width - cursor.dim.width) / 2), Math.floor((ctx.canvas.height - cursor.dim.height) / 2), Math.ceil(cursor.dim.width), Math.ceil(cursor.dim.height));
                }
            }
            
            if (score_types[scores[performer[event].score].type].timer && event === "current_event") {
                ctx.fillStyle = "red";
                ctx.font = (22 * scale) + "px Courier";
                ctx.textAlign = "right";
                ctx.fillText(score_types[scores[performer[event].score].type].timer(performer), ctx.canvas.width - 10 * scale, 30 * scale);
            }
            
            if (scores[performer[event].score].text || score_types[scores[performer[event].score].type].text) {
                const font = score_types[scores[performer[event].score].type].font.split("px ");
                
                let zoom = 1;
                
                if (event !== "current_event") {
                    zoom = 2.5;
                }
                
                scale *= zoom;
                
                ctx.font = (parseInt(font[0]) * scale) + "px " + font[1];
                ctx.textAlign = score_types[scores[performer[event].score].type].align || "left";
                
                if (scores[performer[event].score].text) {
                    if (scores[performer[event].score].parts) {
                        scores[performer[event].score].text.forEach(function drawText(text, index) {
                            const sum = aux.sumArray(performer[event].part, scores[performer[event].score].parts);
                            const spacing = 30 * scale;
                            
                            if (index >= sum && index <= sum + scores[performer[event].score].parts[performer[event].part] - 1) {
                                ctx.fillStyle = "black";
                            } else {
                                ctx.fillStyle = "lightgrey";
                            }

                            ctx.fillText(text, 10 * scale, ctx.canvas.height / 2 - spacing * (sum + (scores[performer[event].score].parts[performer[event].part] - 1) / 2) + index * spacing);
                        });
                    } else {
                        scores[performer[event].score].text.forEach(function drawLine(text, index) {
                            ctx.fillStyle = "black";

                            ctx.fillText(text, 10 * scale, ctx.canvas.height / 2 + (index - scores[performer[event].score].text.length / 2 + 0.5) * 30 * scale);
                        });
                    }
                }
                
                if (score_types[scores[performer[event].score].type].text) {
                    ctx.fillStyle = "black";
                    
                    ctx.fillText(score_types[scores[performer[event].score].type].text(performer), ctx.canvas.width / 2, ctx.canvas.height / 2 + 10 * scale);
                }
            }
            
            if (monitor && event === "current_event") {
                let y = ctx.canvas.height - border_width / 2;
                
                if (index % 2 === 1) {
                    y = -border_width;
                }
                
                ctx.strokeStyle = "black";
                ctx.lineWidth = border_width;
                ctx.setLineDash([]);
                
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(ctx.canvas.width, y);
                ctx.stroke();
            }
        }
        
        function updateClock(performer, index) {
            if (performer.state === "waiting") {
                elements.screens[index].clock.innerHTML = "-- waiting --";
            } else if (performer.state === "ready") {
                elements.screens[index].clock.innerHTML = "--- ready ---";
            } else if (performer.state === "playing") {
                let mm = Math.floor(performer.clock.master / 60);
                let ss = Math.floor(performer.clock.master - mm * 60);

                if (mm < 10) {
                    mm = "0" + mm;
                }

                if (ss < 10) {
                    ss = "0" + ss;
                }

                elements.screens[index].clock.innerHTML = "--- " + mm + ":" + ss + " ---";
            } else if (performer.state === "ended") {
                elements.screens[index].clock.innerHTML = "-- the end --";
            } else if (performer.state === "aborted") {
                elements.screens[index].clock.innerHTML = "-- aborted --";
            }
        }
        
        if (!performers.length) {
            performers = [performers];
        }
        
        performers.forEach(function drawScore(performer, index) {
            if (performer.state !== "waiting") {
                writeAnnotations(performer, index);

                let previously_drawn_event = previously_drawn[index].current_event;

                if (scores[performer.current_event.score].type === "map" || scores[performer.current_event.score].type === "scroll_loop" || (scores[performer.current_event.score].type === "scroll_mod" && performer.current_event.part < 11) || scores[performer.current_event.score].type === "scroll_map" || (scores[performer.current_event.score].type === "pause" && performer.current_event.t > -1) || previously_drawn_event.score !== performer.current_event.score || previously_drawn_event.part !== performer.current_event.part) {
                    drawEvent(performer, index, "current_event");
                }

                previously_drawn_event.score = performer.current_event.score;
                previously_drawn_event.part = performer.current_event.part;

                let i;

                for (i = 1; i <= 3; i += 1) {
                    const next_event = "next_event_" + i;

                    previously_drawn_event = previously_drawn[index][next_event];

                    if (performer[next_event] !== "[]") {
                        if (previously_drawn_event.score !== performer[next_event].score || previously_drawn_event.part !== performer[next_event].part || previously_drawn_event.direction !== performer[next_event].direction || previously_drawn_event.orientation !== performer[next_event].orientation) {
                            drawEvent(performer, index, next_event);
                        }

                        previously_drawn_event.score = performer[next_event].score;
                        previously_drawn_event.part = performer[next_event].part;
                    } else {
                        if (previously_drawn_event.score !== -1) {
                            elements.screens[index][next_event + "_ctx"].clearRect(0, 0, elements.screens[index][next_event].width, elements.screens[index][next_event].height);
                        }

                        previously_drawn_event = {score: -1, part: -1, direction: -1, orientation: -1};
                    }

                    if (i === performer.next_event_index) {
                        elements.screens[index][next_event].style = "outline: " + (4 * screen_info.screen_width / 1280) + "px solid red";
                    } else {
                        elements.screens[index][next_event].style = "outline: 0px";
                    }
                }
            }
        });

        performers.forEach(function drawScore(performer, index) {
            updateClock(performer, index);
        });
    }
    
    return {
        dragAndDrop: dragAndDrop,
        load: load,
        clear: clear,
        setToMonitor: setToMonitor,
        init: init,
        draw: draw
    };
}());