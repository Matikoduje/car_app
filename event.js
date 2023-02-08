export const EventType = {
  NONE: 'none',
  KEY_PRESSED: 'key pressed',
  CONFIRM: 'confirm',
  GO_BACK: 'go back',
  CANCEL: 'cancel',
}

export function Event(callback) {

  const KEY_ESC = 27;
  const KEY_BACKSPACE = 127;
  const KEY_ENTER = 13;  

  let event = EventType.NONE;
  let key = 0;
  
  process.stdin.setRawMode( true );
  process.stdin.resume()
  process.stdin.on('data', function (data) {
    
    if (1 !== data.length ) {
      return;
    }
    
    if (data && data == '\x03') {
      process.stdout.write("Bye\n");
      process.exit(0);
    }
    
    event = EventType.KEY_PRESSED;

    if (KEY_ENTER === data[0]) {
      event = EventType.CONFIRM;
    }
    
    if (KEY_BACKSPACE === data[0]) {
      event = EventType.GO_BACK;
    }
    
    if (KEY_ESC === data[0]) {
      event = EventType.CANCEL;
    }
    
    key = data.toString();    
    
    callback(event);
    
  });
  
  return {
    reset: function() { event = EventType.NONE; },
    getEventType: () => event,
    getKey: () => key,
  }
}
