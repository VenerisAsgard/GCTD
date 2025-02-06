import St from 'gi://St';
import Gio from 'gi://Gio';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';


export class Indicator{
    constructor(extension, crosshair) {
        this.extension = extension;
        this.crosshair = crosshair;
        this.indicator = new PanelMenu.Button(0.0, "P-Btn", false);
        this.indicator.add_child(new St.Icon({style_class: 'crosshair-icon'}));
        this.indicator.menu.addAction(_('Crosshair new Show/Hide'), () => this.crosshair.add_or_destroy());
        this.indicator.menu.addAction(_('Preferences'), () => this.extension.openPreferences());
        this.extension.settings.bind('show-indicator', this.indicator, 'visible', Gio.SettingsBindFlags.DEFAULT);
        
    }
    add() {
        Main.panel.addToStatusArea(this.extension.uuid, this.indicator);
    }
    exit() {
        this.indicator.destroy();
    }


}
