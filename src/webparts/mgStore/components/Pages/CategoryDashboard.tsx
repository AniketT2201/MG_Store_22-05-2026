/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useState , useRef,  useEffect} from "react";
import { Formik } from 'formik';
import { Link, useLocation } from 'react-router-dom';
import type { IMgStoreProps } from '../IMgStoreProps';
import Slider from "react-slick";
import { SPComponentLoader } from '@microsoft/sp-loader';
SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css');
SPComponentLoader.loadCss('https://fonts.googleapis.com/css2?family=Idiqlat:wght@200;300;400&display=swap');
import tshirt from '../../assets/images/limitedtime.png';
import pants from '../../assets/images/limitedtime4.png';
import bags from '../../assets/images/bagsoffer.png';
import appimg from '../../assets/images/appimg.png';
import notification from '../../assets/images/notification.png';
import collectionbag from '../../assets/images/shopping-bag.png';
import tshirtlink from '../../assets/images/t-shirt-Photoroom.png';
import jaketlink from '../../assets/images/jackets1.png';
import shirtlink from '../../assets/images/shirt-Photoroom.png';
import allctegory from '../../assets/images/allcategory.png';
import Jeans from '../../assets/images/Jeans.png';
import Bags from '../../assets/images/bag.png';
import Shoes from '../../assets/images/shoes.png';
import watches from '../../assets/images/watches.png';
import cap from '../../assets/images/cap.png';
import starbox from '../../assets/images/starbox.png';
import mensjacket from '../../assets/images/mensjacket.png';
import menscap from '../../assets/images/menscap.png';
import sellbag from '../../assets/images/sellbag.png';
import womenbot from '../../assets/images/womenshoes.png';
import jeansstylemens from '../../assets/images/jeansstylemens.png';
import Jeansstylesh from '../../assets/images/Jeansstylesh.png';
import shoesstylesh from '../../assets/images/shoesstylesh.png';
import hoodleshirt from '../../assets/images/hoodleshirt.png';
import Shirtpopup1 from '../../assets/images/Shirtpopup1.png';
import Shirtpopup2 from '../../assets/images/Shirtpopup2.png';
import Shirtpopup3 from '../../assets/images/Shirtpopup3.png';
import Shirtpopup4 from '../../assets/images/Shirtpopup4.png';
import Shirtpopup5 from '../../assets/images/Shirtpopup5.png';
import Shirtpopupmain from '../../assets/images/Shirtpopupmain.png';
import jackets1 from '../../assets/images/jackets1.png';
import jocketpop2 from '../../assets/images/jackets2.png';
import jocketpop3 from '../../assets/images/jocketpop3.png';
import jackets5 from '../../assets/images/jackets5.png';
import jackets4 from '../../assets/images/jackets4.png';
import blacktshirt from '../../assets/images/blacktshirt.png';
import commontshirt from '../../assets/images/commontshirt.png';
import bagsoffer from '../../assets/images/bagsoffer.png';
import offershoesbanner from '../../assets/images/offershoesbanner.png';
import TShirt1 from '../../assets/images/T-Shirt-1.png';
import TShirt2 from '../../assets/images/T-Shirt2.png';
import TShirt3 from '../../assets/images/T-Shirt3.png';
import TShirt4 from '../../assets/images/T-Shirt4.png';
import flashcap1 from '../../assets/images/flashcap1.png';
import flashcap2 from '../../assets/images/flashcap2.png';
import flashcap3 from '../../assets/images/flashcap3.png';
import flashcap4 from '../../assets/images/flashcap4.png';
import mensboot1 from '../../assets/images/mensboot1.png';
import mensboot2 from '../../assets/images/mensboot2.png';
import mensboot3 from '../../assets/images/mensboot3.png';
import mensboot4 from '../../assets/images/mensboot4.png';
import TShirt11 from '../../assets/images/T-Shirt11.png';
import TShirt12 from '../../assets/images/T-Shirt12.png';
import TShirt13 from '../../assets/images/T-Shirt13.png';
import TShirt14 from '../../assets/images/T-Shirt14.png';
import TShirt21 from '../../assets/images/T-Shirt21.png';
import TShirt22 from '../../assets/images/T-Shirt22.png';
import TShirt23 from '../../assets/images/T-Shirt23.png';
import TShirt24 from '../../assets/images/T-Shirt24.png';
import TShirt31 from '../../assets/images/T-Shirt31.png';
import TShirt32 from '../../assets/images/T-Shirt32.png';
import TShirt33 from '../../assets/images/T-Shirt33.png';
import TShirt34 from '../../assets/images/T-Shirt34.png';
import TShirt41 from '../../assets/images/T-Shirt41.png';
import TShirt42 from '../../assets/images/T-Shirt42.png';
import TShirt43 from '../../assets/images/T-Shirt43.png';
import TShirt44 from '../../assets/images/T-Shirt44.png';


SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css');
SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css');
import { Dropdown, IDropdownOption, TextField, Stack } from '@fluentui/react';
import { Modal } from '@fluentui/react';

import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
import { Navigation } from 'swiper/modules';

interface ICategoryItem {
  name: string;
  img: string;
}
interface IProduct {
  title: string;
  price: string;
  oldPrice: string;
  img: string;
    images: string[];        
  category: string;     
  discount?: string; 
}
interface IProducttoday {
  title: string;
  price: string;
  oldPrice: string;
  img: string;
   images: string[];        
  category?: string;     
  discount?: string; 
}
type SizeType = {
  label: string;
  chest: number;
  shoulder: number;
  length: number;
  sleeve: number;
};
  export const CategoryDashboard: React.FunctionComponent<IMgStoreProps> = (props: IMgStoreProps) => {
    // get data from next page 
  const location = useLocation();

const params = new URLSearchParams(location.search);
const category = (params.get("category") ?? "all")
  .replace(/\+/g, " ")   // convert + to space
  .toLowerCase()
  .trim();

    const settings = {
     dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
   arrows: false,
    autoplay: false,
  autoplaySpeed: 2000,
  };
 const slides = [
  {
    id: 1,
    category: "T-Shirt",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: commontshirt
  },
  {
    id: 2,
    category: "T-Shirt",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: blacktshirt
  },


  {
    id: 3,
    category: "Bag",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: bagsoffer
  },
  {
    id: 4,
    category: "Shoes",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: offershoesbanner
  }
  ,
  {
    id: 5,
    category: "Jacket",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: jackets1
  }
  ,
  {
    id: 6,
    category: "Jeans",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: Jeans
  }
    ,
  {
    id: 7,
    category: "Cap",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: cap
  }
    ,
  {
    id: 8,
    category: "Watches",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image:watches

  },
  {
    id: 9,
    category: "Shirt",
    tag: "#Big Fashion Sale",
    title: "Limited Time Offer",
    subtitle: "Up to 50% OFF!",
    description: "Redefine Your Everyday Style",
    image: shirtlink
  }
];
const categoryOptions: IDropdownOption[] = [
  { key: 'all', text: 'All Category' },
  { key: 'electronics', text: 'Electronics' },
  { key: 'books', text: 'Books' },
  { key: 'clothing', text: 'Clothing' }
];
const items: ICategoryItem[] = [
  { name: "T-Shirt", img: tshirtlink },
  { name: "Jacket", img: jaketlink },
  { name: "Shirt", img: shirtlink },
  { name: "Jeans", img: Jeans },
  { name: "Bag", img: Bags },
  { name: "Shoes", img: Shoes },
  { name: "Watches", img: watches },
  { name: "Cap", img: cap },
  { name: "All Category", img: allctegory }
];
const products: IProduct[] = [
  {
    title: "EliteShield Performance Men's TShirt",
    category: "T-Shirt",
    price: "Rp255.000",
    oldPrice: "Rp525.000",
    img: Shirtpopupmain,
     images: [Shirtpopupmain, Shirtpopup1, Shirtpopup2, Shirtpopup3] 
  },
  {
    title: "EliteShield Performance Men's TShirt",
    category: "T-Shirt",
    price: "Rp300.000",
    oldPrice: "Rp600.000",
    img: TShirt1,
    images: [TShirt1, TShirt2, TShirt3, TShirt4]
  },
  {
    title: "EliteShield Performance Men's TShirt",
    category: "T-Shirt",
    price: "Rp1200.000",
    oldPrice: "Rp2000.000",
    img: TShirt11,
    images: [TShirt11, TShirt12, TShirt13, TShirt14]
  },
  
  {
    title: "EliteShield Performance Men's TShirt",
    category: "T-Shirt",
    price: "Rp1300.000",
    oldPrice: "Rp2500.000",
    img: TShirt21,
    images: [TShirt21, TShirt22, TShirt23, TShirt24]
  }
  ,

  {
    title: "EliteShield Performance Men's TShirt",
    category: "T-Shirt",
    price: "Rp1300.000",
    oldPrice: "Rp2500.000",
    img: TShirt31,
    images: [TShirt31, TShirt32, TShirt33, TShirt34]
  },
  {
    title: "EliteShield Performance Men's TShirt",
    category: "T-Shirt",
    price: "Rp1300.000",
    oldPrice: "Rp2500.000",
    img: TShirt41,
    images: [TShirt41, TShirt42, TShirt43, TShirt44]
  },
   {
    title: "EliteShield Performance Men's Jackets",
    category: "Jacket",
    price: "Rp255.000",
    oldPrice: "Rp525.000",
    img: jaketlink,
    images: [jaketlink, jackets5, jocketpop2, jackets4]
  },
  {
    title: "EliteShield Performance Men's Jackets",
    category: "Jacket",
    price: "Rp255.000",
    oldPrice: "Rp525.000",
    img: jaketlink,
    images: [jaketlink, jackets5, jocketpop2, jackets4]
  },
  {
    title: "Elegant Gentlemen's Summer Gray Hat",
    category: "Cap",
    price: "Rp99.000",
    oldPrice: "Rp150.000",
    img: flashcap1,
    images: [flashcap1, flashcap2, flashcap3, flashcap4]
  },
  {
    title: "OptiZoom Camera Shoulder Bag for Easy Carry",
    category: "Bag",
    price: "Rp250.000",
    oldPrice: "Rp425.000",
    img: sellbag,
    images: [sellbag, sellbag, sellbag, sellbag]
  },
  {
    title: "Cloudy Chic Heeled Sandals for Everyday Elegance",
    category: "shoes",
    price: "Rp270.000",
    oldPrice: "Rp580.000",
    img: womenbot,
    images: [womenbot, womenbot, womenbot, womenbot]
  }
];
    const [openMenu, setOpenMenu] = React.useState("");
     const [isCollapsed, setIsCollapsed] = React.useState(true);
     const [open, setOpen] = useState(false);
     const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchText, setSearchText] = React.useState<string>('');
  const [showPopup, setShowPopup] = React.useState(false);
