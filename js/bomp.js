$(function(){
  
  var DOM = {
    dancers: $('#dancers'),
    dancerLeft: $('.dancer.left'),
    dancerRight: $('.dancer.right'),
  };
  
  var classes = {
    marquee: 'marquee',
    bendArms: 'bend-arms',
    bendLegs: 'bend-legs',
    sideKick: 'side-kick',
    bopHead: 'bop-head'
  }
  
  var playSound, dataArray, bufferLength, count;
  var midiBuffer = null;
  var audioURL = 'audio/aha.mp3';
  var audioTime = 0;
  var audioOffset = 0;
  var audioPlaying = false;
  var currentMoves = '';
  
  /* hot dance moves */
  
  var marquee = function(){
    DOM.dancers.toggleClass(classes.marquee);
  };
  
  var bopHead = function(){
    DOM.dancers.toggleClass(classes.bopHead);
  }
    
  var bendArms = function(){
    DOM.dancers.toggleClass(classes.bendArms);
  };
  
  var bendLegs = function(){
    // make sure legs are stationary first
    DOM.dancers.removeClass(classes.sideKick).toggleClass(classes.bendLegs);
  };
  
  var stopDancing = function(){
    // remove all classes
    DOM.dancers.attr('class', null);
  };
  
  
  
  /* web audio fun */
  
  var loadAudio = function(url) {
    var request = new XMLHttpRequest();
    request.open('GET', audioURL, true);
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      audioCtx.decodeAudioData(request.response, function(buffer) {
        midiBuffer = buffer;
      });
      
      // debug - load audio
      console.log('audio loaded');
    }
    request.send();
  };

  
  var playSong = function(){
    audioTime = audioCtx.currentTime;
    playSound = audioCtx.createBufferSource();
    playSound.buffer = midiBuffer;
    playSound.connect(audioCtx.destination);
    playSound.start(0, audioOffset);
    
    playSound.connect(analyser);
    
    DOM.dancers.attr('class', currentMoves);
  };
  
  var pauseSong = function(){
    playSound.stop();
    audioOffset += audioCtx.currentTime - audioTime;
    currentMoves = DOM.dancers.attr('class');
  };
  
  // web audio api turn upppp
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();
  var analyser = audioCtx.createAnalyser();
  
  loadAudio(audioURL);
  
  
  
  /* key events */
  
  $('body').keypress(function(e){
    
    // debug - print key code
    // console.log(e.which);
    
    // choose action depending on key code
    switch ( e.which ) {
      
      case 0:
        // arrow 
        marquee();
        break;
        
      case 106:
        // j
        bopHead();
        break;
        
      case 101:
        // e
        bendArms();
        break;
        
      case 110:
        // n
        bendLegs();
        break;
      
      case 32:
        // space 
        stopDancing();
        break;
        
      case 102:
        // f
        if (!audioPlaying) { 
          audioPlaying = true;
          playSong();
        }
        break;
        
      case 114:
        // r
        if (audioPlaying) {
          audioPlaying = false;
          pauseSong();
          stopDancing();
        }
        break;
    }
    
  });

});