define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/player.html'
], function($, Backbone, Hogan, PlayerTemplate) {

  return Backbone.View.extend({
    initialize: function(options) {
      this.playlist = options.playlist;
      this.nowPlaying = options.nowPlaying;
      console.log('flac');
      console.log(this.playlist);
      this.player;
      this.pause = false;
      this.loop = false;
      this.rand = false;
      this.volume = 80;

      this.listenTo(this.nowPlaying, 'add', this.playNewSong);
    },

    events: {
      'click .player-controls-play': 'playPause',
      'click .player-controls-next': 'nextSong',
      'click .player-controls-random': 'randUpdate',
      'click .player-controls-loop': 'loopUpdate',
      'click .player-controls-mute': 'muteUpdate',
      'click .player-progress-played': 'seekTime',
      'change .player-volume': 'changeVolume'
    },

    seekTime: function(event) {
      if(this.player.format.formatID === 'flac') {
        console.error('Seek not implemented for flac files!');
      } else {
        var size = event.currentTarget.clientWidth;
        //Position between 0 and 1.
        var pos = this.getClickPosition(event).x / size;
        var newTime = pos * this.player.duration;
        this.player.seek(parseInt(newTime));
      }
    },
    // Get click position relative to parent
    // http://www.kirupa.com/html5/getting_mouse_click_position.htm
    getClickPosition: function(event) {
      var parentPosition = this.getPosition(event.currentTarget);
      return {
        x: event.clientX - parentPosition.x,
        y: event.clientY - parentPosition.y
      };
    },
    // Get element position
    getPosition: function(element) {
      var xPosition = 0;
      var yPosition = 0;
      while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
      }
      return {
        x: xPosition,
        y: yPosition
      };
    },

    changeVolume: function(element) {
      this.volume = element.currentTarget.valueAsNumber;
      //TODO: If nothing playing this.player does not exists :/.
      this.player.volume = this.volume;
    },

    nextSong: function() {
      if(this.player) {
        this.player.stop();
        console.log('STOP PLAYING');
        if(this.nowPlaying.length !== 0) {
          this.nowPlaying.shift();
          this.playNewSong();
        } else {
          this.playlist.shift();
          this.playNewSong();
        }
      }
    },

    randUpdate: function() {
      if(this.rand) {
        this.rand = false;
        $('.player-controls-random').removeClass('active');
      } else {
        this.rand = true;
        $('.player-controls-random').addClass('active');
      }
    },

    loopUpdate: function() {
      if(this.loop) {
        this.loop = false;
        $('.player-controls-loop').removeClass('active');
      } else {
        this.loop = true;
        $('.player-controls-loop').addClass('active');
      }
    },

    muteUpdate: function() {
      if(this.player.volume !== 0) {
        this.player.volume = 0;
        $('.player-controls-mute').children('span').removeClass('glyphicon-volume-down').addClass('glyphicon-volume-off');
      } else {
        this.player.volume = this.volume;
        $('.player-controls-mute').children('span').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-down');
      }
    },

    playPause: function() {
      if(this.player) {
        if(this.pause) {
        //Resume music
        this.player.play();
        this.pause = false;
        $('.player-controls-play').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
      } else {
        //Pause music
        this.player.pause();
        this.pause = true;
        $('.player-controls-play').children('span').removeClass('glyphicon-pause').addClass('glyphicon-play');
      }
      } else {
        //No songs playing: first click.
        this.playNewSong();
      }
    },

    initNewPlayer: function(song) {
      var uri = '/songs/' + song.get('_id') + '/stream';
      console.log(uri);
      this.nowPlayingDisplay(song);
      this.player = AV.Player.fromURL(uri);
      this.player.volume = this.volume;
      this.player.play();

      $('.player-controls-play').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
    },

    playNewSong: function() {
      var duration;

      //Stop other song before playing
      if(this.player) {
        this.player.stop();
        console.log('STOP PLAYING');

        $('.player-controls-play').children('span').removeClass('glyphicon-pause').addClass('glyphicon-play');
      }


      if(this.nowPlaying.length !== 0) {
        console.log('PLAY NEW SONG');
        //var song = this.nowPlaying.shift();
        var song = this.nowPlaying.first();
        console.log(song);
        this.initNewPlayer(song);
      } else {
        if(this.playlist.length !== 0) {
          console.log('PLAY SONG FROM PLAYLIST');
          var song = this.playlist.first();
          console.log(song);
          this.initNewPlayer(song);
        }
      }

      //Player Events
      var self = this;

      this.player.on('duration', function(dr) {
        console.log(dr);
        duration = dr;
        //$('.player-duration').html(self.convertMs(dr));
        $('.player-progress-played')[0].max = dr;
      });

      this.player.on('progress', function(ct) {
        $('.player-duration').html(self.convertMs(ct));
        $('.player-progress-played')[0].value = ct;
        $('.player-progress-played')[0].firstElementChild.innerHTML = ct;
      });

      this.player.on('buffer', function(buffered) {
        $('.player-progress-buffer')[0].value = buffered;
        $('.player-progress-buffer')[0].firstElementChild.innerHTML = buffered;
      });

      this.player.on('end', function() {
        console.log('END OF SONG!');
        if(self.loop) {
          if(self.nowPlaying.length !== 0) {
            //Play Next Song if any
            self.playNewSong();
          } else {
            //Play Next Song if any
            self.playNewSong();
          }
        } else {
          if(self.nowPlaying.length !== 0) {
            self.nowPlaying.reset();
            //Play Next Song if any
            self.playNewSong();
          } else {
            self.playlist.shift();
            //Play Next Song if any
            self.playNewSong();
          }
        }
      });

      this.player.on('error', function(err) {
        console.log(err);
      });

    },

    nowPlayingDisplay: function(song) {
      $('.nowPlaying').empty();
      $('.nowPlaying.title').append(song.attributes.title);
      $('.nowPlaying.artist').append(song.attributes.artist);
      $('.nowPlaying.album').append(song.attributes.album);
      $('.nowPlaying.genre').append(song.attributes.genre);
      $('.nowPlaying.rate').append(song.attributes.rate);
    },

    //Converts milliseconds into a string like mm:ss.
    convertMs: function(ms) {
      var currentTime = ms / 1000;
      var seconds = parseInt(currentTime % 60);
      var minutes = parseInt((currentTime / 60) % 60);

      // Ensure it's two digits. For example, 03 rather than 3.
      seconds = ('0' + seconds).slice(-2);
      minutes = ('0' + minutes).slice(-2);

      return minutes + ':' + seconds;
    },

    render: function () {
      this.$el.html(Hogan.compile(PlayerTemplate).render());

      return this;
    }
  });

});
