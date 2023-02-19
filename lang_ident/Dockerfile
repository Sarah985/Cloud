FROM tensorflow/tensorflow

ARG START_TIME
ARG DURATION

WORKDIR .
COPY lang_ident.py .
COPY AttRnn7lang ./AttRnn7lang/

RUN pip install -q -U pip==20.3
# RUN pip install -q tensorflow
RUN pip install scipy
RUN pip install -q ffmpeg-python

RUN apt-get update && apt-get install -y ffmpeg

CMD ["python", "lang_ident.py", "--start-time", "$START_TIME", "--duration", "$DURATION"]
