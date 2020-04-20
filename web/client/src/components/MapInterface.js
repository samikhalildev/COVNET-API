import React from 'react'
import { GoogleMap, Marker } from "react-google-maps";

export default (user) => (
    <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: user.coords[0].latitude, lng: user.coords[0].longitude }}
        >
        {user.coords.map(coord => (
            <Marker
                key={coord.timestamp}
                position={{
                    lat: coord.latitude,
                    lng: coord.longitude
                }}
            />
        ))}
    </GoogleMap>
)