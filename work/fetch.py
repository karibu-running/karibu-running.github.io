import yt_dlp, json, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
old_all=json.load(open("videos.json")) if os.path.exists("videos.json") else {}
out={}
for key,base,LANG in [("jp","https://www.youtube.com/channel/UCQZxCuvYUSKjX0tQHaizz6Q","ja"),("en","https://www.youtube.com/@KARIBURunning","en")]:
    for tab in ["videos","shorts"]:
        try:
            with yt_dlp.YoutubeDL({"extract_flat":True,"quiet":True,"extractor_args":{"youtube":{"lang":[LANG]}}}) as y:
                info=y.extract_info(f"{base}/{tab}",download=False)
            out[f"{key}_{tab}"]=[{k:e.get(k) for k in ("id","title","duration","view_count","description")} for e in info["entries"]]
            m={k:info.get(k) for k in ("channel","channel_follower_count","description","uploader_id","channel_url")}
            old=out.get(f"{key}_meta",{})
            out[f"{key}_meta"]={k:(m[k] if m[k] is not None else old.get(k)) for k in m}
        except Exception as ex:
            print(key,tab,"ERR",ex,file=sys.stderr)
# 登録者数は言語指定なしのほうが取れる
for key,base,LANG in [("jp","https://www.youtube.com/channel/UCQZxCuvYUSKjX0tQHaizz6Q","ja"),("en","https://www.youtube.com/@KARIBURunning","en")]:
    if out.setdefault(f"{key}_meta",dict(old_all.get(f"{key}_meta",{}))).get("channel_follower_count") is None:
        try:
            with yt_dlp.YoutubeDL({"extract_flat":True,"quiet":True,"playlistend":1}) as y:
                out[f"{key}_meta"]["channel_follower_count"]=y.extract_info(f"{base}/videos",download=False).get("channel_follower_count")
        except Exception as ex: print("subs ERR",ex,file=sys.stderr)
# 取れなかった一覧・極端に減った一覧は、前の値を残す（YouTube側の一時的な失敗でサイトを壊さない）
for k,v in old_all.items():
    if k not in out or (isinstance(v,list) and len(out[k])<len(v)*0.8): print("keep old",k,file=sys.stderr); out[k]=v
if not out.get("jp_videos"): sys.exit("jp_videos が取れませんでした")
json.dump(out,open("videos.json","w"),ensure_ascii=False,indent=1)
for k,v in out.items():
    print(k,len(v) if isinstance(v,list) else v)
