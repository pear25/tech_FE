import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';
import { useStoreState } from 'easy-peasy';

//default map options
const containerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: -3.745,
    lng: -38.523
};

const Map = () => {
    const polylineRef = useRef(null);

    const [mapZoom, setMapZoom] = useState(10)
    const [mapCenter, setMapCenter] = useState(defaultCenter)
    const [mapStart, setMapStart] = useState(defaultCenter)
    const [mapEnd, setMapEnd] = useState(defaultCenter)
    const [polylinePath, setPolylinePath] = useState([]);
    const [loadingDirections, setLoadingDirections] = useState(false);

    const status = useStoreState((state) => state.status)
    const mapData = useStoreState((state) => state.mapData)

    const getMarkerLabel = index => ({
        text: `${index + 1}`,
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 'bold'
    });

    const getMapDataCoordinates = () => {
        const intPath = mapData.path.map(coords => coords.map(x => Number(x)));
        const latLngPath = intPath.map(coords => ({ lat: coords[0], lng: coords[1] }));
        return latLngPath
    }

    //set map based on API result
    useEffect(() => {
        setPolylinePath([])
        const setMap = async () => {
            if (status === 'success' && mapData?.path?.length) {
                setMapZoom(20)
                const latLngPath = getMapDataCoordinates()
                setMapCenter(latLngPath[0]);
                setMapStart(latLngPath[0]);
                setMapEnd(latLngPath[latLngPath.length - 1])
                setLoadingDirections(true);
            }
        };
        setMap();

        if (status === "server error" || status === "fail" || status === "calling") {
            setPolylinePath([])

            if (polylineRef.current != null && polylineRef.current.id === 'polyline') {
                polylineRef.current.setMap(null);
            }

            setMapEnd(defaultCenter)
            setMapStart(defaultCenter)
        }
    }, [status, mapData]);

    // get drivable path
    useEffect(() => {
        if (loadingDirections) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: mapStart,
                    destination: mapEnd,
                    travelMode: window.google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        const route = result.routes[0];
                        const path = route.overview_path;
                        const latLngPath = path.map(point => ({ lat: point.lat(), lng: point.lng() }));
                        setPolylinePath(latLngPath);
                    }
                    // use un-drivable path given by API
                    else {
                        const latLngPath = getMapDataCoordinates()
                        setPolylinePath(latLngPath)
                    }
                    setLoadingDirections(false);
                }
            );
        }
    }, [loadingDirections, mapStart, mapEnd]);

    return (
        <LoadScript
            //using environment variables blocks some features
            googleMapsApiKey={'AIzaSyCfTVRIwC5QnMQGJ-hx05JPdBzK7LT2XjE'} //import.meta.env.GOOGLE_MAPS_API_KEY
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={mapZoom}
            >
                {polylinePath.length > 0 && (
                    <>
                        <Marker position={mapStart} />
                        <Marker position={mapEnd} />
                        <Polyline
                            key={polylinePath.length > 0 ? 'polyline' : `${new Date().getTime()}-polyline`}
                            id="polyline"
                            ref={polylineRef}
                            path={polylinePath}
                            options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 3 }}
                        />
                        {polylinePath.filter((point, index) => {
                            if (index === 0 || index === polylinePath.length - 1) return false
                            return true
                        }).map((point, index) => (
                            <Marker
                                key={`marker-${index}`}
                                position={point}
                                label={getMarkerLabel(index)}
                            />
                        ))}
                    </>
                )}
                <></>
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(Map)