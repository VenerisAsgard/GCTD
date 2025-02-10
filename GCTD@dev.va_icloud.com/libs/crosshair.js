import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import St from 'gi://St';
import GLib from 'gi://GLib';
import Clutter from 'gi://Clutter';
import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';




const VALUES = {showing: false, MorP: false, MAX_VALUE: 255, MIN_VALUE: 0, crosshair_object: null,}



function onSettingChanged(settings, key) {
    VALUES.crosshair_object.add_or_destroy(false);
    VALUES.crosshair_object.add_or_destroy(false);
}

export class Crosshair {
    constructor(settings) {
        this.settings = settings;
        this.ch = new St.Icon();
        VALUES.crosshair_object = this;
        this.settings.connect('changed', onSettingChanged);
    }
    exit() {
        VALUES.showing = false;
        Main.layoutManager.uiGroup.remove_child(this.ch);
    }
    add_or_destroy(arg) {
        if (!VALUES.showing) {
            let iconSize = this.settings.get_int('icon-size');
            let iconOpacity = this.settings.get_int('icon-opacity');
            VALUES.showing = true;
            Main.layoutManager.uiGroup.add_child(this.ch);

            function animate(x, value) {
                if (value >= VALUES.MAX_VALUE){VALUES.MorP = true}else if (value <= VALUES.MIN_VALUE) {VALUES.MorP = false}
                if (VALUES.MorP) {
                    value = value - 1;
                    VALUES.MorP = false;
                } else {
                    value = value + 1;
                    VALUES.MorP = true;
                }
                if (VALUES.showing) {
                    x.ease({
                        opacity: value,
                        duration: 1000,
                        mode: Clutter.AnimationMode.LINEAR,
                        onComplete: () => {
                            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 0, () => animate(x, value));
                            
                        }
                    });
                    
                }else {
                    GLib.SOURCE_REMOVE;  //remove timeout on VALUES.showing=false
                }
            }
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 0, () => animate(this.ch, iconOpacity));
            this.ch.opacity = iconOpacity;
            let pos_w = Main.layoutManager.uiGroup.width / 2;
            let pos_h = Main.layoutManager.uiGroup.height / 2;
            this.ch.set_position(pos_w - iconSize / 2 + this.settings.get_int('width-correction'), pos_h - iconSize / 2 + this.settings.get_int('height-correction'));
            this.ch.set_style(`background-size: ${iconSize}px; height: ${iconSize}px; width: ${iconSize}px; background-image: url(${this.settings.get_string('icon-path')});`);
            if (this.settings.get_boolean('show-notifications') && arg === undefined) {
                Main.notify(_('The crosshair is displayed.'));
            }
        }
        else {
            VALUES.showing = false;
            Main.layoutManager.uiGroup.remove_child(this.ch);
            if (this.settings.get_boolean('show-notifications') && arg === undefined) {    //вынести уведомления в utils
                Main.notify(_('The crosshair is hidden.'));
            }
        }
    }
}
