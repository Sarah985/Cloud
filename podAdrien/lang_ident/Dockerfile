FROM tensorflow/tensorflow

ENV START_TIME=${start_time}
ENV DURATION=${duration}

WORKDIR .
COPY sample_data ./sample_data
COPY lang_ident.py .
COPY AttRnn7lang ./AttRnn7lang/

RUN pip install -q -U pip==20.2
# RUN pip install -q tensorflow
RUN pip install scipy
RUN pip install -q ffmpeg-python

CMD ffmpeg -i sample_data/video.mp4  -vn -ar 48000 -ac 1 -ab 192k -f wav sample_data/output.wav
CMD ffmpeg -i audio/output.wav -ss ${START_TIME} -t ${DURATION} audio/output_cut.wav
CMD ["python", "lang_ident.py"]
