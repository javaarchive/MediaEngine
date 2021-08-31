module.exports = {
  brand: "Media Engine",
  enabledYouTubeModes: [
    "node-ytdl", // ytdl-core based
    "invidious", // invidious instances
    "python-youtubedl" // python youtubedl fetch url
  ],
  invidiousInstances: [
 //   "https://ytprivate.com",
 //  "https://vid.puffyan.us",
    "https://inv.riverside.rocks",
 //   "https://invidious.silkky.cloud",
 //   "https://yewtu.be"
  ],
  defaults: {
    contentProvider: "youtube",
    ytMode: "node-ytdl",
    ytSearchMode: "invidious",
    preferedMediaForm: "audio",
    prefersDirectStreams: false
  },
  contentProviders: {
    "youtube": "./contentproviders/youtube"
  },
  settingIDtoPropExtensions: {

  },
  apiUserAgent: "Media Engine Alexa Skill 1.0 (bit.ly/mediaengine)",
  selfURL: "https://MediaEngine.javaarchive.repl.co",
  propChoices: {
    preferedMediaForm: ["audio","video"],
    ytMode: ["node-ytdl","invidious"],
    prefersDirectStreams: [false,true]
  }
};