/*global aux, scores*/

/*jslint es6, node, for*/

const score_types = {};

const default_type = (function defaultType() {
    "use strict";
    
    function formatEvent(performer, event) {
        if (performer[event].loudness === undefined) {
            performer[event].loudness = scores[performer[event].score].loudness[performer[event].part][Math.floor(performer.general_loudness * (scores[performer[event].score].loudness[performer[event].part].length - 1))];
        }
    }
    
    function updateNextEvents(performer) {
        let network = [];
        
        let i;
                
        for (i = 0; i < scores[performer.current_event.score].network[performer.current_event.part].length; i += 1) {
            network.push(scores[performer.current_event.score].network[performer.current_event.part][i]);
        }

        while (network.length > 3) {
            let max = 0;
            let max_index = -1;

            for (i = 0; i < network.length; i += 1) {
                if (scores[performer.current_event.score].histogram[network[network.length - i - 1]] > max) {
                    max_index = network.length - i - 1;
                    max = scores[performer.current_event.score].histogram[network[max_index]];
                }
            }

            if (max_index !== -1) {
                network.splice(max_index, 1);
            } else {
                network.splice(network.length - 1, 1);
            }
        }

        for (i = 1; i <= network.length; i += 1) {
            performer["next_event_" + i] = {score: performer.current_event.score, part: network[i - 1]};
        }
        
        if (network.length < 3) {
            performer.next_event_3 = "[]";
        }
    }
    
    function changeCurrentEvent(performer, next_event_index) {
        if (scores[performer.current_event.score].type === "map") {
            scores[performer.current_event.score].previous_part = performer.current_event.part;
        }
                
        if (scores[performer.current_event.score].type === "scroll_mod" && performer.current_event.part < 11) {
            scores[performer.current_event.score].previous_events.push({part: performer.current_event.part, direction: performer.current_event.direction, orientation: performer.current_event.orientation});
        } else {
            scores[performer.current_event.score].previous_events = [];
        }
        
        const next_event_name = "next_event_" + next_event_index;
        
        let next_event = score_types[scores[performer[next_event_name].score].type].write(performer, next_event_name);
        
        next_event = next_event.split(":");
        next_event[1] = next_event[1].split(",");
                
        performer.current_event = {score: parseInt(next_event[0])};
                
        score_types[scores[performer[next_event_name].score].type].read(performer, "current_event", next_event[1]);
        
        if (score_types[scores[performer[next_event_name].score].type].next_event_index && performer.current_event.part < 11) {
            performer.next_event_index = 1;
        } else {
            performer.next_event_index = 0;
        }
        
        if (score_types[scores[performer[next_event_name].score].type].updateNextEvents) {
            let i;
            
            for (i = 1; i <= 3; i += 1) {
                performer["next_event_" + i] = "[]";
            }
        }
    }
    
    function interact(performer, key) {
        if (performer["next_event_" + key] !== "[]") {
            changeCurrentEvent(performer, key);
        } else {
            if (key === 1 && performer.current_event.part > 0) {
                performer.current_event.part -= 1;
                
                delete performer.current_event.loudness;
                formatEvent(performer, "current_event");
            }
            
            if (key === 3 && performer.current_event.part < scores[performer.current_event.score].loudness.length - 1) {
                performer.current_event.part += 1;
                
                delete performer.current_event.loudness;
                formatEvent(performer, "current_event");
            }
        }
    }
    
    function read(performer, event, log) {
        performer[event].part = parseInt(log[0]);
        performer[event].loudness = parseInt(log[1]);
    }
    
    function write(performer, event) {
        return performer[event].score + ":" + performer[event].part + "," + performer[event].loudness;
    }
    
    return {
        formatEvent: formatEvent,
        updateNextEvents: updateNextEvents,
        changeCurrentEvent: changeCurrentEvent,
        interact: interact,
        read: read,
        write: write
    };
}());

