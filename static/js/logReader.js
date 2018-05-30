/*global window, io, scores, score_types, GUI, aux, monitor*/

/*jslint es6, for*/

function logReader() {
    "use strict";
    
    GUI.dragAndDrop();
    
    document.body.ondragenter = function ondragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    };

    document.body.ondragover = function ondragover(e) {
        e.stopPropagation();
        e.preventDefault();
    };

    document.body.ondrop = function ondrop(e) {
        e.stopPropagation();
        e.preventDefault();

        let reader = new FileReader();

        reader.readAsText(e.dataTransfer.files[0]);
        reader.onloadend = function read(e) {
            let log = e.target.result.split("\n");

            if (log[0] !== "ccloudlab1-3-log") {
                window.alert("Invalid File!");
                return;
            }
            
            monitor.load(0, log);
        };
    };
    
    window.onkeyup = function interact(e) {
        if (e.keyCode >= 49 && e.keyCode <= 51) {
            monitor.start();
        }
        
        if (e.keyCode === 37) {
            monitor.halfSpeed();
        }
        
        if (e.keyCode === 39) {
            monitor.doubleSpeed();
        }
    };
}