//const [selectedItem, setSelectedItem] = React.useState(null);
const [selectedItem, setSelectedItem] = useState<any>(null);
  const onCategoryChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    setSelectedCategory(option?.key as string);
  };
const [time, setTime] = React.useState(3600);
  const onSearchChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setSearchText(newValue || '');
  };
  const [selectedImage, setSelectedImage] = React.useState('');
    React.useEffect(() => {
      const timer = setInterval(() => {
    setTime((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
   },
     
   
    []);
React.useEffect(() => {
  if (selectedItem) {
    setSelectedImage(selectedItem.images[0]);
  }
}, [selectedItem]);

const openPopup = (item: any) => {
    setSelectedItem(item);
    setSelectedImage(item.images[0]);
  };
//   const handleClick = (item:any) => {
//   setSelectedItem(item);
//   setShowPopup(true);
// };
const productspopup = [
  {
    category: "T-Shirt",
    name: "This Ben Hogan Men's Solid Ottoman Golf Polo Shirt",
    price: "Rp187.500",
    oldPrice: "Rp250.000",
    discount: "25% off",
    images: [Shirtpopupmain, Shirtpopup1, Shirtpopup2, Shirtpopup3] // multiple images
  },
  {
    category: "Jacket",
    name: "Winter Jacket",
    price: "Rp350.000",
    oldPrice: "Rp500.000",
    discount: "30% off",
    images: [jaketlink, jackets5, jocketpop2,jackets4]
  }
];
const handleClick = (category: string) => {
  const selectedProduct = productspopup.find(
    (item) => item.category === category
  );

  if (selectedProduct) {
    setSelectedItem(selectedProduct); // ✅ no error now
    setShowPopup(true);
  }
};

const closePopup = () => {
  setShowPopup(false);
  setSelectedItem(null);
};
const swiperRef = React.useRef<any>(null);
const getDiscountPercent = (price: string, oldPrice: string) => {
  const clean = (val: string) =>
    Number(val.replace("Rp", "").replace(/\./g, ""));

  const newPrice = clean(price);
  const old = clean(oldPrice);

  const discount = ((old - newPrice) / old) * 100;
  return Math.round(discount);
};



// code for slider 
const categoryParam = category?.toLowerCase();

const filteredSlides =
  category === "all category" || category === "all"
    ? slides
    : slides.filter(
        (item) =>
          item.category?.toLowerCase() === category
      );
// const filteredProducts =
//   !categoryParam || categoryParam === "all"
//     ? products
//     : products.filter(
//         (item) => item.category.toLowerCase() === categoryParam
//       );

const normalizedParam = categoryParam
  ? decodeURIComponent(categoryParam).toLowerCase().trim()
  : "all";
  const filteredProducts =
  !normalizedParam || normalizedParam === "all" || normalizedParam === "all category"
    ? products
    : products.filter(
        (item) => item.category.toLowerCase() === normalizedParam
      );

  const displayProducts = filteredProducts.slice(0, 6);

  const filteredmockProducts = products.filter(item =>
    categoryParam || categoryParam === "all"
    ? item.category.toLowerCase() === categoryParam.toLowerCase()
    : true
);

const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
const sizes = [

  { label: "S", chest: 38, shoulder: 16, length: 26, sleeve: 8 },
  { label: "M", chest: 40, shoulder: 17, length: 27, sleeve: 8.5 },
  { label: "L", chest: 42, shoulder: 18, length: 28, sleeve: 9 },
  { label: "XL", chest: 44, shoulder: 19, length: 29, sleeve: 9.25 },
  { label: "XXL", chest: 47, shoulder: 20, length: 30, sleeve: 9.5 }
];

    return (
        <Formik initialValues={{ DeviationRequest: '', Attachment: '' }}
            validationSchema={""} // Add your validation schema here.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={(values: any) => {
                // Handle form submission
                console.log(values);
            }}
        >
            {() => (
                
               <div className="mainsection">
                <div style={{display:'none'}}>
                  <h1>{category}</h1>
                </div>
                <div className='row'>
                    <div className='col-md-3 col-sm-3'>
                        <div className='appsection'>
                            <img src={appimg} /> <div className='apptxt'>Download MG App</div>
                        </div>
                    </div>
                    <div className='col-md-9 col-sm-9'>
                        <div>
                            <nav className='navbar'>
      
      

                            <div
                              className='hamburger'
                              onClick={() => setOpen(!open)}
                            >
                              ☰
                            </div>

                            <ul className={`navLinks ${open ? 'active' : ''}`}>
                              <li><a href="#">MG</a></li>
                              <li><a href="#">About MG</a></li>
                              <li><a href="#">MG Care</a></li>
                              <li><a href="#">Promo</a></li>
                              <li><a href="#" style={{color:"#000"}}>Sign Up</a></li>
                              <li><a href="#" style={{color:"#000"}}>Login</a></li>
                            </ul>

                          </nav>
                        </div>
                    </div>
                </div>
                <div className='row border-box' style={{display:'none'}}>
                    <div className='col-md-1'>
                          <div className='comtxt'>MG.com</div>
                    </div>
                        <div className='col-md-10'>
                            <Stack horizontal tokens={{ childrenGap: 0 }} styles={{ root: { maxWidth: 600 } }}>
      
      {/* Dropdown */}
      <Dropdown
        selectedKey={selectedCategory}
        options={categoryOptions}
        onChange={onCategoryChange}
        styles={{
          root: { width: 180 },
          dropdown: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }
        }}
      />

      {/* Search box */}
      <TextField
        placeholder="Search product or brand here..."
        value={searchText}
        onChange={onSearchChange}
        styles={{
          root: { flexGrow: 1 },
          fieldGroup: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }
        }}
      />
    </Stack>
                    </div>
                      <div className='col-md-1'>
                        <div className='collectionsection'>
                          
                        <img src={collectionbag}  className='collbox'/>
                          <img src={notification} className='notibox'/>
                        </div>
                    </div>
                </div>
                
                    <div className='container-fluid mt-21 categorydashboard'>
                       <Slider {...settings}>
  {filteredSlides.map(item => (
    <div key={item.id} className="slide">

      <div className="slide-content">
        <p className="tagtitle">{item.tag}</p>
        <h1>{item.title}</h1>
        <h2>{item.subtitle}</h2>
        <p>{item.description}</p>
      </div>

      <div className="slide-image">
        <img src={item.image} alt={item.title} />
      </div>

    </div>
  ))}
</Slider>
                    </div>
                  
                    <div className='row'>
                      <div className='swiperbox'>
                              <div className="flashSaleHeader">
                                <div className='flashtxt d-inline'>
                                  <img src={starbox} className='star-box'/>Flash Sale
                                </div>
                                     <div className='d-inline'>
                                        <p>
                                          <span className='countbox'>{Math.floor(time / 3600)}</span> :
                                          <span className='countbox'>{Math.floor((time % 3600) / 60)}</span> :
                                          <span className='countbox'>{time % 60}</span>
                                        </p>
                                     </div>
                                      <div className="customArrows">
                                        <button onClick={() => swiperRef.current.slidePrev()}>←</button>
                                        <button onClick={() => swiperRef.current.slideNext()}>→</button>
                                      </div>
                                    </div>

                                    <Swiper
  modules={[Navigation]}
  spaceBetween={15}
  slidesPerView={6}
  navigation={false}
  breakpoints={{
    320: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    1280: { slidesPerView: 6 }
  }}
  onSwiper={(swiper) => (swiperRef.current = swiper)}
>
  {displayProducts.map((item: IProduct, index: number) => {
    const discountPercent = getDiscountPercent(item.price, item.oldPrice);

    return (
      <SwiperSlide key={index}>
        <div
          className="card"
          onClick={() => {
            setSelectedItem(item);
            setSelectedImage(item.images[0]);
            setShowPopup(true);
          }}
        >
          <i className="fa fa-heart" aria-hidden="true"></i>

          <div className="outerdiv">
            <img src={item.img} className="productImg" />
          </div>

          <div className="cardBody">
            <p className="title">{item.title}</p>
            <h4 className="price">{item.price}</h4>
            <span className="oldPrice">{item.oldPrice}</span>

            <div className="progressBar">
              <div
                className="progress"
                style={{ width: `${discountPercent}%` }}
              />
            </div>
          </div>
        </div>
      </SwiperSlide>
    );
  })}
</Swiper>
                      </div>
                    </div>
                    <div className='row'>
                     <div className='flashtxt pd-10'> 
                      More results
                     </div>
                      </div>
                      <div className="row moreresultsection">
                        {displayProducts.map((item: IProduct, index: number) => {
                          const discountPercent = getDiscountPercent(item.price, item.oldPrice);

                          return (
                            <div className="col-md-3 col-sm-6 mb-4" key={index}>
                              <div
                                className="card h-100"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setSelectedImage(item.images[0]);
                                  setShowPopup(true);
                                }}
                              >
                                <i className="fa fa-heart" aria-hidden="true"></i>

                                <div className="outerdiv">
                                  <img src={item.img} className="productImg" />
                                </div>

                                <div className="cardBody">
                                  <p className="title">{item.title}</p>
                                  <h4 className="price">{item.price}</h4>
                                  <span className="oldPrice">{item.oldPrice}</span>

                                  <div className="progressBar">
                                    <div
                                      className="progress"
                                      style={{ width: `${discountPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    <div className='popupmodal'>
                      <Modal
                        isOpen={showPopup}
                        onDismiss={closePopup}
                        isBlocking={false}
                      >
                        <div className='containersection'>
                          <div className="mainsection">
                            
                            <div className='closebtnbox'>
                             <i className="fa fa-times-circle" aria-hidden="true"  onClick={closePopup}></i>
                            </div>
                <div className='row'>
                    <div className='col-md-4 col-sm-12'>
                        <div className='appsection'>
                            <img src={appimg} /> <div className='apptxt'>Download MG App</div>
                        </div>
                    </div>
                    <div className='col-md-8 col-sm-12'>
                        <div>
                            <nav className='navbar'>
      
      

                            <div
                              className='hamburger'
                              onClick={() => setOpen(!open)}
                            >
                              ☰
                            </div>

                            <ul className={`navLinks ${open ? 'active' : ''}`}>
                              <li><a href="#">MG</a></li>
                              <li><a href="#">About MG</a></li>
                              <li><a href="#">MG Care</a></li>
                              <li><a href="#">Promo</a></li>
                              <li><a href="#" style={{color:"#000"}}>Sign Up</a></li>
                              <li><a href="#" style={{color:"#000"}}>Login</a></li>
                            </ul>

                          </nav>
                        </div>
                    </div>
                </div>
                <div className='row border-box' >
                    <div className='col-md-1'>
                          <div className='comtxt'>MG.com</div>
                    </div>
                        <div className='col-md-9'>
                            <Stack horizontal tokens={{ childrenGap: 0 }} styles={{ root: { maxWidth: 600 } }}>
      
      {/* Dropdown */}
      <Dropdown
        selectedKey={selectedCategory}
        options={categoryOptions}
        onChange={onCategoryChange}
        styles={{
          root: { width: 180 },
          dropdown: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }
        }}
      />

      {/* Search box */}
      <TextField
        placeholder="Search product or brand here..."
        value={searchText}
        onChange={onSearchChange}
        styles={{
          root: { flexGrow: 1 },
          fieldGroup: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }
        }}
      />
    </Stack>
                    </div>
                      <div className='col-md-2'>
                        <div className='collectionsection'>
                          
                        <img src={collectionbag}  className='collbox'/>
                          <img src={notification} className='notibox'/>
                        </div>
                    </div>
                </div>
                
                   
                  
                   
                   
                    
                </div>
                        </div>
                        <div style={{ padding: 20 }}>
                          <div>
 
                          {/* Popup */}
                          {selectedItem && (
                            <div className="product-popup">
                              <div className="product--container row">

                                {/* LEFT IMAGE SECTION */}
                                <div className="product-image col-md-7 col-sm-12">
                                    <div className='col-md-3'>
                                       <div className="thumbnailContainer">
                                    {selectedItem.images.map((img: string, index: number) => (
                                      <img
                                        key={index}
                                        src={img}
                                        className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(img)}
                                      />
                                    ))}
                                  </div>
                                    </div>
                                    <div className='col-md-9'>
                                      <div className="mainImageContainer">
                                    <img
                                      src={selectedImage}
                                      alt={selectedItem.name}
                                      className="mainImage"
                                    />
                                  </div>
                                    </div>
                                  {/* Thumbnails */}
                                 

                                  {/* Main Image */}
                                  

                                </div>

                                {/* RIGHT DETAILS */}
                                <div className="product-details col-md-5 col-sm-12">
                                  <h3>{selectedItem.title}</h3>

                                  <div className="price-section">
                                    <div className='popuppricebox'>{selectedItem.price}</div>
                                    <div>
                                      <span className="old--price">{selectedItem.oldPrice}</span>
                                    <span className="discount discountprice">{selectedItem.discount}</span>
                                    </div>
                                    
                                  </div>
 
                                  <div className="size-section">
  <div>
      <h5>Select Size :
        {selectedSize && (
          <span style={{ fontWeight: "600", paddingLeft:'10px' }}>
         {  selectedSize.label}
          </span>
        
        )}
        <span
        onClick={() => setOpen(true)}
        style={{
          fontWeight: 600,
          paddingLeft: "10px",
          color: "green",
          cursor: "pointer"
        }}
      >
        Size Chart
      </span>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
        <div className={`traybox drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Size Chart</h3>
          {/* <button onClick={() => setOpen(false)}>✕</button> */}
           <i className="fa fa-times-circle" aria-hidden="true"  onClick={() => setOpen(false)}></i>
        </div>

        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest</th>
              <th>Shoulder</th>
              <th>Length</th>
              <th>Sleeve Length</th>
            </tr>
          </thead>
          <tbody>
            {/* <tr><td>XS</td><td>40</td><td>19</td><td>26</td><td>7</td></tr> */}
            <tr><td>S</td><td>38</td><td>16</td><td>26</td><td>8</td></tr>
            <tr><td>M</td><td>40</td><td>17</td><td>27</td><td>8.5</td></tr>
            <tr><td>L</td><td>42</td><td>18</td><td>28</td><td>9</td></tr>
            <tr><td>XL</td><td>44</td><td>19</td><td>29</td><td>9.25</td></tr>
            <tr><td>XXL</td><td>50</td><td>21</td><td>31</td><td>9.75</td></tr>
            
          </tbody>
        </table>
      </div>
      <div>

      </div>
      
      </h5>
      
      <h5>
        {selectedSize && (
          <span style={{ fontWeight: "normal" }}>
          Chest: {selectedSize.chest} inch 
          </span>
        )}
      </h5>
      {/* Size Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {sizes.map((size) => (
          <button
            key={size.label}
            onClick={() => setSelectedSize(size)}
            style={{
              padding: "8px 14px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor:
                selectedSize?.label === size.label ? "black" : "white",
              color:
                selectedSize?.label === size.label ? "white" : "black",
              borderRadius: "5px",
              transition: "0.2s"
            }}
          >
            {size.label}
          </button>
        ))}
      </div>

      {/* Selected Size Details */}
      
    </div>
</div>

                                  <button className="buy-btn btn bybtn">Buy this Item</button>
                                  <button className="cart-btn btn addtobagbtn">Add to Bag</button>
                                </div>

                              </div>

                              {/* <button className="close-btn" onClick={closePopup}>Close</button> */}
                            </div>
                          )}

                        </div>
                        </div>
                      </Modal>
                    </div>
                </div>
               
                
            )}
        </Formik>   
    );
};
