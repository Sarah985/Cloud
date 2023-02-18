#!/bin/sh


new_filename=$(cat /videos/file.txt)
srt_filename="${new_filename%.mp4}.srt"
mv /videos/video.mp4 /videos/"$new_filename"
mv /videos/video.srt /videos/"$srt_filename"
rm /videos/file.txt 