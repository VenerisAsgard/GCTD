import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Crosshair} from './crosshair.js'
import {Indicator} from './indicator.js'



export class Init {
    constructor(extension) {
        this.extension = extension;
    }
    start() {
        this.settings = this.extension.getSettings();
        if (this.settings.get_string('home-path') == "") {
            this.settings.set_string('home-path', GLib.get_home_dir());
        }
        if (this.settings.get_string('icon-path') == "") {
            this.settings.set_string('icon-path', `${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/GCTD@dev.va_icloud.com/resources/CH/CR1.png`);
        }
        
        this.crosshair = new Crosshair(this.settings); //добавление сразу
        //
        
        
        this.indicator = new Indicator(this.extension, this.crosshair);
        this.indicator.add();
    }
    
    stop() {
        this.indicator.exit();
        this.indicator = null;
        this.crosshair.exit();
        this.crosshair = null;
    }
}
