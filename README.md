Orchestre
=========

Orchestre is a streaming plateform which focus on being able to play flac files in the browser.


# Installation

* Clone it.
* Change directory: cd Orchestre.
* Install dependencies: `npm install`.
* Start the server: `npm start` or `node server.js`.
* You can now sign in with user `test` and password `test`.

I recommend using a tool like *forever* to run the server.


# Requirements

* Node.Js
* MongoDB


# Configuration

Some parameters are available in *config.json*. To change the password, use `node hashPass.js myNewPassword` to generate the hash and modified it in the configuration file.

Do not forget to change `musicPath`.


# License

Copyright (C) 2013-2015 Victor Voisin

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