score_types.map = (function map() {
    "use strict";
    
    function formatEvent(performer, event) {
        if (performer[event].t === undefined) {
            if (performer[event].score === performer.current_event.score) {
                performer[event].t = scores[performer.current_event.score].transition(performer.current_event.part, performer[event].part) * -1 || 0;
            } else {
                performer[event].t = 0;
            }
        }
        
        default_type.formatEvent(performer, event);
    }
    
    function updateCurrentEvent(performer, monitor) {
        performer.current_event.t += performer.clock.delta;
        
        if (!monitor && performer.current_event.t >= scores[performer.current_event.score].durations[performer.current_event.part]) {
            scores[performer.current_event.score].histogram[performer.current_event.part] += 1;
                        
            default_type.changeCurrentEvent(performer, performer.next_event_index);
        }
    }
    
    function interact(performer, key) {
        if (performer["next_event_" + key] !== "[]") {
            performer.next_event_index = key;
        }
    }
    
    function read(performer, event, log) {
        performer[event].part = parseInt(log[0]);
        performer[event].t = parseFloat(log[1]);
        performer[event].loudness = parseInt(log[2]);
    }
    
    function write(performer, event) {
        return performer[event].score + ":" + performer[event].part + "," + performer[event].t + "," + performer[event].loudness;
    }
    
    function imageCoords(performer, event, scale) {
        let sx;
        let sy;
                
        if (event === "current_event" && performer.current_event.t < 0) {
            // blank screen when starting monitoring during transition
            let previous_part = scores[performer.current_event.score].previous_part;
            
            if (previous_part === undefined) {
                previous_part = -1;
            }
            
            const transition = scores[performer.current_event.score].transition(previous_part, performer.current_event.part);
            const interpolation = Math.min((performer.current_event.t + transition) / transition, 1);
            
            // because scores[...].parts[-1] leads to an error
            if (previous_part === -1) {
                previous_part = 0;
            }
            
            sx = scores[performer.current_event.score].parts[performer.current_event.part][0] * interpolation + scores[performer.current_event.score].parts[previous_part][0] * (1 - interpolation) - 384;
            sy = scores[performer.current_event.score].parts[performer.current_event.part][1] * interpolation + scores[performer.current_event.score].parts[previous_part][1] * (1 - interpolation) - 400;
        } else {
            sx = scores[performer[event].score].parts[performer[event].part][0] - 384;
            sy = scores[performer[event].score].parts[performer[event].part][1] - 400;
        }
                
        let image_coords = [];
        
        image_coords.push({
            sx: sx,
            sy: sy,
            swidth: 768,
            sheight: 800,
            dx: 0,
            dy: 0,
            dwidth: 768 * scale,
            dheight: 800 * scale
        });

        return image_coords;
    }
    
    function cursor(performer, event, scale) {
        if (event !== "current_event" || performer.current_event.t >= 0) {
            return {
                type: "rectangle",
                dim: {
                    width: scores[performer[event].score].parts[performer[event].part][2] * scale,
                    height: scores[performer[event].score].parts[performer[event].part][3] * scale
                }
            };
        }
        
        return {type: "none"};
    }
    
    function timer(performer) {
        if (performer.current_event.t >= 0) {
            return Math.max(scores[performer.current_event.score].durations[performer.current_event.part] - performer.current_event.t, 0).toFixed(1);
        }
        
        return Math.max(performer.current_event.t * -1, 0).toFixed(1);
    }
    
    return {
        formatEvent: formatEvent,
        updateCurrentEvent: updateCurrentEvent,
        updateNextEvents: default_type.updateNextEvents,
        next_event_index: true,
        interact: interact,
        read: read,
        write: write,
        imageCoords: imageCoords,
        cursor: cursor,
        timer: timer
    };
}());

