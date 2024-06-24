// src/components/Map.js
import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import axios from 'axios';

const Map = () => {
  const [bounds, setBounds] = useState(null);

  const handleCreated = (e) => {
    const { layer } = e;
    const { _northEast, _southWest } = layer.getBounds();
    setBounds({
      northEast: _northEast,
      southWest: _southWest,
    });
  };

  const handleSubmit = async () => {
    if (bounds) {
      try {
        const response = await axios.post('http://localhost:8000/api/coordinates/', bounds, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'image.png');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }
  };

  return (
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: true,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: false,
            }}
            edit={{ remove: false }}
          />
        </FeatureGroup>
      </MapContainer>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Map;
