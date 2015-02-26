define([
  'jquery',
  'backbone',
  'hogan',
  'noUiSlider',
  'text!templates/player.html'
], function($, Backbone, Hogan, NoUiSlider, PlayerTemplate) {

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
      'click .playButton': 'playPause',
      'click .nextButton': 'nextSong',
      'click .randButton': 'randUpdate',
      'click .loopButton': 'loopUpdate',
      'slide #slider': 'changeVolume'
    },

    changeVolume: function() {
      this.volume = $('#slider').val();
      $('.volume').html(parseInt(this.volume));
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
        $('.randButton').removeClass('active');
      } else {
        this.rand = true;
        $('.randButton').addClass('active');
      }
    },

    loopUpdate: function() {
      if(this.loop) {
        this.loop = false;
        $('.loopButton').removeClass('active');
      } else {
        this.loop = true;
        $('.loopButton').addClass('active');
      }
    },

    playPause: function() {
      if(this.player) {
        if(this.pause) {
        //Resume music
        this.player.play();
        this.pause = false;
        $('.playButton').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
      } else {
        //Pause music
        this.player.pause();
        this.pause = true;
        $('.playButton').children('span').removeClass('glyphicon-pause').addClass('glyphicon-play');
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

      $('.playButton').children('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
    },

    playNewSong: function() {
      var duration;

      //Stop other song before playing
      if(this.player) {
        this.player.stop();
        console.log('STOP PLAYING');

        $('.playButton').children('span').removeClass('glyphicon-pause').addClass('glyphicon-play');
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
        $('.duration').html(self.convertMs(dr));
      });

       this.player.on('progress', function(ct) {
        $('.currentTime').html(self.convertMs(ct));
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
      var seconds = Math.floor(ms / 1000) % 60;
      var minutes = Math.floor(ms / 60000);
      return minutes + ':' + seconds;
    },

    render: function () {
      this.$el.html(Hogan.compile(PlayerTemplate).render({}));

      $('#slider', this.$el).noUiSlider({
        start: 80,
        step: 1,
        connect: 'lower',
        range: {
          'min': [ 0 ],
          'max': [ 100 ]
        }
      });
      //TODO: Improve player to get volume settings.
      $('.volume', this.$el).html('80');

      return this;
    }
  });

});
