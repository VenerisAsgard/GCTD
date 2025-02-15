import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Crosshair} from './crosshair.js'
import {Indicator} from './indicator.js'
import {Gamemode} from './gamemode.js'



export class Init {
    constructor(extension) {
        this.extension = extension;
    }
    start() {
        this.settings = this.extension.getSettings();
        //if (this.settings.get_string('home-path') == "") {
        //    this.settings.set_string('home-path', GLib.get_home_dir());
        //}
        if (this.settings.get_string('icon-path') == "") {
            this.settings.set_string('icon-path', `${this.extension.path}/resources/CH/CR1.png`);
        }
        
        this.crosshair = new Crosshair(this.settings);
        this.gamemode = new Gamemode(this.extension);
        
        this.indicator = new Indicator(this.extension, this.crosshair, this.gamemode);
        this.indicator.add();
    }
    
    stop() {
        this.indicator.exit();
        this.indicator = null;
        this.crosshair.exit();
        this.crosshair = null;
    }
}
