document.addEventListener('DOMContentLoaded', function() {
    const moviesContainer = document.getElementById('moviesContainer');
    const showsContainer = document.getElementById('showsContainer');
    const mediaModal = document.getElementById('mediaModal');
    const mediaPlayer = document.getElementById('mediaPlayer');
    const closeButton = document.querySelector('.close');
    const seasonDropdown = document.getElementById('seasonDropdown');
    const episodeDropdown = document.getElementById('episodeDropdown');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const skipBtn = document.getElementById('skipBtn');
    const seekBar = document.getElementById('seekBar');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');

    // Example data
    const movies = [
        { title: "Cats", thumbnail: "thumbnails/Cats.jpg", video: "Videos/Movies/Cats.mp4" },
        { title: "Ballerina", thumbnail: "thumbnails/Ballerina.jpg", video: "Videos/Movies/Ballerina.mp4" },
        { title: "Free Birds", thumbnail: "thumbnails/Free Birds.jpg", video: "Videos/Movies/Free Birds.mp4" },
        { title: "Gran Turismo", thumbnail: "thumbnails/Gran Turismo.jpg", video: "Videos/Movies/Gran Turismo.mp4" },
        { title: "Home Alone", thumbnail: "thumbnails/Home Alone.jpg", video: "Videos/Movies/Home Alone.mp4" },
        { title: "Megamind vs the Doom Syndicate", thumbnail: "thumbnails/Megamind vs the Doom Syndicate.jpg", video: "Videos/Movies/Megamind vs the Doom Syndicate.mp4" },
        { title: "The Thundermans Return", thumbnail: "thumbnails/The Thundermans Return.jpg", video: "Videos/Movies/The Thundermans Return.mp4" }
    ];

    const shows = {
        "The Walking Dead The Ones Who Live": {
            thumbnail: "thumbnails/show1.jpg",
            seasons: {
                "Season 1": ["Episode 1", "Episode 2", "Episode 3", "Episode 4", "Episode 5", "Episode 6"]
            }
        },
        "Show 2": {
            thumbnail: "thumbnails/show2.jpg",
            seasons: {
                "Season 1": ["Episode 1", "Episode 2"]
            }
        }
    };

    let currentVideoIndex = 0; // Track the current video index for skipping

    function createMovieBox(movie) {
        const movieBox = document.createElement('div');
        movieBox.className = 'thumbnail-box';
        movieBox.dataset.title = movie.title;
        movieBox.dataset.videoSrc = movie.video;
        movieBox.innerHTML = `<img src="${movie.thumbnail}" alt="${movie.title}"><p>${movie.title}</p>`;
        movieBox.addEventListener('click', function() {
            mediaPlayer.src = movie.video;
            mediaPlayer.play();
            mediaModal.classList.add('show');
        });
        moviesContainer.appendChild(movieBox);
    }

    function createShowBox(showName, showData) {
        const showBox = document.createElement('div');
        showBox.className = 'thumbnail-box';
        showBox.dataset.title = showName;
        showBox.innerHTML = `<img src="${showData.thumbnail}" alt="${showName}"><p>${showName}</p>`;
        showBox.addEventListener('click', function() {
            seasonDropdown.innerHTML = '<option value="">Select Season</option>';
            episodeDropdown.innerHTML = '<option value="">Select Episode</option>';
            for (const season in showData.seasons) {
                const option = document.createElement('option');
                option.value = season;
                option.textContent = season;
                seasonDropdown.appendChild(option);
            }
            seasonDropdown.style.display = 'block';
            seasonDropdown.addEventListener('change', function() {
                episodeDropdown.innerHTML = '<option value="">Select Episode</option>';
                const selectedSeason = this.value;
                if (selectedSeason) {
                    showData.seasons[selectedSeason].forEach(episode => {
                        const option = document.createElement('option');
                        option.value = episode;
                        option.textContent = episode;
                        episodeDropdown.appendChild(option);
                    });
                    episodeDropdown.style.display = 'block';
                } else {
                    episodeDropdown.style.display = 'none';
                }
            });
            episodeDropdown.addEventListener('change', function() {
                const selectedEpisode = this.value;
                if (selectedEpisode) {
                    const videoSrc = `Videos/TV Shows/${showName}/${selectedSeason}/${selectedEpisode}.mp4`;
                    mediaPlayer.src = videoSrc;
                    mediaPlayer.play();
                    mediaModal.classList.add('show');
                }
            });
            mediaModal.classList.add('show');
        });
        showsContainer.appendChild(showBox);
    }

    function updateSeekBar() {
        const progress = (mediaPlayer.currentTime / mediaPlayer.duration) * 100;
        seekBar.value = progress;
        currentTimeDisplay.textContent = formatTime(mediaPlayer.currentTime);
        durationDisplay.textContent = formatTime(mediaPlayer.duration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    mediaPlayer.addEventListener('loadedmetadata', function() {
        seekBar.max = 100;
        updateSeekBar();
    });

    mediaPlayer.addEventListener('timeupdate', updateSeekBar);

    seekBar.addEventListener('input', function() {
        const time = (seekBar.value / 100) * mediaPlayer.duration;
        mediaPlayer.currentTime = time;
    });

    playPauseBtn.addEventListener('click', function() {
        if (mediaPlayer.paused) {
            mediaPlayer.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            mediaPlayer.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    skipBtn.addEventListener('click', function() {
        const allVideos = Array.from(document.querySelectorAll('.thumbnail-box')).map(box => box.dataset.videoSrc);
        if (allVideos.length > 0) {
            currentVideoIndex = (currentVideoIndex + 1) % allVideos.length;
            mediaPlayer.src = allVideos[currentVideoIndex];
            mediaPlayer.play();
        }
    });

    closeButton.addEventListener('click', function() {
        mediaModal.classList.remove('show');
        mediaPlayer.pause(); // Stop video when modal is closed
    });

    // Load movies and shows
    movies.forEach(createMovieBox);
    for (const showName in shows) {
        createShowBox(showName, shows[showName]);
    }
});
