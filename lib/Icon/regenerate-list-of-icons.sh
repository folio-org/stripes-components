(
    echo '<ul>'
    ( cd icons; ls *.svg) |
	sed 's/\.svg$//' |
	while read name; do
	    echo "<li><img src=\"icons/$name.svg\" width=\"32\" height=\"32\" alt=\"$name\" /> $name</li>"
	done
    echo '</ul>'
) > list-of-icons.html
