// For Slick

$('.responsive').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 4,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 6,
                slidesToScroll: 6,
                infinite: true,
                dots: false
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        }
    ]
});


// Instantiate the Bloodhound suggestion engine
var searches = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
        url: 'https://plusbox.tv/channels.php',
        filter: function (searches) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(searches.channels, function (channel) {
                return {
                    value: channel.name,
                    icon: channel.icon,
                    data_name: channel.data_name,
                    data_source: channel.data_source,
                };
            });
        }
    },
    limit: 10
});

// Initialize the Bloodhound suggestion engine
searches.initialize();

// Instantiate the Typeahead UI
$('#scrollable-dropdown-menu .typeahead').typeahead(null, {
    displayKey: 'value',
    source: searches.ttAdapter(),
    templates: {
        suggestion: function(item){
            console.log('https://backend.plusbox.tv/' + item.data_name.trim() + '/embed.html?token=')
            return (
                '<div class="search-result"><a onclick="startChannel(this)" class="playignitor thumbnail d-flex align-items-center" href="#'+item.data_name+'" data-source="https://backend.plusbox.tv/' + item.data_name.trim() + '/embed.html?token="  data-name="' + item.data_name.trim() + '"><img class="search-result-icon" alt="" class="rounded-lg" src="' + item.icon + '"><h5>'+item.data_name+'</h5></a></div>'
            )
        }
    }
});

//Script from previous plusbox
$(document).ready(function(){
    $('#playerholder').height($('#playerholder').width() * (9/16));
    $('#contact-list').height($('#playerholder').height() - 51);

    $("#player").on('load', function () {
        $('iframe').contents().find('body').css({'width': '100%', 'height': '100%', 'margin': '0'});
        $('iframe').contents().find('img').css({'width': '100%', 'height': '100%'});
    })

    $('iframe').contents().find('body').css({'width': '100%', 'height': '100%', 'margin': '0'});
    $('iframe').contents().find('img').css({'width': '100%', 'height': '100%'});
});

function startChannel(el) {
    var searchInput = document.getElementById('search-input')
    searchInput.blur()
    var player=$(el);

    $.ajax({
        type: "POST",
        url: 'token.php',
        data: {ch_name: player.data("name")},
        success: function(data){
            $("#player").attr("src", player.data("source")+data);
            $(".playicon").css("visibility", "hidden");
            player.find(".playicon").css("visibility", "visible");
            searchInput.value = ""
        }
    });

}
