module.exports = {
  brand: "Media Engine",
  enabledYouTubeModes: [
    "node-ytdl", // ytdl-core based
    "invidious", // invidious instances
    "python-youtubedl" // python youtubedl fetch url
  ],
  invidiousInstances: [
    "https://ytprivate.com",
    "https://invidious-us.kavin.rocks",
    "https://inv.riverside.rocks"
  ],
  defaults: {
    contentProvider: "youtube",
    ytMode: "node-ytdl",
    ytSearchMode: "invidious",
    prefferedMediaForm: "audio",
    prefersDirectStreams: false
  },
  contentProviders: {
    "youtube": "./contentproviders/youtube"
  },
  settingIDtoPropExtensions: {

  },
  apiUserAgent: "Media Engine Alexa Skill 1.0 (bit.ly/mediaengine)",
  selfURL: "https://MediaEngine.javaarchive.repl.co"
};