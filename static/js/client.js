/*global window, io, scores, score_types, GUI, aux, monitor*/

/*jslint es6, for*/

function client() {
    "use strict";
    
    const socket = io();
    
    const pause_sequence = aux.randomSequence(5);
    const pause_array = [0, 0, 1, 1, 2];
    
    let performer;
    
    socket.emit("load");
    
    function choosePerformer() {
        let performer_index = aux.choosePerformer();
        
        if (performer_index === "monitor" || (performer_index >= 1 && performer_index <= 4)) {
            socket.emit("new performer", performer_index);
        }
    }
            
    function updateNextEvents() {
        const temporary_performer = Object.assign({}, performer);
        
        (function defaultNextEvents() {
            let i;

            if (score_types[scores[temporary_performer.current_event.score].type].updateNextEvents) {
                score_types[scores[temporary_performer.current_event.score].type].updateNextEvents(temporary_performer);
            } else {
                for (i = 1; i <= 3; i += 1) {
                    temporary_performer["next_event_" + i] = "[]";
                }
            }
        }());
        
        (function fixedLinks() {
            let link;

            const fixed_pause = pause_array[pause_sequence[temporary_performer.current_event.score - 1]];

            if (temporary_performer.current_event.score === 16) { // diagram3x1
                link = scores[temporary_performer.current_event.score].link(temporary_performer.current_event.x, temporary_performer.current_event.y, fixed_pause);
            } else if (temporary_performer.current_event.score !== 0) {
                link = scores[temporary_performer.current_event.score].link(temporary_performer.current_event.part, fixed_pause);
            }

            if (link) {
                let i;
                
                for (i = 0; i < link.length; i += 1) {
                    temporary_performer["next_event_" + link[i].next_event_index] = link[i].next_event;
                }
            }
        }());
                        
        if (performer.others_loudness) {
            (function safetyPause() {
                let possible_loudness = [0, 0, 0, 0, 0];

                function checkPossibleLoudness(event) {
                    let loudness_array;

                    if (event.score !== 0) {
                        loudness_array = scores[event.score].loudness;

                        if (event.score !== 16) { // diagram3x1
                            loudness_array = loudness_array[event.part];
                        }
                    } else {
                        loudness_array = [0];
                    }

                    let k;

                    for (k = 0; k < loudness_array.length; k += 1) {
                        if (loudness_array[k] === 0 || loudness_array[k] === 6) {
                            return "safe";
                        }

                        possible_loudness[loudness_array[k] - 1] = 1;
                    }
                }

                if (scores[performer.current_event.score].type !== "map" && scores[performer.current_event.score].type !== "scroll_mod") {
                    if (checkPossibleLoudness(performer.current_event) === "safe") {
                        return;
                    }
                }

                let i;

                for (i = 1; i <= 3; i += 1) {
                    const next_event = "next_event_" + i;

                    if (temporary_performer[next_event] !== "[]" && checkPossibleLoudness(temporary_performer[next_event]) === "safe") {
                        return;
                    }
                }

                if (scores[performer.current_event.score].type === "scroll_loop" || scores[performer.current_event.score].type === "text" || scores[performer.current_event.score].type === "audio") {
                    if (performer.current_event.part > 0) {
                        if (checkPossibleLoudness({score: performer.current_event.score, part: performer.current_event.part - 1}) === "safe") {
                            return;
                        }
                    }

                    if (performer.current_event.part < scores[performer.current_event.score].loudness.length - 1) {
                        if (checkPossibleLoudness({score: performer.current_event.score, part: performer.current_event.part + 1}) === "safe") {
                            return;
                        }
                    }
                }

                let pause = false;
                
                for (i = 0; i < 3; i += 1) {
                    const others_loudness = parseInt(performer.others_loudness[i]);

                    if (others_loudness === 0 || others_loudness === 6) {
                        break;
                    }

                    let j;

                    for (j = 0; j < 5; j += 1) {
                        if (possible_loudness[j] && Math.abs(j + 1 - others_loudness) <= 1) {
                            pause = false;
                            break;
                        }

                        pause = true;
                    }

                    if (pause) {
                        if (!performer.safety_pause) {
                            let part = Math.floor(Math.random() * 3);
                            
                            temporary_performer.next_event_2 = {score: 0, part: part, loudness: 0};
                                                        
                            performer.safety_pause = part + 1;
                        } else {
                            temporary_performer.next_event_2 = {score: 0, part: performer.safety_pause - 1, loudness: 0};
                            return;
                        }
                        break;
                    }
                }
                
                if (!pause) {
                    performer.safety_pause = 0;
                }
            }());
        }
        
        if (performer.dynamic_link !== "[]" && (performer.current_event.score !== 0 || (performer.current_event.score === 0 && performer.current_event.t < 0))) {
            temporary_performer.next_event_2 = Object.assign({}, performer.dynamic_link);
        }

        let i;
        
        for (i = 1; i <= 3; i += 1) {
            const next_event = "next_event_" + i;
            
            if (!performer[next_event] || temporary_performer[next_event].score !== performer[next_event].score || temporary_performer[next_event].part !== performer[next_event].part || (temporary_performer[next_event].loudness !== undefined && temporary_performer[next_event].loudness !== performer[next_event].loudness)) {
                performer[next_event] = temporary_performer[next_event];
                                
                if (performer[next_event] !== "[]") {
                    score_types[scores[performer[next_event].score].type].formatEvent(performer, next_event);
                }
            }
        }
        
        if (temporary_performer.general_loudness !== performer.general_loudness) {
            performer.general_loudness = temporary_performer.general_loudness;
        }
    }
    
    function loop(t) {
        if (performer.state === "playing") {
            performer.clock.delta = (t - performer.clock.t0) / 1000;
            performer.clock.master += performer.clock.delta;
            
            if (performer.middle_foot_switch) {
                performer.middle_foot_switch += performer.clock.delta;
            }

            if (scores[performer.current_event.score].type === "audio") {
                if (scores[performer.current_event.score].audio.length) {
                    scores[performer.current_event.score].audio.forEach(function playOrPause(audio, index) {
                        if (index === performer.current_event.part && audio.paused) {
                            audio.play();
                        }
                        
                        if (index !== performer.current_event.part && !audio.paused) {
                            audio.pause();
                        }
                    });
                } else if (!performer.audio) {
                    scores[performer.current_event.score].audio.play();
                }
                
                performer.audio = performer.current_event.score;
            }
                        
            if (score_types[scores[performer.current_event.score].type].updateCurrentEvent) {
                score_types[scores[performer.current_event.score].type].updateCurrentEvent(performer);
            }
            
            updateNextEvents();
        }
        
        if (performer.state === "playing" || performer.state === "ready") {
            updateNextEvents();
            
            socket.emit("update server", performer.clock.master, performer.state, aux.eventsToLog(performer));
        }
                
        if (performer.current_event && ((performer.state === "aborted" || scores[performer.current_event.score].type !== "audio") && performer.audio)) {
            if (scores[performer.audio].audio.length) {
                scores[performer.audio].audio.forEach(function playOrPause(audio) {
                    if (!audio.paused) {
                        audio.pause();
                    }
                });
            } else {
                scores[performer.audio].audio.pause();
            }

            performer.audio = 0;
        }
        
        performer.clock.t0 = t;
        
        GUI.draw(performer);
                                
        window.requestAnimationFrame(loop);
    }
    
    function interactKeyDown(e) {
        if (e.keyCode === 50 && performer.state === "playing" && !performer.middle_foot_switch) {
            performer.middle_foot_switch = 0.001;
        }
    }
    
    function interactKeyUp(e) {
        if (e.keyCode >= 49 && e.keyCode <= 51) {
            if (performer.state === "ready") {
                socket.emit("begin playing");
            } else if (performer.state === "playing") {
                if (performer.current_event.score !== 0 && e.keyCode === 50 && performer.middle_foot_switch > 1) {
                    let loudness_array = scores[performer.current_event.score].loudness;

                    if (performer.current_event.score !== 16) { // diagram3x1
                        loudness_array = loudness_array[performer.current_event.part];
                    }
                    
                    const previous_loudness = performer.current_event.loudness;
                    
                    performer.current_event.loudness = loudness_array[(loudness_array.indexOf(performer.current_event.loudness) + Math.max(Math.floor(performer.middle_foot_switch) - 1, 0)) % loudness_array.length];
                    
                    if (previous_loudness !== performer.current_event.loudness) {
                        performer.general_loudness = loudness_array.indexOf(performer.current_event.loudness) / Math.max((loudness_array.length - 1), 1);
                    }
                    
                    let i;
                    
                    for (i = 1; i <= 3; i += 1) {
                        const next_event = "next_event_" + i;
                        
                        if (performer[next_event] !== "[]") {
                            delete performer[next_event].loudness;
                            
                            score_types[scores[performer[next_event].score].type].formatEvent(performer, next_event);
                        }
                    }
                                        
                    performer.middle_foot_switch = 0;
                } else {
                    if (e.keyCode === 50 && performer.middle_foot_switch !== 0) {
                        performer.middle_foot_switch = 0;
                    }
                    
                    score_types[scores[performer.current_event.score].type].interact(performer, e.keyCode - 48);
                }
            }
        }
        
        if (e.keyCode === 27 && performer.state === "playing") { // Esc
            socket.emit("the end", performer.clock.master);
            
            performer.state = "ended";
        }
        
        if (e.keyCode === 65 && performer.state !== "waiting") { // "a"
            socket.emit("abort");
        }
    }
        
    socket.on("new performer", function newPerformer() {
        choosePerformer();
    });
    
    socket.on("already taken", function alreadyTaken() {
        window.alert("The performer you chose is already taken ... Please try again.");
        
        choosePerformer();
    });
    
    socket.on("confirm performer", function confirmPerformer(index) {
        GUI.load();
        
        performer = {index: parseInt(index)};
        
        aux.loadMedia(performer.index * 5 + 1, performer.index * 5 + 5, "", true, function init() {
            GUI.init();
            
            performer.state = "waiting";
            performer.clock = {master: 0, delta: 0, t0: 0};

            socket.emit("init?");

            window.requestAnimationFrame(loop);
        });
    });
    
    socket.on("init performer", function initPerformer(index, log) {
        if (performer !== "monitor" && performer.index === parseInt(index)) {
            log = log.split(":");
            log[1] = log[1].split(",");
            
            performer.current_event = {score: parseInt(log[0])};
                                    
            score_types[scores[performer.current_event.score].type].read(performer, "current_event", log[1]);

            let loudness_array;
            
            if (performer.current_event.score !== 0) {
                loudness_array = scores[performer.current_event.score].loudness;

                if (performer.current_event.score !== 16) {
                    loudness_array = loudness_array[performer.current_event.part];
                }
            } else {
                loudness_array = [0];
            }

            performer.general_loudness = Math.max(loudness_array.indexOf(performer.current_event.loudness) / Math.max((loudness_array.length - 1), 1), 0);
                                                
            if (score_types[scores[performer.current_event.score].type].next_event_index && performer.current_event.part < 11) {
                performer.next_event_index = 1;
            } else {
                performer.next_event_index = 0;
            }
            
            performer.dynamic_link = "[]";
                        
            performer.state = "ready";
                        
            window.onkeydown = interactKeyDown;
            window.onkeyup = interactKeyUp;
        }
    });
    
    socket.on("begin playing", function beginPlaying() {
        if (performer !== "monitor") {
            performer.state = "playing";
        }
    });
    
    socket.on("others' loudness", function othersLoudness(others_loudness) {
        performer.others_loudness = others_loudness.split(",");
    });
    
    socket.on("dynamic link", function dynamicLink(dynamic_link) {
        if (dynamic_link !== "[]") {
            dynamic_link = dynamic_link.split(":");

            performer.dynamic_link = {score: parseInt(dynamic_link[0])};

            score_types[scores[performer.dynamic_link.score].type].read(performer, "dynamic_link", dynamic_link[1].split(","));
        } else {
            performer.dynamic_link = "[]";
        }
    });
    
    socket.on("abort", function abort() {
        if (performer !== "monitor") {
            performer.state = "aborted";
            
            socket.emit("reset");
        } else {
            monitor.abort();
        }
    });
    
    socket.on("the end", function theEnd() {
        socket.emit("reset");
    });

    socket.on("load monitor", function loadMonitor(clock) {
        performer = "monitor";
        
        monitor.load(parseFloat(clock));
    });
    
    socket.on("update monitor", function updateMonitor(index, state, log) {
        if (performer === "monitor") {
            monitor.update(index, state, log);
        }
    });
}