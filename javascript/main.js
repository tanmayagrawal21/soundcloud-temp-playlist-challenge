// API key: cd9be64eeb32d1741c17cb39e41d254d


// Search SoundCloud
query= document.querySelector('.input-search');
query.addEventListener('keyup',function(e){
    if(e.which==13){
        console.log(query.value);
        SoundCloudAPI.getTracks(query.value);
    }
});

searchButton= document.querySelector('.js-submit');

searchButton.addEventListener('click',function(){
    console.log(query.value);
    SoundCloudAPI.getTracks(query.value);
});


// Query API
var SoundCloudAPI={};
SoundCloudAPI.init= function(){
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
      });
    }


SoundCloudAPI.init();


SoundCloudAPI.getTracks= function(query){
    var page_size = 100;
      
    SC.get('/tracks', {
       q: query, limit: page_size, linked_partitioning: 1
      }).then(function(tracks) {
        // page through results, 100 at a time
        console.log(tracks);
        display(tracks);
    });
}

SoundCloudAPI.renderTracks=function(track){
    var card= document.createElement('div');
    card.classList.add("card");

    var imageDiv= document.createElement("div");
    imageDiv.classList.add("image");

    var image= document.createElement('img');
    image.classList.add("image_img");
    image.src= track.artwork_url;
    imageDiv.appendChild(image);
    card.appendChild(imageDiv);

    var content=document.createElement('div');
    content.classList.add("content");

    var header= document.createElement('div');
        header.classList.add("header");
        var link= document.createElement('a');
        link.href=track.permalink_url;
        link.target="_blank";
        link.innerHTML=track.title;
        header.appendChild(link);
    content.appendChild(header);
    card.appendChild(content);

    
    var playlistButton=  document.createElement("div");
    playlistButton.classList.add("ui");
    playlistButton.classList.add("bottom");
    playlistButton.classList.add("attached");
    playlistButton.classList.add("button");
    playlistButton.classList.add("js-button");
        var i= document.createElement('i');
        i.classList.add("add");
        i.classList.add("icon");
        playlistButton.appendChild(i);
    playlistButton.innerHTML+="<span>Add to playlist</span>";
    card.appendChild(playlistButton);

    document.querySelector('.js-search-results').appendChild(card);

    playlistButton.addEventListener('click', function(){
        SC.oEmbed(track.permalink_url, {
            auto_play: true
          }).then(function(embed){
            var sidebar= document.querySelector(".inner");
            var box= document.createElement('div');
            box.innerHTML=embed.html;

            var img= document.createElement('img');
            img.src="close_icon.png";
            box.insertBefore(img, box.firstChild);
            sidebar.insertBefore(box,sidebar.firstChild);

            img.addEventListener('click',function(){
                sidebar.removeChild(box);
            })



            localStorage.setItem("key", sidebar.innerHTML);
            console.log('oEmbed response: ', embed);
          });
    })
}



// Display Cards
/*
<div class="card">
        <div class="image">
            <img class="image_img" src=${track.artwork_url}>
        </div>
        <div class="content">
            <div class="header">
            <a href=${track.permalink_url} target="_blank">${track.title}</a>
            </div>
        </div>
        <div class="ui bottom attached button js-button">
            <i class="add icon"></i>
            <span>Add to playlist</span>
        </div>
    </div>
*/
function display(tracks){
    document.querySelector('.js-search-results').innerHTML='';
    numTracks= tracks.collection.length;
    var i=0;
    for(i=0; i<numTracks; i++){
        SoundCloudAPI.renderTracks(tracks.collection[i]);
    }
}

// Add to playlist and play