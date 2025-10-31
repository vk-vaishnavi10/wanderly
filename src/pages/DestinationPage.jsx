import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./DestinationPage.css";

export default function DestinationPage() {
  const { name } = useParams();
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 🔹 Normalize name (capitalize properly)
        const queryName = name.trim().toLowerCase();
  
        // 1️⃣ Wikipedia Search API — find the closest page title
        const searchRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            queryName
          )}&format=json&origin=*`
        );
        const searchData = await searchRes.json();
        const bestMatch = searchData.query?.search?.[0]?.title;
  
        if (!bestMatch) {
          setInfo(null);
          setLoading(false);
          return;
        }
  
        // 2️⃣ Get the full summary from the correct Wikipedia title
        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            bestMatch
          )}`
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
  
        // 3️⃣ Fetch images
        const imagesRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            bestMatch
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
            try {
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
            } catch {
              return null;
            }
          })
        );
  
        setImages(imageInfos.filter(Boolean));
  
        // 4️⃣ Fetch nearby attractions
        const linksRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            bestMatch
          )}&prop=links&format=json&pllimit=50&origin=*`
        );
        const linksData = await linksRes.json();
        const linkPages = Object.values(linksData.query.pages)[0].links || [];
        const filtered = linkPages
          .map((l) => l.title)
          .filter((title) =>
            /(Palace|Temple|Fort|Museum|Park|Garden|Beach|Tower|Monument|Attraction)/i.test(
              title
            )
          );
        setAttractions(filtered.slice(0, 10));
      } catch (error) {
        console.error("❌ Error fetching destination:", error);
        setInfo(null);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [name]);
  

  if (loading)
    return (
      <div className="destination-page">
        <h2 className="loading-text">⏳ Loading "{name}" details...</h2>
      </div>
    );

  if (!info)
    return (
      <div className="destination-page">
        <h2 className="error-text">No details found for "{name}" 😢</h2>
      </div>
    );

  return (
    <div className="destination-page">
      {/* 🏙️ Main Destination Info */}
      <h1 className="destination-title">{info.title}</h1>

      {info.image && (
        <div className="image-container">
          <img src={info.image} alt={info.title} className="destination-main-img" />
        </div>
      )}

      <p className="destination-desc">{info.description}</p>

      {info.url && (
        <p className="wiki-link">
          <a href={info.url} target="_blank" rel="noopener noreferrer">
            Learn more on Wikipedia →
          </a>
        </p>
      )}

      {/* 🖼️ Gallery */}
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
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            info.title
          )}&output=embed`}
          className="map-iframe"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>

      {/* 🏰 Tourist Attractions */}
      {attractions.length > 0 && (
        <section className="attractions-section">
          <h2>Top Tourist Attractions in {info.title}</h2>
          <ul className="attractions-list">
            {attractions.map((attr, i) => (
              <li key={i}>
                <Link to={`/destination/${encodeURIComponent(attr)}`}>
                  {attr}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
