const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: 'Nightglow',
            singer: 'Tanya Chua',
            path: './assets/song/Nightglow - Thái Kiện Nhã (Tanya Chua).mp3',
            image: './assets/img/himeko.jpg'
        },

        {
            name: 'Renai Circulation',
            singer: 'Sengoku Nadeko',
            path: './assets/song/Renai Circulation - Sengoku Nadeko.mp3',
            image: './assets/img/Renai.jpg'
        },

        {
            name: 'Avid',
            singer: ' Sawano Hiroyuki',
            path: './assets/song/Avid86Ending-HiroyukiSawanoMizuki-7008524.mp3',
            image: './assets/img/86.jpg'
        },

        {
            name: 'Yume to Hazakura',
            singer: 'Hatsune Miku',
            path: './assets/song/YumeToHazakura-HatsuneMiku-1786637.mp3',
            image: './assets/img/HatsuneMiku.jpg'
        },

        {
            name: 'Hazy Moon',
            singer: 'Hatsune Miku',
            path: './assets/song/HazyMoon-HatsuneMiku-1689454.mp3',
            image: './assets/img/HazyMoon_HatsuneMiku.jpg'
        }

    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                   <div class="thumb" style="background-image: url('${song.image}')"></div>
                   <div class="body">
                       <h3 class="title">${song.name}</h3>
                       <p class="author">${song.singer}</p>
                   </div>
                   <div class="option">
                       <i class="fas fa-ellipsis-h"></i>
                   </div>
               </div>
            `

        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()
            //Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdwidth = cdWidth - scrollTop

            cd.style.width = newCdwidth > 0 ? newCdwidth + 'px' : 0
            cd.style.opacity = newCdwidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
            }
            // Khi song được play
        audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            // Khi song bị pause
        audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()

            }
            //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
            //Xử lý khi tua 
        progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            //Khi next song
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.nextSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            //Khi quay lại
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            //Khi bật / tắt random song
        randomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom
                randomBtn.classList.toggle('active', _this.isRandom)

            }
            //Xử lý lặp lại một song
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                repeatBtn.classList.toggle('active', _this.isRepeat)
            }
            //Xử lý next song khi audio ended
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }

            }
            // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xử lý khi click song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 500)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },

    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvent()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng  
        this.loadCurrentSong()

        //Render playlist
        this.render()
    }
}
app.start()