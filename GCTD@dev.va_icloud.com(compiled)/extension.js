import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import { Init } from './libs/init.js';


import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class GCTD_Extension extends Extension {
    enable() {        
        this.settings = this.getSettings();
        this.init = new Init(this);
        this.init.start();
        log("----------------------------------");
        log(_("GCTD@dev.va_icloud.com is enabled."));
        log("----------------------------------");
    }

    disable() {
        this.init.stop();
        this.init = null;
        log("-----------------------------------");
        log(_("GCTD@dev.va_icloud.com is disabled."));
        log("-----------------------------------");
    }
}
