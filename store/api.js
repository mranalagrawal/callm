import {
    GETHOMEPRODUCTBYQUERY,
    GET_META_OBJECT_BY_ID,
    getNewHero,
  } from '../graphql/queries/newHeroQuery'
  import { useHeroStore } from './heroStore'
  import fetch from "node-fetch";

  // NEW HERO START

export async function getHomeProduct(handle = "home", type = "home") {
    try {
      const res = await fetch(
        process.env.DOMAIN,
  
        {
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token":
              process.env.STOREFRONT_ACCESS_TOKEN,
  
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GETHOMEPRODUCTBYQUERY,
            variables: {
              handle: {
                type,
                handle,
              },
            },
          }),
        }
      );
  
      if (!res.ok) {
        console.error("Network response was not ok:", res.statusText);
        throw new Error("Network response was not ok");
      }
  
      const data = await res.json();
  
      const fields = data.data?.metaobject?.fields || [];
  
      // Extract IDs from the response
  
      const idField = fields.find((field) => field.key === "main_banner");
      const ids = idField ? JSON.parse(idField.value) : [];
      // return ids;
  
      await getCurrentHero(ids);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
  
  async function getCurrentHero(ids) {
    try {
      let currentHero = null;
      let mostRecentActiveDate = null;
      for (const id of ids) {
        const res = await fetch(
          process.env.DOMAIN,
    
          {
            method: "POST",
            headers: {
              "X-Shopify-Storefront-Access-Token":
                process.env.STOREFRONT_ACCESS_TOKEN,
          
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: GET_META_OBJECT_BY_ID,
              variables: {
                id,
              },
            }),
          }
        );
        if (!res.ok) {
          console.error("Network response was not ok:", res.statusText);
          throw new Error("Network response was not ok");
        }
  
        const data = await res.json();
        const metaObject = data?.data?.metaobject;
        if (metaObject) {
          const startDate = new Date(
            metaObject.fields.find((field) => field.key === "start_date").value
          );
          if (!mostRecentActiveDate || startDate > mostRecentActiveDate) {
            mostRecentActiveDate = startDate;
            currentHero = metaObject;
          }
        }
      }
      if (currentHero) {
        const name =
          currentHero.fields.find((field) => field.key === "name")?.value ||
          "Unnamed Hero";
        const bannerCarousels = JSON.parse(
          currentHero.fields.find((field) => field.key === "banner_carousel")
            ?.value || "[]"
        );
        const startDate =
          currentHero.fields.find((field) => field.key === "start_date")?.value ||
          "No start date";
        HomBannerCarousel(bannerCarousels);
        return { bannerCarousels, name, startDate };
      }
      return null;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  
  async function HomBannerCarousel(ids, lang) {
    const heroStore = useHeroStore();
    try {
      const heroData = [];
      for (const id of ids) {
        const res = await fetch(
          process.env.DOMAIN,
    
          {
            method: "POST",
            headers: {
              "X-Shopify-Storefront-Access-Token":
                process.env.STOREFRONT_ACCESS_TOKEN,
          
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: getNewHero(lang),
              variables: {
                id,
              },
            }),
          }
        );
        if (!res.ok) {
          console.error("Network response was not ok:", res.statusText);
          throw new Error("Network response was not ok");
        }
  
        const data = await res.json();
        const metaobject = data?.data?.metaobject;
        if (metaobject && metaobject.fields) {
          const backgroundColor =
            metaobject.fields.find((field) => field.key === "background_color")
              ?.value || "";
  
          const imageUrl = metaobject.image?.reference?.image?.url || ""; // Adjust this URL to match your CDN structure
          const link =
            metaobject.fields.find((field) => field.key === "link")?.value || "";
          const text =
            metaobject.fields.find((field) => field.key === "button_text")
              ?.value || "";
          const title =
            metaobject.fields.find((field) => field.key === "title")?.value || "";
  
          const banner = {
            id,
            backgroundColor,
            image: imageUrl,
            link,
            text,
            title,
          };
          heroData.push(banner);
        }
      }
  
      heroStore.setBanners(heroData); // Store mein data set karo
      return heroData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  
  // NEW HERO END