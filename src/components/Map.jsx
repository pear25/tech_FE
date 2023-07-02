import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import { useStoreState } from 'easy-peasy';


const containerStyle = {
    width: '100%',
    height: '100%'
};

const Map = () => {
    const defaultCenter = {
        lat: -3.745,
        lng: -38.523
    };

    const [mapCenter, setMapCenter] = useState(defaultCenter)
    const [polylinePath, setPolylinePath] = useState([]);
    const [mapZoom, setMapZoom] = useState(10)

    const status = useStoreState((state) => state.status)
    const mapData = useStoreState((state) => state.mapData)

    const stringToInt = (object) => {
        for (const key in object) {
            object[key] = object[key].map((x) => Number(x))
        }
    }


    useEffect(() => {
        const setMap = async () => {
            if (status === 'success' && mapData?.path?.length) {
                setMapZoom(20)
                const intPath = mapData.path.map(coords => coords.map(x => Number(x)));
                const latLngPath = intPath.map(coords => ({ lat: coords[0], lng: coords[1] }));
                setMapCenter(latLngPath[0]);
                setPolylinePath(latLngPath);
            }
            // else {
            //     setMapZoom(10)
            //     setPolylinePath([])
            //     setMapCenter(defaultCenter)
            // }
        };
        setMap();
    }, [status, mapData]);


    return (
        <LoadScript
            googleMapsApiKey="AIzaSyCfTVRIwC5QnMQGJ-hx05JPdBzK7LT2XjE"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={mapZoom}
            >
                {polylinePath.length > 0 && (
                    <Polyline
                        path={polylinePath}
                        options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 3 }}
                    />
                )}
                { /* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        </LoadScript>
    )
}

export default Map