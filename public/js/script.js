const socket = io();

const markers = {};
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (postion) => {
      const { latitude, longitude } = postion.coords;
      console.log(latitude, longitude);
      socket.emit("locations", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 3000,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

socket.on("receive_location", (data) => {
  const { id, longitude, latitude } = data;
  map.setView([latitude, longitude], 16);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
  console.log("Markers:", markers);
});

socket.on("user_disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
  console.log("User Disconnected:", id,"length is-");
});