score_types.mod_image = (function modImage() {
    "use strict";
    
    function interact(performer, key) {
        if (performer["next_event_" + key] !== "[]") {
            scores[performer.current_event.score].histogram[performer.current_event.part] += 1;

            default_type.changeCurrentEvent(performer, key);
        }
    }
    
    function imageCoords(performer, event, scale) {
        function modToCoord(modules) {
            let coords = [];

            modules.forEach(function pushCoords(module, index) {
                if (module) {
                    coords.push([0, index * scores[performer[event].score].grid.height, scores[performer[event].score].grid.width, scores[performer[event].score].grid.height]);
                }
            });

            return coords;
        }
        
        let module_coords = modToCoord(scores[performer[event].score].parts[performer[event].part]);
        
        let image_coords = [];
        
        module_coords.forEach(function pushModule(module) {
            image_coords.push({
                sx: module[0],
                sy: module[1],
                swidth: module[2],
                sheight: module[3],
                dx: 0,
                dy: 0,
                dwidth: 768 * scale,
                dheight: 800 * scale
            });
        });
        
        return image_coords;
    }
        
    return {
        formatEvent: default_type.formatEvent,
        updateNextEvents: default_type.updateNextEvents,
        interact: interact,
        read: default_type.read,
        write: default_type.write,
        imageCoords: imageCoords
    };
}());

score_types.scroll_loop = (function scrollLoop() {
    "use strict";
        
    function formatEvent(performer, event) {
        if (performer[event].direction === undefined) {
            performer[event].direction = 1;
        }
        
        if (performer[event].x === undefined) {
            performer[event].x = 0;
        }
        
        default_type.formatEvent(performer, event);
    }
    
    function updateCurrentEvent(performer) {
        performer.current_event.x += performer.clock.delta * scores[performer.current_event.score].speed[performer.current_event.part] * performer.current_event.direction;
    }
    
    function interact(performer, key) {
        if (key === 2 && performer.next_event_2 === "[]") {
            performer.current_event.direction *= -1;
        } else {
            default_type.interact(performer, key);
        }
    }
    
    function read(performer, event, log) {
        performer[event].part = parseInt(log[0]);
        performer[event].direction = parseInt(log[1]);
        performer[event].x = parseInt(log[2]);
        performer[event].loudness = parseInt(log[3]);
    }
    
    function write(performer, event) {
        return performer[event].score + ":" + performer[event].part + "," + performer[event].direction + "," + performer[event].x + "," + performer[event].loudness;
    }
        
    function imageCoords(performer, event, scale) {
        performer[event].x %= scores[performer[event].score].image.width;

        if (performer[event].x < 0) {
            performer[event].x += scores[performer[event].score].image.width;
        }

        let image_coords = [];
        
        const unscaled_dx = 384 - performer[event].x;
        const dy = ((800 - scores[performer[event].score].parts[performer[event].part]) / 2 - aux.sumArray(performer[event].part, scores[performer[event].score].parts)) * scale;

        image_coords.push({
            sx: 0,
            sy: 0,
            swidth: scores[performer[event].score].image.width,
            sheight: scores[performer[event].score].image.height,
            dx: unscaled_dx * scale,
            dy: dy,
            dwidth: scores[performer[event].score].image.width * scale,
            dheight: scores[performer[event].score].image.height * scale
        });

        if (performer[event].x < 384) {
            image_coords.push({
                sx: 0,
                sy: 0,
                swidth: scores[performer[event].score].image.width,
                sheight: scores[performer[event].score].image.height,
                dx: (unscaled_dx - scores[performer[event].score].image.width) * scale,
                dy: dy,
                dwidth: scores[performer[event].score].image.width * scale,
                dheight: scores[performer[event].score].image.height * scale
            });
        }

        if (performer[event].x > scores[performer[event].score].image.width - 768 / 2) {
            image_coords.push({
                sx: 0,
                sy: 0,
                swidth: scores[performer[event].score].image.width,
                sheight: scores[performer[event].score].image.height,
                dx: (unscaled_dx + scores[performer[event].score].image.width) * scale,
                dy: dy,
                dwidth: scores[performer[event].score].image.width * scale,
                dheight: scores[performer[event].score].image.height * scale
            });
        }

        return image_coords;
    }
    
    function maskCoords(performer, event, scale) {
        const sum = aux.sumArray(performer[event].part, scores[performer[event].score].parts);
        const y_ = (800 - scores[performer[event].score].parts[performer[event].part]) / 2;
        const y = Math.max((y_ - sum) * scale, 0);
        const width = 768 * scale;
        
        return [
            {
                x: 0,
                y: y,
                width: width,
                height: y_ * scale - y
            },
            {
                x: 0,
                y: ((800 + scores[performer[event].score].parts[performer[event].part]) / 2) * scale,
                width: width,
                height: (scores[performer[event].score].image.height - sum - scores[performer[event].score].parts[performer[event].part]) * scale
            }
        ];
    }
    
    function cursor(performer, event, scale) {
        return {
            type: "arrow",
            dim: {
                height: scores[performer[event].score].parts[performer[event].part] * scale,
                offset: 0
            }
        };
    }
    
    return {
        formatEvent: formatEvent,
        updateCurrentEvent: updateCurrentEvent,
        interact: interact,
        read: read,
        write: write,
        imageCoords: imageCoords,
        maskCoords: maskCoords,
        mask_color: "rgba(127, 127, 0, 0.5)",
        cursor: cursor
    };
}());

