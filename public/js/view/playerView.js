define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'orchestre',
  'text!templates/player.html',
  'text!templates/player-media.html'
], function($, Backbone, _, Handlebars, Orchestre, PlayerTemplate, PlayerMediaTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(PlayerTemplate),

    initialize: function() {
      this.player = Orchestre.getOrchestre().player;
      this.playlist = this.player.get('playlist');
      console.log(this.playlist);
      this.aurora = this.player.get('aurora');

      this.player.on('playNewSong', this.playNewSong, this);

      this.listenTo(this.player, 'change:aurora', this.bindPlayerEvents);
      this.listenTo(this.player, 'change:loop', this.activateLoopButton);
      this.listenTo(this.player, 'change:rand', this.activateRandButton);
      this.listenTo(this.player, 'change:mute', this.activateMuteButton);
      this.listenTo(this.player, 'change:pause', this.activatePlayPauseButton);
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

    bindPlayerEvents: function(player, aurora) {
      var self = this;

      aurora.on('duration', function(dr) {
        console.log(dr);
        $('.player-progress-played')[0].max = dr;
      });

      aurora.on('progress', function(ct) {
        $('.player-duration').html(self.convertMs(ct));
        $('.player-progress-played')[0].value = ct;
        $('.player-progress-played')[0].firstElementChild.innerHTML = ct;
      });

      aurora.on('buffer', function(buffered) {
        $('.player-progress-buffer')[0].value = buffered;
        $('.player-progress-buffer')[0].firstElementChild.innerHTML = buffered;
      });

      aurora.on('end', function() {
        console.log('END OF SONG!');
        if(!self.player.get('loop')) {
          self.cleanTranscode(self.player.get('playing').get('_id'));

          var nextSong = self.player.getNextSong(self.player.get('playing'));
          //Check if there is a song to play next
          if(nextSong) {
            self.player.jumpToNextSong();
            self.playNewSong();
          } else {
            self.player.set({pause: true});
            console.log('END OF PLAYLIST');
          }
        } else {
          self.playNewSong();
        }
      });

      aurora.on('error', function(err) {
        console.log(err);
      });
    },

    seekTime: function(event) {
      var size = event.currentTarget.clientWidth;
      //Position between 0 and 1.
      var pos = this.getClickPosition(event).x / size;
      var newTime = Math.floor(pos * this.aurora.duration);
      console.log(newTime);
      try {
        this.aurora.seek(parseInt(newTime));
      } catch (e) {
        console.error('unable to seek on this song: ' + e.message);
        this.aurora.play();
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
      this.player.changeVolume(element.currentTarget.valueAsNumber);
    },

    previousSong: function() {
      this.player.jumpToPreviousSong();
      this.playNewSong();
    },

    nextSong: function() {
      this.player.jumpToNextSong();
      this.playNewSong();
    },

    randUpdate: function() {
      this.player.toggleRand();
    },

    loopUpdate: function() {
      this.player.toggleLoop();
    },

    muteUpdate: function() {
      this.player.toggleMute();
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
      if(this.player.get('aurora')) {
        if(this.player.get('pause')) {
          //Resume music
          this.player.play();
        } else {
          //Pause music
          this.player.pause();
        }
      } else {
        //No songs playing: first click.
        this.playNewSong();
      }
    },

    playNewSong: function() {
      //Stop other song before playing
      this.player.stop();
      console.log('STOP PLAYING');

      var song = this.player.get('playing');
      if(!song) {
        this.player.jumpToFirstSong();
        song = this.player.get('playing');
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

      var self= this;
      this.checkTranscode(song.get('_id'), function() {
        //First create player
        self.aurora = AV.Player.fromURL(uri);
        self.aurora.volume = self.player.get('volume');
        //Then attach player to Orchestre
        self.player.set({aurora: self.aurora});
        //And play !
        self.player.play();

        self.nowPlayingDisplay(song);
        $('.player-controls-play').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
      });

    },

    checkTranscode: function(id, callback) {
      $.ajax({
        url: '/songs/' + id + '/transcode',
        type: 'GET',
        success: function () {
          callback();
        },
        error: function(err) {
          console.log('error in transcoding ' + err);
        }
      });
    },

    cleanTranscode: function(id) {
      $.ajax({
        url: '/songs/' + id + '/clean',
        type: 'GET',
        success: function () {
          console.log('cleaned');
        },
        error: function(err) {
          console.log('error while cleaning ' + err);
        }
      });
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
