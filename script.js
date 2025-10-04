const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarOverlay.addEventListener('click', closeSidebar);

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = playPauseBtn.querySelector('.play-icon');
const pauseIcon = playPauseBtn.querySelector('.pause-icon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const likeBtn = document.getElementById('likeBtn');
const playlistBtn = document.getElementById('playlistBtn');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const currentTrackCover = document.getElementById('currentTrackCover');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volumeBtn = document.getElementById('volumeBtn');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const playlistModal = document.getElementById('playlistModal');
const closeModal = document.getElementById('closeModal');
const playlistModalBody = document.getElementById('playlistModalBody');

let isPlaying = false;
let currentProgress = 0;
let progressInterval;
let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isLiked = false;
let currentVolume = 70;
let isMuted = false;

const playlist = [
    {
        title: 'YHWH',
        artist: 'Synaï',
        cover: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg',
        duration: 272,
        durationText: '4:32'
    },
    {
        title: 'Freestyle Pour Dieu',
        artist: 'Synaï',
        cover: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg',
        duration: 225,
        durationText: '3:45'
    },
    {
        title: 'Zinzin',
        artist: 'Synaï',
        cover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAAXNSR0IArs4c6QAABVlJREFUeAHtnNdu60gQREfOOcABsN/8/59lwA8OcM7p4hCXCy5h0WytKHJqqwFCpjwz7K6amkyNTk5OvpNNFoE52cgcWIGACRavCCbYBIsjIB6eFWyCxREQD88KNsHiCIiHZwWbYHEExMOzgk2wOALi4VnBJlgcAfHwrGATLI6AeHhWsAkWR0A8PCvYBIsjIB6eFWyCxREQD88KNsHiCIiHZwWbYHEExMOzgk2wOALi4VnBJlgcAfHwrGATLI6AeHhWsAkWR0A8PCvYBIsjIB6eFWyCxREQD88KFid4QTW+hYWFtLa2lpaXl9P8/Hzink/s8/MzfXx8FJ+vr6/p6empuFfEYqT0Q2hzc3Npa2srra+vp6WlpRBfb29v6fHxMd3d3aWvr69Q3iEnllDwaDRK29vbxQXJkxgVgotybm9vi+v7O/8fAcyeYJrhvb29ogmehNh6HirI7u5u2tzcTFdXV0XzXU+T0/1k1X0gEe7s7KTDw8OpkVsNiz6bsnlGzpalgmmS9/f308bGRqfY8xzUvLi4mC4vL1OOTXaWCj44OOic3GrNoSJRoXK07AimyWSUPGuD5Byb66wIZkDVJ8g8Gx9ysmwIpj9ktMxnXzYEH6KxZ0Mw81NGtn0bPuBLLtY/Yi2QYm46KajPz8/FCtXLy8s/y5GQtLKyUvTlq6urLTz4dxJ8yWXFKwuCWX6MrlC9v78XUxuIrRv/47q/vy+IZoTMVait4Qs+3dzctM3SW7osmujoqBnVnp2dpZ/IrSNNGtKSJ2JRnyJlTzPt4AmmOY1sHKDM8/Pz0IYBmwvkIW9bw6chjAl+83fwBEenJaw4TbIbRB7yRizqW6TsaaUdPMHs57Y1mtk2zfK48sgbaaojvo17ZtffD57gcpO+DRAPDw9tkjWmiZQR8a3xoR3+c/Cj6Eg/x+mMccZ0qFxPpikep9SmMuplR3yr553VvZSCOYYzziAXQrhKon9K21RGPX0OCh48wXVQfR9DYPAEc0CurTU1mTTLqJOrabTcVEbdj4hv9byzuh98HwwhbVeZGNWOm8vS556env6KK0uYbS3SnLctc9rppBQ8jRMekRWqHBQ8eIIjo1pGyhEF1tVC3sjmQ8S3+rNmdT94gjmUHjFGyNGNCsonT9Po+icfor79VEbX3w2eYPo5DqW3NfprTkNGSCYtedr29fiCT+6D27LySzreOIgYzezx8XGr5ppmmbSRphlfoj5F/J9m2sGPogmWzXU22SOqRI1HR0fFihXLj/SXpeKYCjHiZlAWJRZ/2JjApxwsC4IBlNdJOKMcNQichMSm5+DLJDtWTWV29b/B98Fl4IBaKrD8ro9PfMCXXCwbgnmrgHeF+ny7YAg+RCtWNgQTGNOSPs9B8ewcpkbVSpAVwTgOyH2MYBmo9Vm5qqRF/s6OYIK7uLiYKclUqKYNigjgs06bJcH0hRySu76+7rRP5jk8g2f12ff/l0qRxTRpXIA0mawoTfMF8PJZjJYVXgDPmmDIYNDDViALIdHFkJLM6mc552YqlKtqq/FkTzDBQARqZnXJP8JSpTclqV/ZqYbGciTnllmS5OwU9+UZqv/TzyhJKLhKbPk3fWgu68Wlz118ZjmK7gII1TJNsCqzf+MywSZYHAHx8KxgEyyOgHh4VrAJFkdAPDwr2ASLIyAenhVsgsUREA/PCjbB4giIh2cFm2BxBMTDs4JNsDgC4uFZwSZYHAHx8KxgEyyOgHh4VrAJFkdAPDwr2ASLIyAenhVsgsUREA/PCjbB4giIh2cFm2BxBMTDs4JNsDgC4uFZwSZYHAHx8KxgEyyOgHh4VrA4wX8AfRTBIQvxo90AAAAASUVORK5CYII=',
        duration: 138,
        durationText: '2:18'
    },
    {
        title: 'Choisir Papa',
        artist: 'Synaï',
        cover: 'https://i.pinimg.com/236x/2c/23/17/2c2317fb606f8dad772f8b2a63dc1b07.jpg',
        duration: 195,
        durationText: '3:15'
    },
    {
        title: 'Le Temps',
        artist: 'Synaï',
        cover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAAXNSR0IArs4c6QAABVlJREFUeAHtnNdu60gQREfOOcABsN/8/59lwA8OcM7p4hCXCy5h0WytKHJqqwFCpjwz7K6amkyNTk5OvpNNFoE52cgcWIGACRavCCbYBIsjIB6eFWyCxREQD88KNsHiCIiHZwWbYHEExMOzgk2wOALi4VnBJlgcAfHwrGATLI6AeHhWsAkWR0A8PCvYBIsjIB6eFWyCxREQD88KNsHiCIiHZwWbYHEExMOzgk2wOALi4VnBJlgcAfHwrGATLI6AeHhWsAkWR0A8PCvYBIsjIB6eFWyCxREQD88KFid4QTW+hYWFtLa2lpaXl9P8/Hzink/s8/MzfXx8FJ+vr6/p6empuFfEYqT0Q2hzc3Npa2srra+vp6WlpRBfb29v6fHxMd3d3aWvr69Q3iEnllDwaDRK29vbxQXJkxgVgotybm9vi+v7O/8fAcyeYJrhvb29ogmehNh6HirI7u5u2tzcTFdXV0XzXU+T0/1k1X0gEe7s7KTDw8OpkVsNiz6bsnlGzpalgmmS9/f308bGRqfY8xzUvLi4mC4vL1OOTXaWCj44OOic3GrNoSJRoXK07AimyWSUPGuD5Byb66wIZkDVJ8g8Gx9ysmwIpj9ktMxnXzYEH6KxZ0Mw81NGtn0bPuBLLtY/Yi2QYm46KajPz8/FCtXLy8s/y5GQtLKyUvTlq6urLTz4dxJ8yWXFKwuCWX6MrlC9v78XUxuIrRv/47q/vy+IZoTMVait4Qs+3dzctM3SW7osmujoqBnVnp2dpZ/IrSNNGtKSJ2JRnyJlTzPt4AmmOY1sHKDM8/Pz0IYBmwvkIW9bw6chjAl+83fwBEenJaw4TbIbRB7yRizqW6TsaaUdPMHs57Y1mtk2zfK48sgbaaojvo17ZtffD57gcpO+DRAPDw9tkjWmiZQR8a3xoR3+c/Cj6Eg/x+mMccZ0qFxPpikep9SmMuplR3yr553VvZSCOYYzziAXQrhKon9K21RGPX0OCh48wXVQfR9DYPAEc0CurTU1mTTLqJOrabTcVEbdj4hv9byzuh98HwwhbVeZGNWOm8vS556env6KK0uYbS3SnLctc9rppBQ8jRMekRWqHBQ8eIIjo1pGyhEF1tVC3sjmQ8S3+rNmdT94gjmUHjFGyNGNCconT9Po+icfor79VEbX3w2eYPo5DqW3NfprTkNGSCYtedr29fiCT+6D27LySzreOIgYzezx8XGr5ppmmbSRphlfoj5F/J9m2sGPogmWzXU22SOqRI1HR0fFihXLj/SXpeKYCjHiZlAWJRZ/2JjApxwsC4IBlNdJOKMcNQichMSm5+DLJDtWTWV29b/B98Fl4IBaKrD8ro9PfMCXXCwbgnmrgHeF+ny7YAg+RCtWNgQTGNOSPs9B8ewcpkbVSpAVwTgOyH2MYBmo9Vm5qqRF/s6OYIK7uLiYKclUqKYNigjgs06bJcH0hRySu76+7rRP5jk8g2f12ff/l0qRxTRpXIA0mawoTfMF8PJZjJYVXgDPmmDIYNDDViALIdHFkJLM6mc552YqlKtqq/FkTzDBQARqZnXJP8JSpTclqV/ZqYbGciTnllmS5OwU9+UZqv/TzyhJKLhKbPk3fWgu68Wlz118ZjmK7gII1TJNsCqzf+MywSZYHAHx8KxgEyyOgHh4VrAJFkdAPDwr2ASLIyAenhVsgsUREA/PCjbB4giIh2cFm2BxBMTDs4JNsDgC4uFZwSZYHAHx8KxgEyyOgHh4VrAJFkdAPDwr2ASLIyAenhVsgsUREA/PCjbB4giIh2cFm2BxBMTDs4JNsDgC4uFZwSZYHAHx8KxgEyyOgHh4VrA4wX8AfRTBIQvxo90AAAAASUVORK5CYII=',
        duration: 158,
        durationText: '2:38'
    }
];

function loadTrack(index) {
    const track = playlist[index];
    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;
    currentTrackCover.src = track.cover;
    totalTime.textContent = track.durationText;
    currentTrackIndex = index;
    currentProgress = 0;
    progressFill.style.width = '0%';
    currentTime.textContent = '0:00';
    updatePlaylistModal();
}

function showPlayer() {
    musicPlayer.classList.add('active');
    document.querySelector('.main-content').style.paddingBottom = '120px';
}

function togglePlayPause() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        startProgress();
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        stopProgress();
    }
}

