import * as API from "./index.js"

export default{
    // 获取banner
  getBanner: params => {
    return API.GET('/banner', params)
  },
    // 歌单
    getPlaylist: params => {
      return API.GET('/top/playlist', params)
    },
    //推荐新音乐
    getNewSongs: params => {
      return API.GET('/personalized/newsong', params)
    },
    //歌手
    getArtists: params => {
      return API.GET('/top/artists', params)
    },
    
    //歌手
    searchdefault: params => {
      return API.GET('/search/default', params)
    },
    
    hotdetail: params => {
      return API.GET('/search/hot/detail', params)
    },
    
    searchsuggest: params => {
      return API.GET('/search', params)
    },

    hotplaylist: params => {
      return API.GET('/playlist/hot', params)
    },
    
    catlist: params => {
      return API.GET('/top/playlist/highquality', params)
    },
    
    sentcaptcha: params => {
      return API.GET('/captcha/sent', params)
    },
    
    register: params => {
      return API.GET('/register/cellphone', params)
    },
    
    cellphone: params => {
      return API.GET('/login/cellphone', params)
    },

    initprofile: params => {
      return API.GET('/activate/init/profile', params)
    },
    
    playlistuser: params => {
      return API.GET('/user/playlist', params)
    },

    
    playlistdetail: params => {
      return API.GET('/playlist/detail', params)
    },
    
    songdetail: params => {
      return API.GET('/song/detail', params)
    },

    songurl: params => {
      return API.GET('/song/url', params)
    },

    lyric: params => {
      return API.GET('/lyric', params)
    },

    songtop: params => {
      return API.GET('/artist/top/song', params)
    },
    artistlist: params => {
      return API.GET('/artist/list', params)
    },
    
    artistdesc: params => {
      return API.GET('/artist/desc', params)
    },
    
    toplist: params => {
      return API.GET('/toplist/detail', params)
    },

    
    recommendsongs: params => {
      return API.GET('/recommend/songs', params)
    },

    getsongtop: params => {
      return API.GET('/top/song', params)
    },

    allmv: params => {
      return API.GET('/mv/all', params)
    },

    firstmv: params => {
      return API.GET('/mv/first', params)
    },

    
    mvdetail: params => {
      return API.GET('/mv/detail', params)
    },
    mvurl: params => {
      return API.GET('/mv/url', params)
    },
    
    simimv: params => {
      return API.GET('/simi/mv', params)
    },

    
    createplaylist: params => {
      return API.GET('/playlist/create', params)
    },
    
    tracksplaylist: params => {
      return API.GET('/playlist/tracks', params)
    },
    
    updateuser: params => {
      return API.GET('/user/update', params)
    },
    
    subcount: params => {
      return API.GET('/user/subcount', params)
    },
    
    userdetail: params => {
      return API.GET('/user/detail', params)
    },
    
    deleteplaylist: params => {
      return API.GET('/playlist/delete', params)
    },
}