score_types.scroll_mod = (function scrollMod() {
    "use strict";
    
    let mask_coords = [];
    
    function formatEvent(performer, event) {
        if (performer[event].part < 11) {
            if (performer[event].direction === undefined) {
                performer[event].direction = Math.floor(Math.random() * 2);
            }
                        
            if (performer[event].orientation === undefined) {
                let possible_orientations = [0, 1, 2, 3];
                
                possible_orientations.splice(scores[performer[event].score].previous_orientation[performer[event].part * 2 + performer[event].direction], 1);
                
                performer[event].orientation = possible_orientations[Math.floor(Math.random() * 3)];
            }

            if (performer[event].x === undefined) {
                if (performer[event].score === performer.current_event.score) {
                    if (performer.current_event.part < 11) {
                        performer[event].x = scores[performer[event].score].transition(performer.current_event.part * 2 + performer.current_event.direction, performer[event].part * 2 + performer[event].direction) * -1 || 0;
                    } else {
                        performer[event].x = scores[performer[event].score].transition(performer.current_event.part + 11, performer[event].part * 2 + performer[event].direction) * -1;
                    }
                } else {
                    performer[event].x = -13;
                }
            }
        }
        
        default_type.formatEvent(performer, event);
    }
    
    function updateCurrentEvent(performer, monitor) {
        if (performer.current_event.part < 11) {
            performer.current_event.x += performer.clock.delta * scores[performer.current_event.score].speed;
            
            if (!monitor && performer.current_event.x >= scores[performer.current_event.score].widths[performer.current_event.part][Math.floor(performer.current_event.orientation / 2)]) {
                const part = performer.current_event.part * 2 + performer.current_event.direction;
                
                scores[performer.current_event.score].histogram[part] += 1;
                scores[performer.current_event.score].previous_orientation[part] = performer.current_event.orientation;
                
                default_type.changeCurrentEvent(performer, performer.next_event_index);
            }
        }
    }
    
    function interact(performer, key) {
        if (performer["next_event_" + key] !== "[]") {
            if (performer.current_event.part < 11) {
                performer.next_event_index = key;
            } else {
                scores[performer.current_event.score].histogram[performer.current_event.part + 11] += 1;
                
                default_type.changeCurrentEvent(performer, key);
            }
        }
    }
    
    function updateNextEvents(performer) {
        const part = performer.current_event.part;
        
        if (performer.current_event.part < 11) {
            performer.current_event.part = performer.current_event.part * 2 + performer.current_event.direction;
        } else {
            performer.current_event.part += 11;
        }
        
        default_type.updateNextEvents(performer);
        
        performer.current_event.part = part;
        
        let i;
        
        for (i = 1; i <= 3; i += 1) {
            const next_event = "next_event_" + i;
            
            if (performer[next_event] !== "[]") {
                if (performer[next_event].part < 22) {
                    performer[next_event].direction = performer[next_event].part % 2;
                    performer[next_event].part = Math.floor(performer[next_event].part / 2);
                } else {
                    performer[next_event].part -= 11;
                }
            }
        }
    }
    
    function read(performer, event, log) {
        performer[event].part = parseInt(log[0]);
        
        if (performer[event].part < 11) {
            performer[event].direction = parseInt(log[1]);
            performer[event].orientation = parseInt(log[2]);
            performer[event].x = parseInt(log[3]);
            performer[event].loudness = parseInt(log[4]);
        } else {
            performer[event].loudness = parseInt(log[1]);
        }
    }
    
    function write(performer, event) {
        if (performer[event].part < 11) {
            return performer[event].score + ":" + performer[event].part + "," + performer[event].direction + "," + performer[event].orientation + "," + performer[event].x + "," + performer[event].loudness;
        }
        
        return performer[event].score + ":" + performer[event].part + "," + performer[event].loudness;
    }
    
    function imageCoords(performer, event, scale) {
        let image_coords = [];
        
        let width;
        
        if (performer[event].part < 11) {
            width = scores[performer[event].score].widths[performer[event].part][Math.floor(performer[event].orientation / 2)];
        }
        
        if (event === "current_event") {
            if (performer.current_event.part < 11) {
                image_coords.push({
                    sx: performer.current_event.part * scores[performer.current_event.score].grid,
                    sy: (performer.current_event.direction * 4 + performer.current_event.orientation) * scores[performer.current_event.score].grid,
                    swidth: width,
                    sheight: scores[performer.current_event.score].grid,
                    dx: (384 - performer.current_event.x) * scale,
                    dy: (800 - scores[performer.current_event.score].grid) / 2 * scale,
                    dwidth: width * scale,
                    dheight: scores[performer.current_event.score].grid * scale
                });
                                
                const next_event = "next_event_" + performer.next_event_index;
                
                if (performer[next_event].part < 11) {
                    const next_width = scores[performer.current_event.score].widths[performer[next_event].part][Math.floor(performer[next_event].orientation / 2)];

                    image_coords.push({
                        sx: performer[next_event].part * scores[performer.current_event.score].grid,
                        sy: (performer[next_event].direction * 4 + performer[next_event].orientation) * scores[performer.current_event.score].grid,
                        swidth: next_width,
                        sheight: scores[performer.current_event.score].grid,
                        dx: (384 - performer.current_event.x + (width - performer[next_event].x)) * scale,
                        dy: (800 - scores[performer.current_event.score].grid) / 2 * scale,
                        dwidth: next_width * scale,
                        dheight: scores[performer.current_event.score].grid * scale
                    });
                    
                    mask_coords = [{
                        x: image_coords[1].dx,
                        y: image_coords[1].dy,
                        width: image_coords[1].dwidth,
                        height: image_coords[1].dheight
                    }];
                } else {
                    mask_coords = [];
                }
                
                if (scores[performer.current_event.score].previous_events.length) {
                    let i = 1;
                    let dx = performer.current_event.x;

                    let previous_part = performer.current_event.part;
                    let previous_direction = performer.current_event.direction;
                                        
                    let previous_event = scores[performer.current_event.score].previous_events[scores[performer.current_event.score].previous_events.length - i];

                    while (dx < 800 && i <= scores[performer.current_event.score].previous_events.length) {
                        previous_event = scores[performer.current_event.score].previous_events[scores[performer.current_event.score].previous_events.length - i];
                            
                        const previous_previous_width = scores[performer.current_event.score].widths[previous_event.part][Math.floor(previous_event.orientation / 2)];

                        dx += scores[performer.current_event.score].transition(previous_event.part * 2 + previous_event.direction, previous_part * 2 + previous_direction) + previous_previous_width;
                        
                        image_coords.push({
                            sx: previous_event.part * scores[performer.current_event.score].grid,
                            sy: (previous_event.direction * 4 + previous_event.orientation) * scores[performer.current_event.score].grid,
                            swidth: previous_previous_width,
                            sheight: scores[performer.current_event.score].grid,
                            dx: (384 - dx) * scale,
                            dy: (800 - scores[performer.current_event.score].grid) / 2 * scale,
                            dwidth: previous_previous_width * scale,
                            dheight: scores[performer.current_event.score].grid * scale
                        });

                        previous_part = previous_event.part;
                        previous_direction = previous_event.direction;

                        i += 1;
                    }
                }
            } else {
                image_coords.push({
                    sx: scores[performer.current_event.score].grid * 11,
                    sy: (performer.current_event.part - 11) * 800,
                    swidth: 768,
                    sheight: 800,
                    dx: 0,
                    dy: 0,
                    dwidth: 768 * scale,
                    dheight: 800 * scale
                });
            }
        } else {
            if (performer[event].part < 11) {
                image_coords.push({
                    sx: performer[event].part * scores[performer[event].score].grid,
                    sy: (performer[event].direction * 4 + performer[event].orientation) * scores[performer[event].score].grid,
                    swidth: width,
                    sheight: scores[performer[event].score].grid,
                    dx: (384 - width) * scale,
                    dy: (800 - scores[performer[event].score].grid * 2) / 2 * scale,
                    dwidth: width * scale * 2,
                    dheight: scores[performer[event].score].grid * scale * 2
                });
            } else {
                let zoom = 1;
                
                if (performer[event].part === 11) {
                    zoom = -0.05;
                }
                
                image_coords.push({
                    sx: scores[performer[event].score].grid * 11,
                    sy: (performer[event].part - 11) * 800,
                    swidth: 768,
                    sheight: 800,
                    dx: 0 - zoom * 768 * scale / 2,
                    dy: 0 - zoom * 800 * scale / 2,
                    dwidth: 768 * scale * (1 + zoom),
                    dheight: 800 * scale * (1 + zoom)
                });
            }
        }
            
        return image_coords;
    }
    
    function maskCoords() {
        return mask_coords;
    }
    
    function cursor(performer, event, scale) {
        if (event === "current_event" && performer[event].part < 11) {
            return {
                type: "arrow",
                dim: {
                    height: 740 * scale,
                    offset: 30
                }
            };
        }
        
        return {type: "none"};
    }
    
    return {
        formatEvent: formatEvent,
        updateCurrentEvent: updateCurrentEvent,
        updateNextEvents: updateNextEvents,
        next_event_index: true,
        interact: interact,
        read: read,
        write: write,
        imageCoords: imageCoords,
        maskCoords: maskCoords,
        mask_color: "rgba(255, 255, 255, 0.5)",
        cursor: cursor
    };
}());

