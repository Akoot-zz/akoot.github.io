### How I add an episode
* Go to the video, find the start time, right click and copy URL at current time.
* Edit `episodes.txt` which is format: `episode:youtube-id:start-time:date-published`.
* Run `updater.sh` which just runs `Importer.jar` pointing to the public directory where the audio files are hosted.
This will download the youtube video using [youtube-dl](https://github.com/rg3/youtube-dl) and converts it using
[ffmpeg](https://ffmpeg.org/).
* The file `episodes.json` is updated.

Takes maybe 30 seconds