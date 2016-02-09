define([
  'jquery',
  'backbone'
], function($, Backbone) {

  var Player = Backbone.Model.extend({
    defaults: {
      playing: null,
      pause: true,
      loop: false,
      rand: false,
      mute: false,
      volume: 80,
      playlist: null,
      aurora: null
    },

    play: function() {
      this.get('aurora').play();
      this.set({pause: false});
    },

    pause: function() {
      this.get('aurora').pause();
      this.set({pause: true});
    },

    stop: function() {
      var player = this.get('aurora');
      if(player) {
        player.stop();
        console.log('STOP PLAYING');
      }
    },

    getNextSong: function(song) {
      var index = this.get('playlist').indexOf(song);
      return this.get('playlist').at(index + 1);
    },

    getPreviousSong: function(song) {
      var index = this.get('playlist').indexOf(song);
      if(index < 0) {
        return null;
      } else {
        return this.get('playlist').at(index - 1);
      }
    },

    jumpToFirstSong: function() {
      this.stop();
      this.set({playing: this.get('playlist').at(0)});
    },

    jumpToPreviousSong: function() {
      this.stop();
      this.set({playing: this.getPreviousSong(this.get('playing'))});
    },

    jumpToNextSong: function() {
      this.stop();
      this.set({playing: this.getNextSong(this.get('playing'))});
    },

    changeVolume: function(volume) {
      this.set({volume: volume});
      //TODO: If nothing playing this.player does not exists :/.
      this.get('aurora').volume = volume;
    },

    toggleRand: function() {
      var newRand = !this.get('rand');
      this.set({rand: newRand});
      return newRand;
    },

    toggleLoop: function() {
      var newLoop = !this.get('loop');
      this.set({loop: newLoop});
      return newLoop;
    },

    toggleMute: function() {
      var newMute = !this.get('mute');
      this.set({mute: newMute});

      this.get('aurora').volume = newMute ? 0 : this.get('volume');

      return newMute;
    }


  });



  return Player;

});