score_types.scroll_map = (function scrollMap() {
    "use strict";
        
    function formatEvent(performer, event) {
        if (!performer[event].x) {
            performer[event].x = Math.floor(Math.random() * (scores[performer[event].score].dim.width - scores[performer[event].score].cursor));
        }
        
        if (!performer[event].y) {
            performer[event].y = Math.floor(Math.random() * (scores[performer[event].score].dim.height - scores[performer[event].score].cursor));
        }
        
        if (!performer[event].direction) {
            performer[event].direction = 0;
        }
        
        if (!performer[event].loudness) {
            performer[event].loudness = scores[performer[event].score].loudness[Math.floor(performer.general_loudness * (scores[performer[event].score].loudness.length - 1))];
        }
    }
    
    function updateCurrentEvent(performer) {
        let xy = ["x", "y"];

        performer.current_event[xy[performer.current_event.direction % 2]] += performer.clock.delta * scores[performer.current_event.score].speed * (Math.floor(performer.current_event.direction / 2) * -2 + 1);
        
        performer.current_event.x = Math.min(Math.max(performer.current_event.x, 0), scores[performer.current_event.score].image.width - scores[performer.current_event.score].cursor);
        performer.current_event.y = Math.min(Math.max(performer.current_event.y, 0), scores[performer.current_event.score].image.height - scores[performer.current_event.score].cursor);
                            
        if (performer.current_event.x === 0 && performer.current_event.direction === 2) {
            performer.current_event.direction = 0;
        }

        if (performer.current_event.y === 0 && performer.current_event.direction === 3) {
            performer.current_event.direction = 1;
        }

        if (performer.current_event.x === scores[performer.current_event.score].image.width - scores[performer.current_event.score].cursor && performer.current_event.direction === 0) {
            performer.current_event.direction = 2;
        }

        if (performer.current_event.y === scores[performer.current_event.score].image.height - scores[performer.current_event.score].cursor && performer.current_event.direction === 1) {
            performer.current_event.direction = 3;
        }
    }
    
    function interact(performer, key) {
        if (performer["next_event_" + key] !== "[]") {
            default_type.changeCurrentEvent(performer, key);
        } else {
            if (key === 1) {
                if (performer.current_event.direction === 0) {
                    performer.current_event.direction = 2;
                } else {
                    performer.current_event.direction = 0;
                }
            }
            
            if (key === 3) {
                if (performer.current_event.direction === 1) {
                    performer.current_event.direction = 3;
                } else {
                    performer.current_event.direction = 1;
                }
            }
        }
    }
    
    function read(performer, event, log) {
        performer[event].x = parseInt(log[0]);
        performer[event].y = parseInt(log[1]);
        performer[event].direction = parseInt(log[2]);
        performer[event].loudness = parseInt(log[3]);
    }
    
    function write(performer, event) {
        return performer[event].score + ":" + performer[event].x + "," + performer[event].y + "," + performer[event].direction + "," + performer[event].loudness;
    }
    
    function imageCoords(performer, event, scale) {
        return [{
            sx: 0,
            sy: 0,
            swidth: scores[performer[event].score].image.width,
            sheight: scores[performer[event].score].image.height,
            dx: ((768 - scores[performer[event].score].cursor) / 2 - performer[event].x) * scale,
            dy: ((800 - scores[performer[event].score].cursor) / 2 - performer[event].y) * scale,
            dwidth: scores[performer[event].score].image.width * scale,
            dheight: scores[performer[event].score].image.height * scale
        }];
    }
    
    function maskCoords(performer, event, scale) {
        const width1_2 = 768 * scale;
        const width3_4 = (768 - scores[performer[event].score].cursor) / 2 * scale;
        const height1 = Math.floor((800 - scores[performer[event].score].cursor) / 2 * scale);
        const height3_4 = Math.floor(scores[performer[event].score].cursor * scale);
        
        return [
            {
                x: 0,
                y: 0,
                width: width1_2,
                height: height1
            },
            {
                x: 0,
                y: height1 + height3_4,
                width: width1_2,
                height: 800 * scale - (height1 + height3_4)
            },
            {
                x: 0,
                y: height1,
                width: width3_4,
                height: height3_4
            },
            {
                x: (768 + scores[performer[event].score].cursor) / 2 * scale,
                y: height1,
                width: width3_4,
                height: height3_4
            }
        ];
    }
    
    function cursor(performer, event, scale) {
        const scaled_cursor = scores[performer[event].score].cursor * scale;
        
        return {
            type: "rectangle",
            dim: {
                width: scaled_cursor,
                height: scaled_cursor
            }
        };
    }
    
    return {
        formatEvent: formatEvent,
        updateCurrentEvent: updateCurrentEvent,
        interact: interact,
        read: read,
        write: write,
        imageCoords: imageCoords,
        maskCoords: maskCoords,
        mask_color: "rgba(127, 127, 0, 0.5)",
        cursor: cursor
    };
}());

