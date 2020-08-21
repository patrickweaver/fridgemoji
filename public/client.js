var globalMouseDown = false;

var rightDrawer = false;
var leftDrawer = false;
var bottomDrawer = false;
var trashCan = false;

function getEmojis() {
  if (!globalMouseDown) {
    $.get( "/emojis", function( data ) {
      var d = JSON.parse( data );
      //console.log(d);
      $( "#emoji" ).html("");
      for (var emoji in d) {
        var e = d[emoji];
        addEmoji(e.emojiId, e.top, e.left, e.emoji, true);
      }
    });
  }
  
  setTimeout(function() {
    getEmojis();
  }, globalMouseDown ? 5000 : 5000);
 
}

function addEmoji(emojiId, top, left, emoji, inDB) {
  //console.log(emoji + ": " + top + ", " + left);
  var newElement = '<div id="' + emojiId + '" class="item" style="top: ' + top + 'px; left: ' + left + 'px;">' + emoji + '</div>';
  $( '#emoji' ).append(newElement);
  logEmojiMove(emojiId, top, left)
  if (!inDB) {
    $.get("/new?emojiId=" + emojiId + "&top=" + top + "&left=" + left + "&emoji=" + emoji, function(data) {
      console.log(data);
    });
  }
}

function logEmojiMove(emojiId, top, left) {
  $( "#" + emojiId ).draggable({
    containment: $( "#invisible-fridge" ),
    zIndex: 250,
    start: function(event, ui) {
      globalMouseDown = true;
    },
    stop: function( event, ui ) {
      globalMouseDown = false;
      var fridgePos = $( "#fridge" ).position();
      var top = ui.offset.top - fridgePos.top;
      var left = ui.offset.left - fridgePos.left;
      console.log("TOP: " + top);
      console.log("LEFT: " + left);
      
      if (trashCan & left > 165 & top > 200) {
        
        var dif = 470 - top;
        top = 470;
        var deleteRequestUrl = "/delete?emojiId=" + emojiId;
        $.get(deleteRequestUrl, function( data ) {     
          console.log(data)
        });
        $(event.target).css("z-index", 290);
        $(event.target).animate({
          top: "+=" + dif,
        }, 3 * Math.abs(dif), function() {
          
          $(event.target).hide();
        });
        
        
      } else {
        if (!leftDrawer) {
          if (top > 195 & top < 350 & left < 150) {
            $(event.target).css("z-index", 250);
            var tDif = top - 165;
            var bDif = 370 - top;
            var dif;
            if (top > 230) {
              console.log("DOWN");
              top += bDif;
              dif = -bDif;
              console.log(dif);
            } else {
              top -= tDif;
              dif = tDif;
            }
            $(event.target).animate({
              top: "-=" + dif,
            }, 3 * Math.abs(dif), function() {
              $(event.target).css("z-index", 200);
            });
          }
        }

        if (!rightDrawer) {
          if (top > 195 & top < 350 & left > 150) {
            $(event.target).css("z-index", 250);
            var tDif = top - 165;
            var bDif = 370 - top;
            var dif;
            if (top > 230) {
              console.log("DOWN");
              top += bDif;
              dif = -bDif;
              console.log(dif);
            } else {
              top -= tDif;
              dif = tDif;
            }
            $(event.target).animate({
              top: "-=" + dif,
            }, 3 * Math.abs(dif), function() {
              $(event.target).css("z-index", 200);
            });
          }
        }


        if (!bottomDrawer) {
          if (top > 430) {
            $(event.target).css("z-index", 250);
            var dif = 560 - top;
            top = 560;
            $(event.target).animate({
              top: "+=" + dif,
            }, 5 * Math.abs(dif), function() {
              $(event.target).css("z-index", 200);
            });
          }
        }
        var requestUrl = "/move?emojiId=" + emojiId + "&top=" + top + "&left=" + left;
        $.get(requestUrl, function( data ) {     
          console.log(data)
        });
      }
    }
  });
}

getEmojis();

$( '#right-drawer' ).click(function() {
  $( '#right-drawer .drawer-face-open' ).toggle();
  $( '#right-drawer .drawer-face' ).toggle();
  $( '#right-drawer .drawer-inside' ).toggle();
  $( '#right-drawer .drawer-back-wall' ).toggle();
  $( '#right-drawer .drawer-right-wall' ).toggle();
  $( '#right-drawer .drawer-left-wall' ).toggle();
  $( '#right-drawer .drawer-sight-block' ).toggle();
  $( '#bottom-wall-right' ).toggle();
  rightDrawer = !rightDrawer;
});

