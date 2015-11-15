define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'text!templates/player.html',
  'text!templates/player-media.html'
], function($, Backbone, _, Handlebars, PlayerTemplate, PlayerMediaTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(PlayerTemplate),

    initialize: function(options) {
      this.orchestre = options.orchestre;
      this.playlist = options.orchestre.get('playlist');
      console.log(this.playlist);
      this.player = options.orchestre.get('player');

      options.orchestre.on('playNewSong', this.playNewSong, this);

      this.listenTo(this.orchestre, 'change:player', this.bindPlayerEvents);
      this.listenTo(this.orchestre, 'change:loop', this.activateLoopButton);
      this.listenTo(this.orchestre, 'change:rand', this.activateRandButton);
      this.listenTo(this.orchestre, 'change:mute', this.activateMuteButton);
      this.listenTo(this.orchestre, 'change:pause', this.activatePlayPauseButton);
    },

    events: {
      'click .player-controls-previous': 'previousSong',
      'click .player-controls-play': 'playPause',
      'click .player-controls-next': 'nextSong',
      'click .player-controls-random': 'randUpdate',
      'click .player-controls-loop': 'loopUpdate',
      'click .player-controls-mute': 'muteUpdate',
      'click .player-progress-played': 'seekTime',
      'change .player-volume': 'changeVolume'
    },

    bindPlayerEvents: function(orchestre, player) {
      var self = this;

      player.on('duration', function(dr) {
        console.log(dr);
        $('.player-progress-played')[0].max = dr;
      });

      player.on('progress', function(ct) {
        $('.player-duration').html(self.convertMs(ct));
        $('.player-progress-played')[0].value = ct;
        $('.player-progress-played')[0].firstElementChild.innerHTML = ct;
      });

      player.on('buffer', function(buffered) {
        $('.player-progress-buffer')[0].value = buffered;
        $('.player-progress-buffer')[0].firstElementChild.innerHTML = buffered;
      });

      player.on('end', function() {
        console.log('END OF SONG!');
        if(!self.orchestre.get('loop')) {
          var nextSong = self.orchestre.getNextSong(self.orchestre.get('playing'));
          //Check if there is a song to play next
          if(nextSong) {
            self.orchestre.jumpToNextSong();
            self.playNewSong();
          } else {
            self.orchestre.set({pause: true});
            console.log('END OF PLAYLIST');
          }
        } else {
          self.playNewSong();
        }
      });

      player.on('error', function(err) {
        console.log(err);
      });
    },

    seekTime: function(event) {
      var size = event.currentTarget.clientWidth;
      //Position between 0 and 1.
      var pos = this.getClickPosition(event).x / size;
      var newTime = Math.floor(pos * this.player.duration);
      console.log(newTime);
      try {
        this.player.seek(parseInt(newTime));
      } catch (e) {
        console.error('unable to seek on this song: ' + e.message);
        this.player.play();
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
      this.orchestre.changeVolume(element.currentTarget.valueAsNumber);
    },

    previousSong: function() {
      this.orchestre.jumpToPreviousSong();
      this.playNewSong();
    },

    nextSong: function() {
      this.orchestre.jumpToNextSong();
      this.playNewSong();
    },

    randUpdate: function() {
      this.orchestre.toggleRand();
    },

    loopUpdate: function() {
      this.orchestre.toggleLoop();
    },

    muteUpdate: function() {
      this.orchestre.toggleMute();
    },

    activateRandButton: function(orchestre, rand) {
      console.log('RAND STATE CHANGED');
      if(rand) {
        $('.player-controls-random').addClass('active');
      } else {
        $('.player-controls-random').removeClass('active');
      }
    },

    activateLoopButton: function(orchestre, loop) {
      console.log('LOOP STATE CHANGED');
      if(loop) {
        $('.player-controls-loop').addClass('active');
      } else {
        $('.player-controls-loop').removeClass('active');
      }
    },

    activateMuteButton: function(orchestre, mute) {
      console.log('MUTE STATE CHANGED');
      if(mute) {
        $('.player-controls-mute').children('span').removeClass('glyphicon-volume-down').addClass('glyphicon-volume-off');
      } else {
        $('.player-controls-mute').children('span').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-down');
      }
    },

    activatePlayPauseButton: function(orchestre, pause) {
      if(pause) {
        $('.player-controls-play').children('span').removeClass('glyphicon-pause').addClass('glyphicon-play');
      } else {
        $('.player-controls-play').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
      }
    },

    playPause: function() {
      if(this.orchestre.get('player')) {
        if(this.orchestre.get('pause')) {
          //Resume music
          this.orchestre.play();
        } else {
          //Pause music
          this.orchestre.pause();
        }
      } else {
        //No songs playing: first click.
        this.playNewSong();
      }
    },

    playNewSong: function() {
      //Stop other song before playing
      this.orchestre.stop();
      console.log('STOP PLAYING');

      var song = this.orchestre.get('playing');
      if(!song) {
        this.orchestre.jumpToFirstSong();
        song = this.orchestre.get('playing');
      }

      if(song) {
        $('.queue-song').removeClass('active');
        console.log(song);
        this.initNewPlayer(song);
        var selector = '.queue-song.' + song.get('_id');
        $(selector).addClass('active');
      }
    },

    initNewPlayer: function(song) {
      var uri = '/songs/' + song.get('_id') + '/stream';
      console.log(uri);

      //First create player
      this.player = AV.Player.fromURL(uri);
      this.player.volume = this.orchestre.get('volume');
      //Then attach player to Orchestre
      this.orchestre.set({player: this.player});
      //And play !
      this.orchestre.play();

      this.nowPlayingDisplay(song);
      $('.player-controls-play').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
    },

    nowPlayingDisplay: function(song) {
      $('.player-media-data', this.$el).html(Handlebars.compile(PlayerMediaTemplate)({
        title: song.get('title'),
        artist: song.get('artist'),
        album: song.get('album'),
        genre: song.get('.genre'),
        rate: song.get('rate'),
        albumId: song.get('albumId')
      }));
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
      this.$el.html(this.template());
      $('.player-media-data', this.$el).html(Handlebars.compile(PlayerMediaTemplate)({
        title: 'Title',
        artist: 'Artist',
        album: 'Album',
        genre: 'Genre',
        rate: 5,
        albumId: ''
      }));

      return this;
    }
  });

});
