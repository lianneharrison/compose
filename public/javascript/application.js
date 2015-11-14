$(document).ready(function() {

  $('#player').each(function(){
    var songId = $(this).data('song-id')
    var songName = $(this).data('song-name');
    var songArtist = $(this).data('song-artist')
    var songTag = $(this).data('song-tag')
    var preTagArr = songTag.split(',');
    var tagArr = [];

    // to add in pre-populated hashtags if no lyrics available
    function indexInsta(tag){
         var data =["music","lovemusic","happy"]
         for(var i = 0; i < data.length; i ++) {
           var word = data[i];
       $.ajax({
         url: "https://api.instagram.com/v1/tags/"+word+"/media/recent?client_id=6b57da6cc49c4e2ca5af262214decb93",
         method: "GET",
         dataType: 'jsonp',
         timeout: 5000
       }).fail(function(xhr, ajaxOptions, thrownError){
           alert("Sorry, looks like something has gone wrong "+thrownError)
         }).success((function(num){
             return(
             function(data){
               arr = data.data;
               for(var j = 0; j < arr.length; j++) {
                 var img = arr[j];
                 var url = img.images.low_resolution.url;
                 $(".player-floated-img").eq(num).append($("<img src='"+url+"'></img>"));
               }
             })
           })(i)
         )
       }
      }

    for (var i = 0; i < preTagArr.length; i ++) {
      tagArr.push(preTagArr[i].trim());
    }

    if (songTag.length > 0) {
      getInsta(tagArr)
      getLyrics()
    } else {
      getLyrics()
    }

    // addd play button to player screen
    $("#play-btn").toggleClass("active");

    // hides certain parts of the navbar depending on page
    $(".navbar li.homepage-nav").toggleClass("active");
    $(".navbar li.player-page-nav").toggleClass("active");

    $("#play-btn").on("mouseenter", function() {
      $("#spotify-player").addClass("active");
      $("#play-btn").removeClass("active");
    })

    $("#spotify-player").on("mouseout", function() {
      $("#play-btn").addClass("active");
      $("#spotify-player").removeClass("active");
    })

  $('<iframe src="https://embed.spotify.com/?uri=spotify:track:'+songId+'" width="300" height="80" frameborder="0" allowtransparency="true" id="spotify"></iframe>').appendTo("#spotify-player");
        //Make ajax call for musixmatch song id number
  function getLyrics(){
    songArtist = songArtist.replace(/'/g, '')
    songName = songName.replace(/'/g, '')
    $.ajax({
      url:"http://developer.echonest.com/api/v4/song/search?api_key=FZBHWASTWJKMBT0CU&artist="+songArtist+"&title="+songName+"&results=11&bucket=tracks&bucket=id:musixmatch-WW&limit=true",
      method: 'get',
      dataType: 'json',
      timeout: 5000
      }).fail(function(xhr, ajaxOptions, thrownError){
        alert("Sorry, looks like something has gone wrong "+thrownError)
      }).success(function(html){
        var data = (html);
        if (data.response.songs.length === 0 ) {
          alert("Oh, did you make up that song? We can't find those lyrics but enjoy our handpicked images to compliment your song!")
          indexInsta("lovemusic");
        }
        var musixmatchId = data.response.songs[0].foreign_ids[0].foreign_id;
        console.log(musixmatchId)
        id = musixmatchId.split("song:")
        id = parseInt(id[1])
        console.log(id)
        // Start Lyrics
        $.ajax({
          url: "http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=c1652e120f3e1c24a918c09c65b219a9&track&track_id="+id+"&format=jsonp",
          method: 'get',
          dataType: 'jsonp',
          timeout: 5000
        }).fail(function(xhr, ajaxOptions, thrownError){
        alert("Sorry, looks like something has gone wrong "+thrownError)
      }).success(function(html){
          console.log(html)
          var data = (html);
          var lyrics = data.message.body.lyrics.lyrics_body;
          console.log(lyrics)
          $.ajax({
            url: "/stopwords",
            method: 'post',
            dataType: 'json',
            data: {lyrics:lyrics}
          }).success(getInsta)


      setInterval(getInsta,40000);
      }) // End Lyrics
    })
  }// End for getLyrics function
  var stopwords
    function getInsta(data){
    //$(".player-floated-img").empty();  
    stopwords = stopwords || data
    data = data || stopwords
    //$(".player-floated-img").empty();
    for(var i = 0; i < data.length; i ++) {
      var word = data[i];
      data[i] = data[i].replace(/'/g, '')
      $.ajax({
        url: "https://api.instagram.com/v1/tags/"+data[i]+"/media/recent?client_id=6b57da6cc49c4e2ca5af262214decb93",
        method: "GET",
        dataType: 'jsonp',
        timeout: 5000
      }).fail(function(xhr, ajaxOptions, thrownError){
        alert("Sorry, looks like something has gone wrong "+thrownError)
      }).success((function(num){
          return(
          function(data){
            arr = data.data;
            for(var j = 0; j < arr.length; j++) {
              var img = arr[j];
              var url = img.images.low_resolution.url;
              $(".player-floated-img").eq(num).append($("<img src='"+url+"'></img>"));
            }
          })
        })(i)
      )
    }
  } // End for getInsta function
  //getLyrics()
})

  $('.background-wrapper').each(function(){

    //$(".floated-img").empty();

    function indexInsta(tag){
    $.ajax({
      url: "https://api.instagram.com/v1/tags/"+tag+"/media/recent?client_id=6b57da6cc49c4e2ca5af262214decb93",
      method: "GET",
      dataType: 'jsonp',
      timeout: 5000
    }).fail(function(xhr, ajaxOptions, thrownError){
        alert("Sorry, looks like something has gone wrong "+thrownError)
      }).success(function(data){
      arr = data.data;
      for(var i = 0; i< arr.length; i ++) {
        var img = arr[i];
        var url = img.images.low_resolution.url;
        $("<div class='floated-img'><img src='"+url+"'></img></div>").appendTo(".background");
      }
    })
  }
  indexInsta("lovemusic");
  indexInsta("lovemusic");
  setInterval(function(){indexInsta("lovemusic")},11000);

  $('#player').each(function(){
    var songId = $(this).attr('songId');
  })

  // $(window).on("click", function() {
  //   $("#search-results").removeClass("active");
  //   $(".landing-page").removeClass("active");
  //   $(".landing-page #homepage-heading").show();
  // })

  $('#add-hashtag').on("click", function() {
    $('#hashtag-input').toggleClass('active');
    $('#add-hashtag').hide();
    $('#add-more-hashtags').hide();
  })

  $('button').click(function(e) {
    e.preventDefault()
    e.stopPropagation()
    $('#songs').empty();
    $('#artist').empty();
    $('#search-results').addClass('active');
    $('.landing-page').addClass('active');
    $('.landing-page #homepage-heading').hide();
    var searchQuery = $('#search-input').val();

     $.ajax({
      url: "https://api.spotify.com/v1/search?q="+searchQuery+"&type=artist,track,album&limit=4",
       method:'get',
       dataType: 'json',
       error: function (xhr, ajaxOptions, thrownError) {
        $('#search-results p').empty();
        // error = thrownError
        $("<p style='font-family:NeutraThin'>Oops, this is awkward, something's gone awry.</p>").appendTo("#songs");
        },
       success: function(html){
        var data = (html)
        if (data.tracks.items.length === 0){
          $('#search-results p').empty();
          $("<p style='font-family:NeutraThin'>Sorry, we could not find any results for '"+searchQuery+"'. Either we broke something, or you can't type. Please try searching again.</p>").appendTo("#songs");
        }
        var albums = (data.albums.items)
        for(var i = 0; i < albums.length; i++) {
          var album = albums[i];
          var albumID = album.id
          var albumName = album.name
        }
        var artists = (data.artists.items)
        for(var i = 0; i < artists.length; i++) {
          var artist = artists[i];
          var artistId = artist.id;
          var artistName = artist.name;
          // $("<li>"+artistName+"</li>").appendTo("#artist");
        }
        var songs = (data.tracks.items)
        for(var i = 0; i < songs.length; i++ ) { //Beginning song
          var song = songs[i];
          var songId = song.id;
          var songName = song.name;
          var songArtist = song.artists[0].name;

// songs are appended to the drop down list
        $('#songs').append(
          $('<li/>')
            .attr('id', songId)
            .attr('songname', songName)
            .attr('songartist', songArtist)
            .append(
              $('<span class="bold"/><br>')
                .text(songName))
            .append(
              $('<span/>')
                .text(songArtist)));

// when song is click, goes to player page
        $("#"+songId).click(function(e){
          e.preventDefault
          var songId = ($(this).attr('id'));
          var songName = encodeURIComponent($(this).attr('songName'));
          var songArtist = encodeURIComponent($(this).attr('songArtist'));
          //var songTag = encodeURIComponent($(this).attr('songTag'));
          var songTag = $('#hashtag-input').val();

          window.location="/player?songId="+songId+"&songName="+songName+"&songArtist="+songArtist+"&songTag="+songTag;

         }) //End of for loop from song results
        }
        }
      })
    })
  })
})
