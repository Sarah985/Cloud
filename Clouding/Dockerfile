FROM python:3.8

WORKDIR .
RUN pip install git+https://github.com/agermanidis/autosub.git
RUN apt-get update && apt-get install ffmpeg -y
RUN pip3 install -q ffmpeg-python
COPY /videos .
CMD ["autosub", "/videos/video.mp4"]
