import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import GdkPixbuf from 'gi://GdkPixbuf';
import GLib from 'gi://GLib';
import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class MainPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window.settings = this.getSettings();
        const appearancePage = new Adw.PreferencesPage({
            title: _('Appearance'),
            icon_name: 'preferences-desktop-appearance-symbolic'
        });
        window.add(appearancePage);
        const appearance_group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of the extension.'),
        });
        
        
        
        
        
        
        
        
        
        
        
        const GLOBAL = {files: [], c_current: {}, c_childs: [], directoryPath: this.path + '/resources/CH'}; //directoryPath need for prefs.js 48:48
        
        const delBtn = new Adw.ButtonRow({
            title: _("Delete style"),
            css_classes: ['destructive-action', 'button', 'activatable']
        });
        if (GLOBAL.c_childs.length <= 2){
            delBtn.visible = false;
        } else {
            delBtn.visible = true;
        }
        
        
        const carousel = new Adw.Carousel({allow_scroll_wheel: true, allow_mouse_drag: true, spacing: 100});
        function read_dir(){
            GLOBAL.files = [];
            let folder = Gio.File.new_for_path(GLOBAL.directoryPath);
            
            // Получаем список файлов в директории
            let enumerator = folder.enumerate_children('standard::name', Gio.FileQueryInfoFlags.NONE, null);
            let info;
            
            while ((info = enumerator.next_file(null))) {
                let fileName = info.get_name();
                // Проверяем, что файл имеет расширение .png
                if (fileName.endsWith(".png")) {
                    GLOBAL.files.push(GLOBAL.directoryPath + '/' + fileName);  // Добавляем полный путь
                }
            }
            for (let g_path in GLOBAL.files){
                let g_texture = Gdk.Texture.new_from_filename(GLOBAL.files[g_path]);
                const g_photo = new Adw.Avatar({
                    size: 100,
                    customImage: g_texture,
                });

                if (GLOBAL.files[g_path] == window.settings.get_string('icon-path')){
                    GLOBAL.c_current = g_photo;
                }
                GLOBAL.c_childs.push(g_photo);
                carousel.append(g_photo);
                
            }
            carousel.scroll_to(GLOBAL.c_current, true);
        }
        
        
        
        
        
        function del_style(){
            carousel.remove(GLOBAL.c_childs[carousel.get_position()]);
            GLOBAL.c_childs.splice(carousel.get_position(), 1);
            if (GLOBAL.c_childs.length <= 2){
                delBtn.visible = false;
            }
            carousel.scroll_to(GLOBAL.c_childs[carousel.get_position() - 1], true);
            GLib.unlink(GLOBAL.files[carousel.get_position()]);
        }
        
        
        
        
        
        
        
        
        
        
        const filter = new Gtk.FileFilter();
            filter.add_mime_type('image/png');
        const native = new Gtk.FileChooserNative({ //проверить загрузку нескольких файлов и разбить этот файл на части
              title: _("Open PNG Image"),
              filter: filter,
              transient_for: window,
              action: Gtk.FileChooserAction.OPEN,
              accept_label: _("Open"),
              cancel_label: _("Cancel"),
            });
            native.connect("response", (self, response_id) => {
              if (response_id === Gtk.ResponseType.ACCEPT) {
                let file = native.get_file();
                let sourceFile = Gio.File.new_for_path(file.get_path());
                let n = [];
                for (let i in GLOBAL.files){
                    n.push(GLOBAL.files[i].substring(GLOBAL.files[i].lastIndexOf('CR') + 2, GLOBAL.files[i].lastIndexOf('.png')));
                }
                let destinationFile = Gio.File.new_for_path(`${GLOBAL.directoryPath}/CR${Math.max.apply(Math, n) + 1}.png`);
                sourceFile.copy(destinationFile, Gio.FileCopyFlags.OVERWRITE, null, null);
                for (let child of GLOBAL.c_childs) {
                    carousel.remove(child);
                }
                GLOBAL.c_childs = [];
                read_dir();
                carousel.scroll_to(GLOBAL.c_childs[GLOBAL.c_childs.length - 1], true);
              }
              if (GLOBAL.c_childs.length <= 2){
                  delBtn.visible = false;
              } else {
                  delBtn.visible = true;
              }
            });
            



    
        const preview_row = new Adw.ActionRow({});
        
        
        
        read_dir();
        
        
        
        carousel.connect('page-changed', () => {
            window.settings.set_string('icon-path', GLOBAL.files[carousel.get_position()])
        });
        let pageIndicator = new Adw.CarouselIndicatorDots();
        pageIndicator.set_carousel(carousel);
        let box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
        box.append(carousel);
        box.append(pageIndicator);
        preview_row.set_child(box);
        const openBtn = new Adw.ButtonRow({
            title: _("Choose a new style from files"),
            end_icon_name: 'edit-find-symbolic'
        });
        openBtn.connect('activated', () => {
            native.show();
        });
        
        delBtn.connect('activated', () => {
            if (GLOBAL.c_childs.length <= 2){
                delBtn.visible = false;
            } else {
                del_style();
            }
        });
        
        const opacity_row = new Adw.SpinRow({
            title: _('Opacity'),
            subtitle: _('Opacity (0-255)')
        });
        this.bindNumberRow({
            settings: window.settings,
            row: opacity_row,
            key: 'icon-opacity',
            range: [0, 255, 1]
        });
        const size_row = new Adw.SpinRow({
            title: _('Size'),
            subtitle: _('Crosshair size (in px)')
        });
        this.bindNumberRow({
            settings: window.settings,
            row: size_row,
            key: 'icon-size',
            range: [1, 1280, 1]
        });
        const correction_w = new Adw.SpinRow({
            title: _('Width deviation'),
            subtitle: _('Deviation in width relative to the center of the screen')
        });
        this.bindNumberRow({
            settings: window.settings,
            row: correction_w,
            key: 'width-correction',
            range: [-1280, 1280, 1]
        });
        const correction_h = new Adw.SpinRow({
            title: _('Height deviation'),
            subtitle: _('Deviation in height relative to the center of the screen')
        });
        this.bindNumberRow({
            settings: window.settings,
            row: correction_h,
            key: 'height-correction',
            range: [-720, 720, 1]
        });
        appearance_group.add(preview_row);
        appearance_group.add(openBtn);
        appearance_group.add(delBtn);
        appearance_group.add(opacity_row);
        appearance_group.add(size_row);
        appearance_group.add(correction_w);
        appearance_group.add(correction_h);
        appearancePage.add(appearance_group);
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------      
        const notificationPage = new Adw.PreferencesPage({
            title: _('Notifications'),
            icon_name: 'chat-message-new-symbolic'
        });
        window.add(notificationPage);
        const notification_group = new Adw.PreferencesGroup({
            title: _('Notification'),
            description: _('Set up extension notifications and indicator'),
        });
        // Create a new preferences row
        const ind_row = new Adw.SwitchRow({
            title: _('Display indicator'),
            subtitle: _('Display the indicator on the panel'),
        });
        window.settings.bind('show-indicator', ind_row, 'active', Gio.SettingsBindFlags.DEFAULT);
        const notif_row = new Adw.SwitchRow({
            title: _('Show Notifications'),
            subtitle: _('Show extension notifications'),
        });
        window.settings.bind('show-notifications', notif_row, 'active', Gio.SettingsBindFlags.DEFAULT);
        notification_group.add(ind_row);
        notification_group.add(notif_row);
        notificationPage.add(notification_group);
        //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
        const creditsPage = new Adw.PreferencesPage({
            title: _('Credits'),
            icon_name: 'help-about-symbolic'
        });
        window.add(creditsPage);
        const credits_group = new Adw.PreferencesGroup({
            title: _('Credits'),
            description: _('Credits page'),
        });
        const githubBtn = new Adw.ButtonRow({
            title: _("⭐ Extension page on GitHub ⭐"),
            end_icon_name: 'go-next-symbolic'
        });
        githubBtn.connect('activated', () => {
            Gio.AppInfo.launch_default_for_uri('https://github.com/VenerisAsgard/GCTD/', null);
        });
        const telegramBtn = new Adw.ButtonRow({
            title: _("💬 Communication with the developer (Telegram) 💬"),
            end_icon_name: 'go-next-symbolic'
        });
        telegramBtn.connect('activated', () => {
            Gio.AppInfo.launch_default_for_uri('https://t.me/venerisasgard', null);
        });
        let criptoList = new Gtk.StringList();
        var addrss = {
            'BTC': "bc1q2448mdrytds7t6fp9u9w9tx0jk769ufzsvwcc8",
            'ETH': "0xc7179c4FD6E291183689bb4A22a375f8658C8307",
            'USDT': "0xc7179c4FD6E291183689bb4A22a375f8658C8307",
            'USDC': "0xc7179c4FD6E291183689bb4A22a375f8658C8307",
            'XRP': "rnext3DByHhikxGXJ6JypVWPy9uvNnN8cC",
            'TON': "UQBwbuHP8iectW2qjgl1xuuwC1A_yhFQ8X-fKQxH2vyU4TPo",
            'SOL': "6YyjfYAWfz267WisgNuZRFsX557m3aQ7uDrHjyXvHFzY",
            'TRX': "TLijrFe2hMeVnbfiH6Y8Yy3rczVVEztcpx",
            'DOT': "14NcJ1aCYqiZ6HUkmNVk1gTg1DmLQ3nRubeeG67DMZ2J4uuB",
            'ADA': "addr1qy8v47ntj5yxfs22rsnznzwluhl3t35pcumsxakhd7hdwljgppjksktjxpzmh02tz7wxuv7xg4euy9tydpryezm447cszs4kpt",
            'BNB': "0xc7179c4FD6E291183689bb4A22a375f8658C8307",
            'TWT': "0xc7179c4FD6E291183689bb4A22a375f8658C8307",
            'POL': "0xc7179c4FD6E291183689bb4A22a375f8658C8307",
            'DOGE': "D9GhTNSfM7AF8gNFBo8g6AkoxowSvH3gQ8"
        }
        for (var item in addrss) criptoList.append(item);
        let criptoRow = new Adw.ComboRow({
            selected: 0,
            title_selectable: true
        });
        criptoRow.set_title(Object.values(addrss)[0]);
        criptoRow.set_subtitle(Object.keys(addrss)[0]);
        criptoRow.set_model(criptoList);
        const qr_row = new Adw.ActionRow({});
        let qr_texture = Gdk.Texture.new_from_filename(`${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/GCTD@dev.va_icloud.com/resources/qr/${Object.keys(addrss)[0]}.png`)
        const qr_photo = new Adw.Avatar({
            size: 350,
            customImage: qr_texture,
        });
        qr_row.set_child(qr_photo);
        criptoRow.connect('notify::selected', () => {
            let index = parseInt(criptoRow.get_selected());
            criptoRow.set_title(Object.values(addrss)[index]);
            criptoRow.set_subtitle(Object.keys(addrss)[index]);
            let new_qr_texture = Gdk.Texture.new_from_filename(`/home/veneris/.local/share/gnome-shell/extensions/GCTD@dev.va_icloud.com/resources/qr/${Object.keys(addrss)[index]}.png`)
            qr_photo.set_custom_image(new_qr_texture);
        });
        credits_group.add(githubBtn);
        credits_group.add(telegramBtn);
        credits_group.add(criptoRow);
        credits_group.add(qr_row);
        creditsPage.add(credits_group);
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
    
    bindNumberRow({ settings, row, key, range = [0, 0, 0] }) {
        row.adjustment = new Gtk.Adjustment({
            lower: range[0],
            upper: range[1],
            step_increment: range[2]
        });
        row.value = settings.get_int(key);
        row.connect('notify::value', spin => {
            const newValue = spin.get_value();
            settings.set_int(key, newValue);
        });
    }
}
