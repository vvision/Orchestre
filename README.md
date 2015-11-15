Orchestre
=========

Orchestre is a streaming plateform which focus on being able to play flac files in the browser.


# Installation

* Clone it.
* Change directory: cd Orchestre.
* Install Gulp globally : `npm install --global gulp`
* Install dependencies: `npm install`.
* Configure Orchestre: `cp config.json.example config.json`.
* Edit configuration.
* Start the server: `npm start` or `node orchestre.js`.
* You can now sign in with user `test` and password `test`.

I recommend using a tool like *forever* to run the server.


# Requirements

* Node.Js
* MongoDB
* (Gulp)


# Configuration

Basic configuration is available in *config.json.example*.

Do not forget to change `musicPath`.

To add first admin, use `node createAdmin.js` which will populate db with your inputs.

## Flac files and Seeking

Flac.js uses seektables to perform a seek.
As this is not an accurate way of seeking, it will jump to the closer seek point rather than calculating the right point to continue playing the song.

Indeed, if the file has a seektable which seek points every seconds, seeking will work well.
So if seeking fail, you should add a proper seektable with metaflac:
``
metaflac --add-seekpoint=1s *.flac
``

# License

Copyright (C) 2013-2015 Victor Voisin

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
