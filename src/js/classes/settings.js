// Get the mechanism to use for storage.
const getStorage = function() {
  // if `window.vsCodeApi` exists, we're in the context of the VSCode extension
  // which handles all of the settings internally, so we don't need to do anything here
  if (window.vsCodeApi) {
    return {
      getItem: () => {},
      setItem: () => {}
    };
  } else {
    return window.localStorage;
  }
};

export const Settings = function(app) {
  const self = this;
  const storage = getStorage();

  ko.extenders.persist = function (target, option) {
    target.subscribe(function (newValue) {
      storage.setItem(option, newValue);
    });
    return target;
  };

  // apply
  //
  // Applies the current settings
  this.apply = function () {
    app.setTheme(self.theme());
    app.setLanguage(self.language());
    app.toggleNightMode();
    app.setMarkupLanguage(self.markupLanguage());
    app.workspace.setThrottle(self.redrawThrottle());
    app.setGistCredentials({token:self.gistToken(), file: self.gistFile()});
  };

  // Theme
  this.theme = ko
    .observable(storage.getItem('theme') || 'classic')
    .extend({ persist:'theme' });

  // Language
  this.language = ko
    .observable(storage.getItem('language') || 'en-GB')
    .extend({ persist:'language' });

  // Redraw throttle
  this.redrawThrottle = ko
    .observable(parseInt(storage.getItem('redrawThrottle') || '50'))
    .extend({ persist:'redrawThrottle' });

  this.gistToken= ko
    .observable(storage.getItem('gistToken'))
    .extend({ persist:'gistToken' });

  this.gistFile = ko
    .observable(storage.getItem('gistFile'))
    .extend({ persist:'gistFile' });

  // Spellcheck enabled
  this.spellcheckEnabled = ko
    .observable(storage.getItem('spellcheckEnabled') !== null ?
      storage.getItem('spellcheckEnabled') === 'true' :
      true
    ).extend({ persist:'spellcheckEnabled' });

  // Transcribe enabled
  this.transcribeEnabled = ko
    .observable(false);

  // Autocomplete tags
  this.completeTagsEnabled = ko
    .observable(storage.getItem('completeTagsEnabled') !== null ?
      storage.getItem('completeTagsEnabled') === 'true' :
      true
    ).extend({ persist:'completeTagsEnabled' });

  // Autocomplete words
  this.completeWordsEnabled = ko
    .observable(storage.getItem('completeWordsEnabled') !== null ?
      storage.getItem('completeWordsEnabled') === 'true' :
      true
    ).extend({ persist:'completeWordsEnabled' });

  // Night mode
  this.nightModeEnabled = ko
    .observable(storage.getItem('nightModeEnabled') !== null ?
      storage.getItem('nightModeEnabled') === 'true' :
      false
    ).extend({ persist:'nightModeEnabled' });

  // Autocreate nodes
  this.createNodesEnabled = ko
    .observable(storage.getItem('createNodesEnabled') !== null ?
      storage.getItem('createNodesEnabled') === 'true' :
      true
    ).extend({ persist:'createNodesEnabled' });

  // Editor stats
  this.editorStatsEnabled = ko
    .observable(storage.getItem('editorStatsEnabled') !== null ?
      storage.getItem('editorStatsEnabled') === 'true' :
      false
    ).extend({ persist:'editorStatsEnabled' });

  // Markup language
  this.markupLanguage = ko
    .observable(storage.getItem('markupLanguage') || 'bbcode')
    .extend({ persist:'markupLanguage' });

  // Always open nodes in Visual Studio Code Editor
  // We don't actually show this in the settings menu; it can only be set by the VSCode extension's settings
  this.alwaysOpenNodesInVisualStudioCodeEditor = ko
    .observable(storage.getItem('alwaysOpenNodesInVisualStudioCodeEditor') !== null ?
      storage.getItem('alwaysOpenNodesInVisualStudioCodeEditor') === 'true' :
      false
    ).extend({ persist:'alwaysOpenNodesInVisualStudioCodeEditor' });
};
