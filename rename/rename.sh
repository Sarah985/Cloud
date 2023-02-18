#!/bin/sh

new_filename=$(cat /videos/file.txt)
srt_filename="${new_filename%.mp4}.srt"
txt_filename="${new_filename%.mp4}.txt"
mv /videos/video.mp4 /videos/"$new_filename"
mv /videos/video.srt /videos/"$srt_filename"
mv /videos/language.txt /videos/"$txt_filename"
rm /videos/file.txt 