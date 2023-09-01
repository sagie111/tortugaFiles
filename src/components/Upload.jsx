import react from 'react'; //Added this line
import React from 'react';
import { ReactDOM } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {  useRef, useState } from "react";
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase-production-b48b.up.railway.app');

export default function Upload() {
  let [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  let [items, setItems] = useState(null);
  const captchaRef = useRef(null);

  const onLoad = () => {
    captchaRef.current.execute();
  };

    async function handleUpload() {
      if (!items) return;
      setLoading(false);
      let dataGifs = new FormData();
      let dataVideos = new FormData();
      let dataGifsTrue = false;
      let dataVideosTrue = false;

      for (let i = 0; i < items.length; i++) {
        let extension = items[i].name.split(".").pop();
        if (extension == "gif") {
          dataGifs.append("file", items[i]);
          dataGifsTrue = true;
        } else if (extension == ("mp4" || "webm" || "avi" || "mov")) {
          dataVideos.append("file", items[i]);
          dataVideosTrue = true;
        } else {
          setLoading(true);
          alert("Please only upload GIFs or videos.")
          return;
        }
      }

      if (dataGifsTrue)
        await pb.collection('gifs').create(dataGifs);
      if (dataVideosTrue)
        await pb.collection('videos').create(dataVideos);

      location.href = '/';
    }

    return (
      <>
        <h1>Let's upload!</h1>
        <p>Experience Fast, Secure, and Anonymous File Transfer! Simply upload your files and complete the bot verification process.</p>
        <p>Please only upload GIFs or videos.</p>
        
          <section>
            <article>
                <input type="file" onChange={ (e) => {setItems(e.target.files)}} multiple={true} required/>
              <HCaptcha
                sitekey="b93936d8-08d3-48f8-94fb-640ae99ff5a4"
                onLoad={onLoad}
                onVerify={setToken}
                size='invisible'
                ref={captchaRef}
              />
                  {token ? (
                    <>
                      { loading ? ( <>
                        <section>
                        <small>Accepted formats: gif, mp4, mov, avi, webm</small>
                        </section>
                        <button onClick={handleUpload} required>Upload!</button>

                      </>) : <>
                      
                      <progress></progress>

                      
                      </> }

                    </>
                  ) : <>
                  
                  <p>Please complete the captcha. The captcha takes some time to show up so please be patient.</p>
                  <a onClick={() => location.reload()}>The captcha does'nt appear? please refresh the page.</a>
                  </>}
            </article>
          </section>
        </>
    );
}

