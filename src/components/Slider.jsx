import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {collection, getDocs, query, orderBy, limit, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import Spinner from "./Spinner"
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Slider() {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {

        const getListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings)
            setLoading(false)
        }

        getListings()

    }, [])

    if(loading){
        return <Spinner/>
    }

  return listings && (
    <>
        <p className="exploreHeading">Recommended</p>

          <Swiper slides-per-view="1" pagination={{ clickable: true }} modules={[Navigation, Pagination, Scrollbar, A11y]} scrollbar={{ draggable: true }}>
            {listings.map(({data, id}) => (
                <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                    <div style={{ background: `url(${data.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover', height: '35vh', }} className="swiperSlideDiv swiperSlideDivClick">
                        <p className="swiperSlideText">{data.name}</p>
                        <p className="swiperSlidePrice">
                            ${data.discountedPrice ?? data.regularPrice}
                            {data.type === 'rent' && '/ month'}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </>
  )
}

export default Slider
