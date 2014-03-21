http://powerhack.herokuapp.com/

Firebase:	https://powerhack.firebaseio.com/
Dropbox:	https://www.dropbox.com/sh/f7ss68kk66we7l3/OxkZxOE7UV
Heroku: 	https://dashboard.heroku.com/apps/powerhack/resources


======= SETUP =======

git clone https://github.com/BeachHunk3000/power.git

cd power

sudo npm install

bower install

grunt serve



======= DEPLOY TO WEBSITE: http://powerhack.herokuapp.com/ =======

Gå til root folder (powerhack)

kjør "grunt build"

kjør "cd dist"

kjør "git add ."

kjør "git commit -m "Beskriv hva du endret eller la til" "

kjør "git push git@heroku.com:powerhack.git master"

Gå til http://powerhack.herokuapp.com/ og se om websiden oppdaterte seg.