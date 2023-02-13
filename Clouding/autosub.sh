#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "No arguments supplied. Please provide the path to the video file."
    exit 1
fi

video_file=$1

autosub $video_file

