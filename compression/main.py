from time import sleep 
import os
import subprocess
from moviepy.editor import VideoFileClip 
import moviepy.video.fx.all as vfx 

print("pod downscale start")

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

def compress(listVideo,listVideoComp):
    n=len(listVideo)
    p=0
    m=len(videoscomp)
    for video in listVideo :
        if video+"-compress" not in listVideoComp :
           p+=1

    if(p==0):
        print("Aucune nouvelle vidéo ajoutée.")
    elif(p==1):
        print("une nouvelle vidéo ajoutée.")
        print("compression en cours")
    else :
        print(p,"nouvelles vidéos ajoutées .")
        print("compression en cours")

    for video in listVideo :
        if video+"-compress" not in listVideoComp :
            input_video = VideoFileClip(video+".mp4")
            output_video = input_video.fx(vfx.resize, height=360)
            output_video=output_video.resize(0.5)
            output_video.write_videofile("../videoscomp/"+video+"-compress.mp4",fps=30, preset="medium")
    

  
while 1 :
  os.chdir("../videos")
  result = subprocess.run(["ls", "-la"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
  print(result.stdout)
  f=os.popen("ls -la")
  videos = extractListVideo(f.read())
  os.chdir("../videoscomp")
  f=os.popen("ls -la")
  videoscomp = extractListVideo(f.read())
  os.chdir("../videos")
  compress(videos,videoscomp)
  
  sleep(60)


