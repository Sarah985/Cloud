
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model
from scipy.io.wavfile import read as wav_read
from scipy.io.wavfile import write as wav_write
import scipy.signal as sps


def get_language(prediction):
  index = tf.math.argmax(prediction).numpy()
  options = {0: "Noise",
             1: "Chinese",
             2: "English",
             3: "French",
             4: "German",
             5: "Italian",
             6: "Russian",
             7: "Spanish"}
  return options[index]

# input restrictions
length_s = 5
sample_rate = 48000
target_sample_rate = 16000
num_samples = length_s * target_sample_rate

def down_sample(audio, sampling_rate=48000, target_rate=16000):
  number_of_samples = round(len(audio) * float(target_rate) / sampling_rate)
  audio = sps.resample(audio, number_of_samples)
  return audio

def normalize(signal):
	maximum = max(abs(signal.max()), abs(signal.min()))
	if maximum == 0.0:
		print("normalize: omitting to divide by zero!!")
		return signal
	return signal / float(maximum)
 
def pad_or_cut(data, max_len):
  if len(data) == max_len:
    return data
  elif len(data) > max_len:
    return data[:max_len]
  else:
    to_add = max(max_len - len(data), 0)
    data = np.pad(data, (0, to_add), mode='constant', constant_values=0)
    return data

def pre_process(audio):
  audio = down_sample(audio, sample_rate,
                      target_sample_rate)     # input must be sampled at 16000kHz
  audio = normalize(audio)                    # input range is floating point from 0 to 1
  audio = pad_or_cut(audio, num_samples)      # input must be 80000
  audio = tf.expand_dims(audio, -1)           # add a channel for stft
  audio = tf.expand_dims(audio, 0)            # make it a batch
  return audio

if __name__ == '__main__':

  model = load_model("AttRnn7lang/model_17")
  sr, audio = wav_read("loutre_cut.wav")

  audio = pre_process(audio)
  prediction = model.predict(audio)
  language = get_language(prediction[0])
  print(language)