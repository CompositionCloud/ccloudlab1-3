/*global window, scores, score_types, GUI, aux*/

/*jslint es6, for*/

const monitor = (function monitor_() {
    "use strict";
    
    const performers = [{}, {}, {}, {}];
    
    let lines;
    let i;
    
    let speed = 1;
    
    function reset() {
        performers.forEach(function resetPerformer(performer) {
            performer.state = "waiting";
            performer.clock.master = 0;
        });
        
        delete scores[2].previous_part;
        delete scores[17].previous_part;
        
        scores[6].previous_events = [];
        scores[12].previous_events = [];
    }
    
    function update(index, state, log) {
        if (performers[index].state === "aborted" || performers[index].state === "ended") {
            reset();
        }
        
        if (log) {
            const temporary_current_event = Object.assign({}, performers[index].current_event);
            
            aux.logToEvents(performers[index], log);
            
            if (temporary_current_event.score !== performers[index].current_event.score || temporary_current_event.part !== performers[index].current_event.part) {
                if (scores[performers[index].current_event.score].type === "map") {
                    scores[performers[index].current_event.score].previous_part = temporary_current_event.part;
                }

                if (scores[performers[index].current_event.score].type === "scroll_mod" && performers[index].current_event.part < 11 && temporary_current_event.score && scores[temporary_current_event.score].type === "scroll_mod" && temporary_current_event.part < 11) {
                    scores[performers[index].current_event.score].previous_events.push({part: temporary_current_event.part, direction: temporary_current_event.direction, orientation: temporary_current_event.orientation});
                } else {
                    scores[performers[index].current_event.score].previous_events = [];
                }
            }
            
            if (performers[index].current_event.score === 0 && performers[index].next_event_1 !== "[]") {
                performers[index].current_event.t = 0;
            }
        }
        
        performers[index].state = state;
    }
        
    function loop(t) {
        GUI.draw(performers);
        
        performers.forEach(function updatePerformer(performer, index) {
            if (performer.state === "playing") {
                performer.clock.delta = (t - performer.clock.t0) / 1000 * speed;
                performer.clock.master += performer.clock.delta;
                
                if (lines && performer.clock.master >= parseFloat(lines[i][0]) && index === parseInt(lines[i][1])) {
                    if (lines[i][2] !== "the end") {
                        update(index, "playing", lines[i][2]);
                    } else {
                        update(index, "ended");
                    }
                    
                    if (i < lines.length - 1) {
                        i += 1;

                        lines[i] = lines[i].split("| ");
                    }
                }
                
                if (score_types[scores[performer.current_event.score].type].updateCurrentEvent) {
                    score_types[scores[performer.current_event.score].type].updateCurrentEvent(performer, true);
                }
            }
            
            performer.clock.t0 = t;
        });
        
        window.requestAnimationFrame(loop);
    }
    
    function load(clock, logfile) {
        GUI.load();
        
        aux.loadMedia(1, 20, "", false, function init() {
            performers.forEach(function initPerformer(performer) {
                performer.clock = {master: clock || 0, delta: 0, t0: 0};
                
                if (!performer.state) {
                    performer.state = "waiting";
                }
            });
                
            GUI.setToMonitor();
            GUI.init();

            if (logfile) {
                lines = logfile;

                for (i = 1; i <= 4; i += 1) {
                    lines[i] = lines[i].split("| ");

                    update(lines[i][1], "ready", lines[i][2]);
                }
                
                // i = 5
                
                lines[5] = lines[5].split("| ");
            }
            
            window.requestAnimationFrame(loop);
        });
    }
    
    function start() {
        performers.forEach(function startPlaying(performer) {
            if (performer.state === "ready") {
                performer.state = "playing";
            }
        });
    }
            
    function abort() {
        performers.forEach(function abortPerformer(performer) {
            performer.state = "aborted";
        });
    }
    
    function doubleSpeed() {
        speed *= 2;
    }
    
    function halfSpeed() {
        speed *= 0.5;
    }
    
    return {
        update: update,
        load: load,
        start: start,
        abort: abort,
        doubleSpeed: doubleSpeed,
        halfSpeed: halfSpeed
    };
}());