function startProgress() {
    const track = playlist[currentTrackIndex];
    const increment = 100 / (track.duration * 10);

    progressInterval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
            if (isRepeat) {
                currentProgress = 0;
            } else {
                nextTrack();
                return;
            }
        }
        progressFill.style.width = currentProgress + '%';

        const currentSeconds = Math.floor((currentProgress / 100) * track.duration);
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 100);
}

function stopProgress() {
    clearInterval(progressInterval);
}

function nextTrack() {
    stopProgress();

    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentTrackIndex && playlist.length > 1);
        currentTrackIndex = newIndex;
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }

    loadTrack(currentTrackIndex);

    if (isPlaying) {
        togglePlayPause();
        setTimeout(() => togglePlayPause(), 100);
    }
}

function prevTrack() {
    stopProgress();

    if (currentProgress > 10) {
        currentProgress = 0;
        progressFill.style.width = '0%';
        currentTime.textContent = '0:00';
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
    }

    if (isPlaying) {
        togglePlayPause();
        setTimeout(() => togglePlayPause(), 100);
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

function toggleLike() {
    isLiked = !isLiked;
    likeBtn.classList.toggle('liked', isLiked);
}

function setProgress(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    currentProgress = (clickX / width) * 100;
    progressFill.style.width = currentProgress + '%';

    const track = playlist[currentTrackIndex];
    const currentSeconds = Math.floor((currentProgress / 100) * track.duration);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function setVolume(e) {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    currentVolume = Math.max(0, Math.min(100, (clickX / width) * 100));
    volumeFill.style.width = currentVolume + '%';

    if (currentVolume === 0) {
        isMuted = true;
        updateVolumeIcon();
    } else if (isMuted) {
        isMuted = false;
        updateVolumeIcon();
    }
}

function toggleMute() {
    isMuted = !isMuted;

    if (isMuted) {
        volumeFill.style.width = '0%';
    } else {
        volumeFill.style.width = currentVolume + '%';
    }

    updateVolumeIcon();
}

function updateVolumeIcon() {
    const volumeHigh = volumeBtn.querySelector('.volume-high');
    const volumeMuted = volumeBtn.querySelector('.volume-muted');

    if (isMuted || currentVolume === 0) {
        volumeHigh.style.display = 'none';
        volumeMuted.style.display = 'block';
    } else {
        volumeHigh.style.display = 'block';
        volumeMuted.style.display = 'none';
    }
}

function updatePlaylistModal() {
    playlistModalBody.innerHTML = '';

    playlist.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.className = 'playlist-track' + (index === currentTrackIndex ? ' playing' : '');
        trackElement.innerHTML = `
            <div class="playlist-track-cover">
                <img src="${track.cover}" alt="${track.title}">
            </div>
            <div class="playlist-track-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            <span class="playlist-track-duration">${track.durationText}</span>
        `;

        trackElement.addEventListener('click', () => {
            const wasPlaying = isPlaying;
            if (isPlaying) {
                togglePlayPause();
            }
            loadTrack(index);
            if (wasPlaying) {
                setTimeout(() => togglePlayPause(), 100);
            }
        });

        playlistModalBody.appendChild(trackElement);
    });
}

function togglePlaylistModal() {
    playlistModal.classList.toggle('active');
}

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
likeBtn.addEventListener('click', toggleLike);
playlistBtn.addEventListener('click', togglePlaylistModal);
closeModal.addEventListener('click', togglePlaylistModal);

playlistModal.addEventListener('click', (e) => {
    if (e.target === playlistModal) {
        togglePlaylistModal();
    }
});

progressBar.addEventListener('click', setProgress);
volumeBar.addEventListener('click', setVolume);
volumeBtn.addEventListener('click', toggleMute);

document.querySelectorAll('.playlist-item').forEach((item, index) => {
    const playOverlay = item.querySelector('.play-overlay');

    playOverlay.addEventListener('click', (e) => {
        e.stopPropagation();

        const wasPlaying = isPlaying;
        if (isPlaying) {
            togglePlayPause();
        }

        loadTrack(index % playlist.length);
        showPlayer();

        setTimeout(() => {
            if (!wasPlaying) {
                togglePlayPause();
            } else {
                togglePlayPause();
            }
        }, 100);
    });
});

updateVolumeIcon();
