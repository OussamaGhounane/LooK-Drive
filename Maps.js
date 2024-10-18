function initMap() {
    // Récupérer les valeurs de latitude et longitude depuis les champs cachés
    const latitude = parseFloat(document.getElementById('latitude').value) || 33.589886; // Valeur par défaut
    const longitude = parseFloat(document.getElementById('longitude').value) || -7.603869; // Valeur par défaut
    const initialLocation = { lat: latitude, lng: longitude };

    // Initialiser la carte
    const map = new google.maps.Map(document.getElementById("mapContainer"), {
        zoom: 15,
        center: initialLocation,
    });

    // Ajouter un marqueur déplaçable
    const marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        draggable: true,
    });

    // Mettre à jour les champs cachés lorsque le marqueur est déplacé
    google.maps.event.addListener(marker, 'dragend', function (event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
    });

    // Ajouter l'autocomplétion pour le champ d'adresse
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('adresse'));
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            marker.setPosition(place.geometry.location);
            document.getElementById('latitude').value = place.geometry.location.lat();
            document.getElementById('longitude').value = place.geometry.location.lng();
        }
    });
}

// Initialiser la carte à la fin du chargement de la page
google.maps.event.addDomListener(window, 'load', initMap);