score_types.text = (function text() {
    "use strict";

    return {
        formatEvent: default_type.formatEvent,
        interact: default_type.interact,
        read: default_type.read,
        write: default_type.write,
        font: "24px Helvetica"
    };
}());

score_types.audio = (function audio() {
    "use strict";
    
    function audioText() {
        return "[audio]";
    }
    
    return {
        formatEvent: default_type.formatEvent,
        interact: default_type.interact,
        read: default_type.read,
        write: default_type.write,
        text: audioText,
        font: "24px Courier",
        align: "center"
    };
}());

score_types.pause = (function pause() {
    "use strict";
    
    const durations = [10, 30, 90];
    
    function formatEvent(performer, event) {
        performer[event].loudness = 0;
        
        if (performer[event].t === undefined) {
            performer[event].t = durations[performer[event].part];
        }
    }
        
    function updateCurrentEvent(performer) {
        if (performer.current_event.t >= 0) {
            performer.current_event.t -= performer.clock.delta;
        }
    }
    
    function updateNextEvents(performer) {
        let i;
        
        if (performer.current_event.t < 0 && performer.next_event_1 === "[]") {
            (function randomizeEvents() {
                const random_sequence = aux.randomSequence(5);

                function randomEvent(next_event_index) {
                    const next_event = "next_event_" + next_event_index;

                    performer[next_event] = {score: random_sequence[next_event_index - 1] + 1 + performer.index * 5};
                    
                    if (performer[next_event].score !== 16) { // diagram3x1
                        performer[next_event].part = Math.floor(Math.random() * scores[performer[next_event].score].loudness.length);
                    }
                }

                if (performer.dynamic_link && performer.dynamic_link !== "[]") {
                    performer.next_event_2 = Object.assign({}, performer.dynamic_link);

                    random_sequence.splice(random_sequence.indexOf((performer.dynamic_link.score - 1) % 5), 1);
                    
                    randomEvent(1);
                    randomEvent(3);

                } else {
                    for (i = 1; i <= 3; i += 1) {
                        randomEvent(i);
                    }
                }

                performer.general_loudness = Math.random();
            }());
        }
        
        if (performer.current_event.t >= 0) {
            for (i = 1; i <= 3; i += 1) {
                performer["next_event_" + i] = "[]";
            }
        }
    }
    
    function interact(performer, key) {
        if (performer.current_event.t < 0) {
            default_type.changeCurrentEvent(performer, key);
        }
    }
    
    function read(performer, event, log) {
        performer[event].part = parseInt(log[0]);
        performer[event].t = parseFloat(log[1]);
        
        formatEvent(performer, event);
    }
        
    function write(performer, event) {
        return performer[event].score + ":" + performer[event].part + "," + performer[event].t;
    }
    
    function timer(performer) {
        if (performer.current_event.t > 0) { // should have been >=, monitor bug?
            return performer.current_event.t.toFixed(1);
        }
        
        return "";
    }
    
    function pauseText(performer) {
        if (performer.current_event.score === 0 && performer.current_event.t < 0) {
            return "=>";
        }
        
        return ".";
    }
    
    return {
        formatEvent: formatEvent,
        updateCurrentEvent: updateCurrentEvent,
        updateNextEvents: updateNextEvents,
        interact: interact,
        read: read,
        write: write,
        timer: timer,
        text: pauseText,
        font: "24px Courier",
        align: "center"
    };
}());


if (typeof exports !== "undefined") {
    exports.score_types = score_types;
    
    const path = require("path");

    scores = require(path.join(__dirname, "/scores.js")).scores;
    aux = require(path.join(__dirname, "/aux.js")).aux;
}

