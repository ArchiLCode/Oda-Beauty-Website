import { defineQuery } from 'groq';

const imageProjection = `{
  alt,
  "url": asset->url
}`;

export const landingContentQuery = defineQuery(`{
  "landing": *[_type == "landingPage" && _id == "landingPage"][0]{
    seo,
    nav,
    contacts,
    socials,
    hero{
      brand,
      subtitle,
      services,
      bookingUrl,
      "desktopImage": desktopImage${imageProjection},
      "mobileImage": mobileImage${imageProjection}
    },
    about{
      title,
      text,
      "image": image${imageProjection}
    },
    reviews
  },
  "categories": *[_type == "serviceCategory"] | order(order asc, title asc){
    id,
    title,
    order,
    "image": image${imageProjection}
  },
  "services": *[_type == "service"] | order(order asc, title asc){
    id,
    "categoryId": category->id,
    title,
    price,
    duration,
    bookingUrl,
    featured,
    order,
    "image": image${imageProjection}
  },
  "team": *[_type == "teamMember"] | order(order asc, name asc){
    id,
    name,
    role,
    bookingUrl,
    order,
    "image": image${imageProjection}
  },
  "gallery": *[_type == "galleryImage"] | order(order asc){
    id,
    order,
    "image": image${imageProjection}
  },
  "brands": *[_type == "brandLogo"] | order(order asc, name asc){
    id,
    name,
    order,
    "image": image${imageProjection}
  },
  "reviews": *[_type == "review"] | order(order asc){
    id,
    author,
    rating,
    text,
    order
  }
}`);

export const jobsContentQuery = defineQuery(`{
  "page": *[_type == "jobsPage" && _id == "jobsPage"][0]{
    seo,
    hero{
      title,
      text,
      ctaLabel,
      ctaUrl,
      "image": image${imageProjection}
    },
    benefits[] | order(order asc){
      id,
      label,
      text,
      icon,
      order
    },
    workBenefits[] | order(order asc){
      id,
      label,
      text,
      icon,
      order
    },
    resumeCta{
      title,
      text,
      buttonLabel,
      url,
      "image": image${imageProjection}
    }
  },
  "vacancies": *[_type == "jobVacancy" && published != false] | order(order asc, title asc){
    id,
    title,
    salary,
    experience,
    requirements,
    applicationUrl,
    buttonLabel,
    published,
    order,
    "image": image${imageProjection}
  }
}`);
