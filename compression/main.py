from time import sleep 
import os
import subprocess
from moviepy.editor import VideoFileClip 
import moviepy.video.fx.all as vfx 


def extractListVideo(texte):
  videos=[]
  listLine = texte.split("\n")
  del listLine[0]
  del listLine[0]
  del listLine[0]
  del listLine[-1]
  for line in listLine :
    if "mp4" not in line :
      del line
    else :
      video= line.split(" ")[-1]
      videos.append(video.split(".")[0])
  return videos

def compress(listVideo):
  p=len(listVideo)
  if(p==0):
    print("Aucune nouvelle vidéo ajoutée.")
  elif(p==1):
    print("une nouvelle vidéo ajoutée.")
    print("compression en cours")
  else :
    print(p,"nouvelles vidéos ajoutées .")
    print("compression en cours")
  
 
  if (p!=0):
    os.system('touch ../videoscomp/liste.txt')
    for i in range(len(listVideo)) :
      os.system('echo '+listVideo[i]+'.mp4 >> ../videoscomp/liste.txt')
      try:
        input_video = VideoFileClip(listVideo[i]+".mp4")
        output_video = input_video.fx(vfx.resize, height=360)
        output_video=output_video.resize(0.5)
        output_video.write_videofile("../videoscomp/"+"video"+str(i)+".mp4",fps=30, preset="medium")
      except:
    	  print(listVideo[i]+".mp4 ne peut etre compressée . Revoir le nom du fichier")
    os.system('rm *')
  
    

os.chdir("../videos")
result = subprocess.run(["ls", "-la"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
f=os.popen("ls -la")
videos = extractListVideo(f.read())
compress(videos)