$( '#left-drawer' ).click(function() {
  $( '#left-drawer .drawer-face-open' ).toggle();
  $( '#left-drawer .drawer-face' ).toggle();
  $( '#left-drawer .drawer-inside' ).toggle();
  $( '#left-drawer .drawer-back-wall' ).toggle();
  $( '#left-drawer .drawer-right-wall' ).toggle();
  $( '#left-drawer .drawer-left-wall' ).toggle();
  $( '#left-drawer .drawer-sight-block' ).toggle();
  $( '#bottom-wall-left' ).toggle();
  leftDrawer = !leftDrawer
});

$( '#bottom-drawer' ).click(function() {
  $( '#bottom-drawer .drawer-face-open' ).toggle();
  $( '#bottom-drawer .drawer-face' ).toggle();
  $( '#bottom-drawer .drawer-inside' ).toggle();
  $( '#bottom-drawer .drawer-back-wall' ).toggle();
  $( '#bottom-drawer .drawer-right-wall' ).toggle();
  $( '#bottom-drawer .drawer-left-wall' ).toggle();
  bottomDrawer = !bottomDrawer;
});

$( "#food-form" ).submit(function(e) {
  e.preventDefault();
});

$( "#food-input" ).change(function() {
  var e = $(this).val();
  console.log(e);
  $(this).val("");
  if (foodEmoji.indexOf(e) > -1) {
    addEmoji(makeId(), 50, Math.floor(Math.random() * 200) + 50, e, false)
  } else {
    alert("Sorry, food only (and one at a time)!");
  }
});

$( '#trash-button' ).click(function() {
  $( '#trash-can' ).toggle();
  if (trashCan) {
    $( '#away-trash' ).css("display", "none");
    $( '#get-trash' ).css("display", "inline-block");
  } else {
    $( '#away-trash' ).css("display", "inline-block");
    $( '#get-trash' ).css("display", "none");
  }
  trashCan = !trashCan;
});

$( '#help > h3' ).click(function() {
  $( '#help > p').toggle();
});



var foodEmoji = [
"🧦",
"🛍",
"🦎",
"🐟",
"🐠",
"🐡",
"🦈",
"🐙",
"🐚",
"🦀",
"🐌",
"🐛",
"🐜",
"🦗",
"🌱",
"🍇",
"🍈",
"🍉",
"🍊",
"🍋",
"🍌",
"🍍",
"🍎",
"🍏",
"🍐",
"🍑",
"🍒",
"🍓",
"🥝",
"🍅",
"🥥",
"🥑",
"🍆",
"🥔",
"🥕",
"🌽",
"🌶",
"🥒",
"🥦",
"🍄",
"🥜",
"🌰",
"🍞",
"🥐",
"🥖",
"🥨",
"🥞",
"🧀",
"🍖",
"🍗",
"🥩",
"🥓",
"🍔",
"🍟",
"🍕",
"🌭",
"🥪",
"🌮",
"🌯",
"🥙",
"🥚",
"🍳",
"🥘",
"🍲",
"🥣",
"🥗",
"🍿",
"🥫",
"🍱",
"🍘",
"🍙",
"🍚",
"🍛",
"🍜",
"🍝",
"🍠",
"🍢",
"🍣",
"🍤",
"🍥",
"🍡",
"🥟",
"🥠",
"🥡",
"🍦",
"🍧",
"🍨",
"🍩",
"🍪",
"🎂",
"🍰",
"🍫",
"🍬",
"🍭",
"🍮",
"🍯",
"🍼",
"🥛",
"☕",
"🍵",
"🍶",
"🍾",
"🍷",
"🍸",
"🍹",
"🍺",
"🥂",
"🥃",
"🥤",
"🎃",
"🎾",
"🎲",
"💾",
"🥧",
"🥬",
"🥭",
"🥯",
"🧂",
"🥮",
"🦞",
"🧁",
"🧃",
"🦪",
"🧈",
"🧆",
"🧇",
"🧅",
"🧄",
"🧉",
"🧊",
"🫐",
"🫒",
"🫑",
"🫓",
"🫔",
"🫕",
"🫖",
"🧋",
]

function makeId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}