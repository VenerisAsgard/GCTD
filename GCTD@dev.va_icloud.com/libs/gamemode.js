import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

//сочетание клавиш

export class Gamemode{
    constructor(extension) {
        this.gnome_settings_notifications = new Gio.Settings({ schema_id: 'org.gnome.desktop.notifications' });
        this.gnome_settings_mouse = new Gio.Settings({ schema_id: 'org.gnome.desktop.peripherals.mouse' });
        this.extension = extension;
    }

    
    start(){
        this.gnome_settings_notifications.set_boolean('show-banners', false);
        this.gnome_settings_mouse.set_string('accel-profile', 'flat');
        //gsettings set org.gnome.desktop.peripherals.mouse speed -1..1
    }

    exit(){
        this.gnome_settings_notifications.set_boolean('show-banners', true);
        this.gnome_settings_mouse.set_string('accel-profile', 'default');
    }


}
