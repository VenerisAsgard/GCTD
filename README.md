# GCTD - Game Crosshair To Desktop (Gnome Extension)
"Displays the scope in those games in which it is not available or disabled."

Generate pot: find . -name "*.js" -exec xgettext --from-code=UTF-8 --output=po/GCTD@dev.va_icloud.com.pot {} +

Pack po: gnome-extensions pack --podir=po ...
