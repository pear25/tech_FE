import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';
import { useStoreState } from 'easy-peasy';
import { BiSolidMap } from "react-icons/bi"


const containerStyle = {
    width: '100%',
    height: '100%'
};

// const Marker = ({ lat, lng }) => (
//     <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
//         <BiSolidMap />
//     </div>
// );

const Map = () => {
    const defaultCenter = {
        lat: -3.745,
        lng: -38.523
    };




    const [mapStart, setMapStart] = useState(defaultCenter)
    const [mapEnd, setMapEnd] = useState(defaultCenter)
    const [polylinePath, setPolylinePath] = useState([]);
    const [mapZoom, setMapZoom] = useState(10)

    const status = useStoreState((state) => state.status)
    const mapData = useStoreState((state) => state.mapData)



    useEffect(() => {
        const setMap = async () => {
            if (status === 'success' && mapData?.path?.length) {
                setMapZoom(20)
                const intPath = mapData.path.map(coords => coords.map(x => Number(x)));
                const latLngPath = intPath.map(coords => ({ lat: coords[0], lng: coords[1] }));
                setMapStart(latLngPath[0]);
                setMapEnd(latLngPath[latLngPath.length - 1])
                setPolylinePath(latLngPath);
            }
        };
        //asd
        setMap();
    }, [status, mapData]);


    return (
        <LoadScript
            googleMapsApiKey="AIzaSyCfTVRIwC5QnMQGJ-hx05JPdBzK7LT2XjE"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapStart}
                zoom={mapZoom}
            >
                {polylinePath.length > 0 && (
                    <Polyline
                        path={polylinePath}
                        options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 3 }}
                    />
                )}
                {mapStart.lat !== defaultCenter.lat && <Marker position={mapStart} />}
                {mapEnd.lat !== defaultCenter.lat && <Marker position={mapEnd} />}


                <></>
            </GoogleMap>
        </LoadScript>
    )
}

export default Map