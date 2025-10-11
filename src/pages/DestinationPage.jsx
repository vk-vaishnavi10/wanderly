import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./DestinationPage.css"; // new css file

export default function DestinationPage() {
  const { name } = useParams();
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ Wikipedia summary
        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
        );
        const summaryData = await summaryRes.json();

        if (summaryData.title && !summaryData.detail) {
          setInfo({
            title: summaryData.title,
            description: summaryData.extract,
            image: summaryData.thumbnail?.source || null,
            url: summaryData.content_urls?.desktop?.page || null,
          });
        }

        // 2️⃣ Images
        const imagesRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            name
          )}&prop=images&format=json&origin=*`
        );
        const imagesData = await imagesRes.json();
        const pages = imagesData.query?.pages || {};
        let fileNames = [];
        Object.values(pages).forEach((page) => {
          if (page.images) {
            fileNames = page.images.map((img) => img.title);
          }
        });

        const imageInfos = await Promise.all(
          fileNames.slice(0, 6).map(async (file) => {
            const imgRes = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
                file
              )}&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`
            );
            const imgData = await imgRes.json();
            const pageData = Object.values(imgData.query.pages)[0];
            if (pageData.imageinfo) {
              const info = pageData.imageinfo[0];
              return {
                url: info.url,
                caption:
                  info.extmetadata?.ObjectName?.value ||
                  file.replace("File:", ""),
              };
            }
            return null;
          })
        );

        setImages(imageInfos.filter(Boolean));

        // 3️⃣ Tourist attractions
        const linksRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            name
          )}&prop=links&format=json&pllimit=50&origin=*`
        );
        const linksData = await linksRes.json();
        const linkPages = Object.values(linksData.query.pages)[0].links || [];
        const filtered = linkPages
          .map((l) => l.title)
          .filter((title) =>
            /(Palace|Temple|Fort|Museum|Park|Square|Garden|Beach|Tower|Monument|Attraction)/i.test(
              title
            )
          );
        setAttractions(filtered.slice(0, 10));
      } catch (error) {
        console.error(error);
        setInfo(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [name]);

  if (loading) return <h2 className="loading-text">Loading...</h2>;
  if (!info) return <h2 className="error-text">No details found for "{name}" 😢</h2>;

  return (
    <div className="destination-page">
      {/* 🏙️ Main Info */}
      <h1 className="destination-title">{info.title}</h1>
      {info.image && (
        <img src={info.image} alt={info.title} className="destination-main-img" />
      )}
      <p className="destination-desc">{info.description}</p>
      {info.url && (
        <p className="wiki-link">
          <a href={info.url} target="_blank" rel="noopener noreferrer">
            Learn more on Wikipedia →
          </a>
        </p>
      )}

      {/* 📸 Gallery */}
      {images.length > 0 && (
        <section className="gallery-section">
          <h2>Gallery</h2>
          <div className="gallery-grid">
            {images.map((img, i) => (
              <div key={i} className="gallery-card">
                <img src={img.url} alt={img.caption} className="gallery-img" />
                <div className="gallery-caption">{img.caption}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🗺️ Google Maps */}
      <section className="map-section">
        <h2>Location Map</h2>
        <iframe
          title={`${info.title} Map`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(info.title)}&output=embed`}
          className="map-iframe"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>

      {/* 🏰 Attractions */}
      {attractions.length > 0 && (
        <section className="attractions-section">
          <h2>Top Tourist Attractions in {info.title}</h2>
          <ul className="attractions-list">
            {attractions.map((attr, i) => (
              <li key={i}>
                <Link to={`/destination/${attr}`}>{attr}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
