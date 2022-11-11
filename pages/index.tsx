import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

const Home = () => {
  const websites = ["janete.co.mz", "osinformais.com", "jolivillas.com", "peasantsforclimatejustice.org", "arene.org.mz", "maquinas.co.mz", "parquemaputo.gov.mz", "biofund.org.mz", "plataforma.biofund.org.mz", "makelinks.africa", "sunsociedadecivil.org.mz", "maputofilm.com", "proler.gov.mz", "camoes-ccpmocambique.co.mz", "feeltheheat.co.mz", "www.cga.co.mz", "anima.co.mz", "tecnicaindustrial.co.mz"];
  const [websitesToBeShown, setWebsitesToBeShown] = useState<any[]>([]);

  useEffect(() => {
    organizeWebsites();
  }, []);

  const organizeWebsites = () => {
    websites.map(async (siteName) => {
      const backgroundRes = await getBackground(siteName);
      if (typeof(backgroundRes.link) === "string") {
        setWebsitesToBeShown((prevState) => ([...prevState, { link: backgroundRes.link, image: backgroundRes.image }]))
      }
    });
  }

  const getBackground = (siteName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
       const finalUrl = "http://" + siteName;

       const promise = fetch("/api/visit?url=" + finalUrl, { method: "GET" });
       const jsonResponse = promise.then(response => { return response.json(); });
       jsonResponse.then (finalRes => {
          if (finalRes.data.toString() !== "") {
             const string64BitImageSrc = `data:image/png;base64, ${finalRes.data}`;
             resolve({ link: finalUrl, image: string64BitImageSrc });
          } else {
             resolve({ link: finalUrl, image: null });
          }
       }).catch(error => {
          reject({ message: "Something went wrong" })
       });
    });
 }


  return (
    <div className={styles.websitesCards}>
      {
        websitesToBeShown.length > 0 ? 
        websitesToBeShown.map((siteData, index) => {
          if (siteData.image !== null) {
            return (
              <Link href={siteData.link} key={"site" + index}>
                <div className={styles.card} style={{ backgroundImage: `url('${siteData.image}')` }}>
                    <span className={styles.span}>{ siteData.link }</span>
                </div>
              </Link>
            )
          } else {
            return (
              <Link href={siteData.link} key={"site" + index}>
                <div className={styles.card}>
                    <span className={styles.span}>{ siteData.link }</span>
                    <p>Erro ao carregar o webiste!</p>
                </div>
              </Link>
            )
          }
        }) : (
          <p style={{ textAlign: "center" }}>Aguarder.... a carregar os websites</p>
        )
      }
    </div>
  )
}


export default Home;